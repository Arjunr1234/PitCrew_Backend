import IproviderRepository, { IAllServices, IBrandData, IProviderServices, IServices } from "../../entities/irepository/iproviderRepo";
import providerModel from "../../framework/mongoose/model/providerSchema";
import OtpModel from "../../framework/mongoose/model/otpSchema";
import { IAddBrandData, IAddingData, IAdminBrand, IEditSubType, ILogData, IProviderBrand, IProviderData,IProviderResponseData, IRemoveBrandData, IRemoveService, IRemoveSubTypeData, ISubTypeData } from "../../entities/rules/provider";
import bcrypt from 'bcrypt'
import serviceModel from "../../framework/mongoose/model/serviceSchema";
import brandModel from "../../framework/mongoose/model/brandSchema";
import providerServiceModel from "../../framework/mongoose/model/providerServiceSchema";
import vehicleTypeModel from "../../framework/mongoose/model/vehicleTypeSchema";
import { response } from "express";

class ProviderRepository implements IproviderRepository {

  
  async providerExist(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const findProvider = await providerModel.findOne({ email });
      if (findProvider) {
        return { success: false, message: "User already exists!" };
      }
      return { success: true };
    } catch (error) {
      throw new Error("Error checking provider existence");
    }
  }

  
  async saveOtp(otp: string, email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const storeOtp = await OtpModel.create({ email, otp });
      return { success: true };
    } catch (error) {
      throw new Error("Error saving OTP");
    }
  }

  async getOtp(email: string, otp: string): Promise<{ success: boolean; otp?:string | undefined }> {
         
        const checkOtp = await OtpModel.findOne({email,otp})
        console.log("This is the response: ", checkOtp);

        if(!checkOtp){
          return {success:false, otp:''}
        }
        return {success:true, otp:checkOtp.otp}

  }

  async createProvider(providerData: IProviderData): Promise<{ success: boolean; message?: string }> {
    try {
      const saltRounds = 10;
  
      
      const hashedPassword = await bcrypt.hash(providerData.password, saltRounds);
  
      
      const {password, ...restProvidedData} = providerData
      const providerCreated = await providerModel.create({
        password: hashedPassword,
        ...restProvidedData,
      });
  
      
      if (!providerCreated) {
        return { success: false, message: 'Provider creation failed' };
      }
  
      
      return { success: true };
  
    } catch (error) {
      
      console.error("Error in createProvider:", error);
      return { success: false, message: 'An error occurred during provider creation' };
    }
  }

  async loginRepo(loginData: ILogData): Promise<{ success: boolean; message?: string,  provider?: IProviderResponseData; }> {
    try {
      const { email, password } = loginData;
      console.log("Entered into loginRepo");
  
      
      const loginResponse = await providerModel.findOne({ email: email });
      
  
     
      if (!loginResponse) {
        return { success: false, message: "Wrong email" };
      }
  
      
      const passwordMatch = await bcrypt.compare(password, loginResponse.password);
  
      
     
      if(loginResponse.requestAccept === null){
        return {success:false, message:"rejected"}
      }
      if(!loginResponse.requestAccept){
        return {success:false, message:"pending"}
      }

      if(loginResponse.blocked){
        return {success:false, message:"blocked"}
      }
      if (!passwordMatch) {
        return { success: false, message: "Wrong password" };
      }
      
  
      console.log("This is the providerResponse: ", loginResponse);
  
      
      const loginResponseObject = loginResponse.toObject();
  
     
      const { password: hashedPassword, ...remainResponse } = loginResponseObject;
      const providerData: IProviderResponseData = {
        ...remainResponse,
        _id: loginResponseObject._id.toString() 
      };
      
      return { success: true, provider:providerData  };
  
    } catch (error) {
      console.log("Error in loginRepo:", error);
      return { success: false, message: "An error occurred during login" };
    }
  }


  async getAllProviderService(id: string, vehicleType: number): Promise<{ success: boolean; message?: string; providerService?: IProviderServices|null; allServices?: IAllServices[]; }> {

    try {

      const findedAllAdminService = await serviceModel.find().lean();

      const providerData: IProviderServices|null = await providerServiceModel.findOne({ workshopId: id });

      const services = findedAllAdminService.map((service) => ({
        ...service,
        _id: service._id.toString()
      }));

      return {
        success: true,
        message: "200",
        providerService: providerData,
        allServices: services,
      }

      
    } catch (error: any) {
      console.log("Error in getallproviderService: ", error)
      return { success: false, message: "something went to wrong getallProviderService" }

    }
  }

  
  
  
  

  async addGeneralOrRoadService(data: IAddingData): Promise<{ success: boolean; message?: string; }> {
    try {

        const {providerId, category, typeId, vehicleType} = data
        console.log("This is the data: ", data)
        

        const serviceData = {
           typeId,
           category,
           subType:[]
        }

        const vehicle = await vehicleTypeModel.findOne({
           _id:vehicleType
        })
       
        if(vehicle?.vehicleType === 2){
           const provider = await providerServiceModel.findOne({
               workshopId:providerId,
               "twoWheeler.typeId":typeId
           })

           if(provider){
             const updateService = await providerServiceModel.findOneAndUpdate(
               {workshopId:providerId, "twoWheeler.typeId":typeId},
               {
                 $push: { "twoWheeler.$": serviceData }, 
               },
               { new: true }
             )
             return {
               success: true,
               message: "Two-wheeler service updated successfully",
             };
             console.log("update ",updateService);
             
           }else{
             const createdProvider = await providerServiceModel.findOneAndUpdate(
               { workshopId: providerId },
               {
                 $push: {
                   twoWheeler: serviceData, 
                 },
               },
               { new: true, upsert: true }
             );
             return {
               success: true,
               message: " Two-wheeler service created successfully",
             };
             console.log("created provider",createdProvider);

           }
           
        }else {
         // four wheller

          const provider = await providerServiceModel.findOne({
             workshopId:providerId,
             "fourWheeler.typeId":typeId
          })
          if (provider) {
            const updateService = await providerServiceModel.findOneAndUpdate(
              { workshopId: providerId, "fourWheeler.typeId": typeId },
              {
                $push: { "fourWheeler.$": serviceData },
              },
              { new: true }
            )
            return {
              success: true,
              message: "Four wheeler service added successfully",
            };
          } else {
            const createProvider = await providerServiceModel.findOneAndUpdate(
              { workshopId: providerId },
              {
                $push: {
                  fourWheeler: serviceData,
                },
              },
              { new: true, upsert: true }
            );
            return {
             success: true,
             message: "New four wheeler service created successfully",
           };
          }
        }

         return {success:true}
     
    } catch (error) {
        console.log("Error occured in addingGeneralOrRoadService: ", error)
        return {success:false, message:"Something went wrong in addGeneralOrRoadServiceRepo"}
    }
}
  
  
async getAllBrandsRepo(providerId: string): Promise<{ 
  success: boolean; 
  message?: string; 
  adminBrand?: IAdminBrand[]; 
  providerBrand?: IProviderBrand[] | [] 
}> {
  try {
   
    const findadminBrand = await brandModel.find({});
    
    
    const provider = await providerModel.findOne(
      { _id: providerId }, 
      { _id: 0, supportedBrands: 1 }
    );

   
    const adminBrand = findadminBrand.map((brand) => ({
      id: brand._id.toString(), 
      brand: brand.brand
    }));

   
    const providerBrand = provider?.supportedBrands?.length 
      ? provider.supportedBrands.map((brand) => ({
          brandId: brand.brandId,
          brandName: brand.brandName
        })) 
      : []; 

    return { 
      success: true, 
      message: "successful", 
      adminBrand, 
      providerBrand 
    };

  } catch (error) {
    console.error("Error in getAllBrandsRepo:", error);
    return { 
      success: false, 
      adminBrand: [], 
      providerBrand: [], 
      message: "An error occurred" 
    };
  }
}



  async addBrandRepo(brandData: IAddBrandData): Promise<{ success: boolean; message?: string; }> {
    const { brandId, brandName, providerId } = brandData

    try {

      if (!brandId || !brandName || !providerId) {
        return { success: false, message: "please provide Id" }
      }

      const existingProvider = await providerModel.findOne({
        _id: providerId,
        "supportedBrands.brandId": brandId 
      });
  
      // If the brandId exists, return false with a message
      if (existingProvider) {
        return { success: false, message: "Brand already exists in supportedBrands" };
      }

      const response = await providerModel.findByIdAndUpdate(
        providerId,
        {
          $push: { supportedBrands: { brandId, brandName } }
        },
        { new: true }
      );

      if (!response) {
        return { success: false, message: "Failed to add Brand" };
      }


      return { success: true, message: "Brand added successfully!!" };


    } catch (error) {
      console.log("Error in addBrandRepo: ", error);
      return { success: false, message: "something went wrong in addBrandRepo" }

    }
  }

  async removeBrandRepo(brandData: IRemoveBrandData): Promise<{ success: boolean; message?: string; }> {
    try {

      const { brandId, providerId } = brandData

      if (!brandId || !providerId) {
        return { success: false, message: "No avaliable information updation" }
      }

      const response = await providerModel.findByIdAndUpdate(
        providerId,
        {
          $pull: { supportedBrands: { brandId } }
        },
        { new: true }
      );

      if (!response) {
        return { success: false, message: "Failed to Remove" }
      }
     
      return { success: true, message: "Successfully removed!!" }

    } catch (error) {
      console.log("Error in removeBrandRepo: ", error);
      return { success: false, message: "Something went wrong" }

    }
  }

  async addSubTypeRepo(data: ISubTypeData): Promise<{ success: boolean; message?: string; }> {
    try {

      const { providerId, serviceId } = data
      const { startingPrice, type, vehicleType } = data.newSubType

      if (!providerId || !serviceId || !startingPrice || !type || !vehicleType) {
        return { success: false, message: "Please Provide the id and datas!!" }
      }

      const newData = { type, startingPrice }
      console.log("This is adding: ////////////////////////////////////////////", newData)

      if (parseInt(vehicleType) === 2) {
        const update = await providerServiceModel.findOneAndUpdate(
          { workshopId: providerId, "twoWheeler.typeId": serviceId },
          { $push: { "twoWheeler.$.subType": newData } },
          { new: true }
        )
        if (update) {
          return {
            success: true,
            message: "Two wheeler subtype added successfully!!"
          }
        }
      } else {
        const update = await providerServiceModel.findOneAndUpdate(
          { workshopId: providerId, "fourWheeler.typeId": serviceId },
          { $push: { "fourWheeler.$.subType": newData } },
          { new: true }
        )
        if (update) {
          return {
            success: true,
            message: "Four wheeler subtype added successfully!!"
          }
        }

      }
      return { success: false, message: "Failed to update the service" }

    } catch (error) {
      console.log("Error in addSubType: ", error)
      return { success: false, message: "Something went to wrong in addSubService" }

    }


  }

  async removeSubTypeRepo(data: IRemoveSubTypeData): Promise<{ success: boolean; message?: string; }> {
    try {
      const { providerId, serviceId, vehicleType, type } = data;
  
      const vehicleField = vehicleType === "2" ? "twoWheeler" : "fourWheeler";
  

      const removeSubType = await providerServiceModel.updateOne(
        { 
          workshopId: providerId,
          [`${vehicleField}.typeId`]: serviceId
        },
        { 
          $pull: { 
            [`${vehicleField}.$.subType`]: { type: type }
          } 
        }
      );
  
      if (removeSubType.modifiedCount > 0) {
        return { success: true, message: "Successfully removed!" };
      } else {
        return { success: false, message: "Failed to remove!" };
      }
  
    } catch (error) {
      console.error("Error in removeSubTypeRepo: ", error);
      return { success: false, message: "Something went wrong in removeSubTypeRepo" };
    }
  }

  
  async editSubTypeRepo(data: IEditSubType): Promise<{ success: boolean; message?: string; }> {
    try {
      const { providerId, serviceId, subType } = data;
  
      
      const update = parseInt(data.subType.vehicleType) === 4
        ? await providerServiceModel.updateOne(
            {
              workshopId: providerId,
              'fourWheeler.typeId': serviceId,
              'fourWheeler.subType.type': subType.type,
            },
            {
              $set: {
                'fourWheeler.$[w].subType.$[s].startingPrice': subType.startingPrice,
              },
            },
            {
              arrayFilters: [
                { "w.typeId": serviceId },
                { "s.type": subType.type },
              ],
            }
          )
        : await providerServiceModel.updateOne(
            {
              workshopId: providerId,
              'twoWheeler.typeId': serviceId,
              'twoWheeler.subType.type': subType.type,
            },
            {
              $set: {
                'twoWheeler.$[w].subType.$[s].startingPrice': subType.startingPrice,
              },
            },
            {
              arrayFilters: [
                { "w.typeId": serviceId },
                { "s.type": subType.type },
              ],
            }
          );
  
      if (update.modifiedCount > 0) {
        return { success: true, message: "Successfully updated!!" };
      } else {
        return { success: false, message: "Failed to update" };
      }
    } catch (error) {
      console.log("Error in editSubType: ", error);
      return { success: false, message: "Something went wrong in editSubTypeRepo" };
    }
  }

  async  removeServiceRepo(data:IRemoveService) {
    try {
      const { providerId, serviceId, vehicleType } = data;
      const vehicleTypeKey = vehicleType === '2' ? "twoWheeler" : "fourWheeler";
  
      
      const removeService = await providerServiceModel.updateOne(
        { 
          workshopId: providerId 
        },
        { 
          $pull: { 
            [vehicleTypeKey]: { typeId: serviceId } 
          } 
        }
      );
  
      
      if (removeService.modifiedCount > 0) {
        return { success: true, message: "Successfully removed" };
      } else {
        return { success: false, message: "No matching service found to remove" };
      }
  
    } catch (error) {
      console.log("Error in removeService: ", error);
      return { success: false, message: 'Something went wrong in removeServiceRepo' };
    }
  }
  
  

  
}

export default ProviderRepository;

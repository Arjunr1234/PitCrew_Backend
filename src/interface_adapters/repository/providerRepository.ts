import IproviderRepository, { IAllServices, IBrandData, IProviderServices, IServices } from "../../entities/irepository/iproviderRepo";
import providerModel from "../../framework/mongoose/model/providerSchema";
import OtpModel from "../../framework/mongoose/model/otpSchema";
import { IAddBrandData, IAddingData, IAddSlotData, IAdminBrand, IEditSubType, IGetSlotData, ILogData, IProfileEdit, IProviderBrand, IProviderData,IProviderRegisterData,IProviderResponseData, IRemoveBrandData, IRemoveService, IRemoveSubTypeData, ISlotData, ISubTypeData, IWorkshopData } from "../../entities/rules/provider";
import bcrypt from 'bcrypt'
import serviceModel from "../../framework/mongoose/model/serviceSchema";
import brandModel from "../../framework/mongoose/model/brandSchema";
import providerServiceModel from "../../framework/mongoose/model/providerServiceSchema";
import vehicleTypeModel from "../../framework/mongoose/model/vehicleTypeSchema";
import { response } from "express";
import BookingSlot from "../../framework/mongoose/model/BookingSlotSchema";
import mongoose from "mongoose";
import { error } from "console";
import BookingModel from "../../framework/mongoose/model/BookingSchema";

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

  async  createProvider(providerData: IProviderRegisterData): Promise<{ success: boolean; message?: string }> {
    try {
      const saltRounds = 10;
      const { workshopName, workshopDetails, ownerName, email, mobile, password } = providerData;
  
      
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      
      const providerRegisterData = {
        workshopName,
        ownerName,
        email,
        password: hashedPassword,
        mobile,
        workshopDetails: {
          address: workshopDetails.address,
          location: {
            type: "Point",
            coordinates: [workshopDetails.coordinates.long, workshopDetails.coordinates.lat], 
          },
        },
      };
  
      
      const providerCreated = await providerModel.create(providerRegisterData);
  
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

  
  
  
  
  async addSlotRepo(data: IAddSlotData): Promise<{ success: boolean; message?: string; slotData?: ISlotData[] }> {
    try {
      const { providerId, startingDate, endingDate, count } = data;
      const start = new Date(startingDate);
      const end = endingDate ? new Date(endingDate) : null;
  
      const createdSlots: ISlotData[] = [];
  
      const addDays = (date: Date, days: number): Date => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + days);
        return newDate;
      };
  
      let currentDate = new Date(start);
      while (end ? currentDate <= end : currentDate <= start) {
        const existingSlot = await BookingSlot.findOne({
          providerId: new mongoose.Types.ObjectId(providerId),
          date: currentDate,
        });
  
        if (!existingSlot) {
          const createdSlot = await BookingSlot.create({
            providerId: new mongoose.Types.ObjectId(providerId),
            date: currentDate,
            count,
            reservedCount: 0,
            bookedCount: 0,
          });
          const updatedSlot = {
             _id:createdSlot._id + "",
             date:createdSlot.date,
             count:createdSlot.count,
             bookedCount:createdSlot.bookedCount
          }
          
          createdSlots.push(updatedSlot);
        }
  
        currentDate = addDays(currentDate, 1);
        if (!end) break;
      }
  
      return {
        success: true,
        slotData: createdSlots,
      };
    } catch (error: any) {
      console.log("Error in addSlotRepo: ", error);
  
      if (error.code === 11000) {
        return { success: false, message: "Slot for the given date already exists." };
      }
  
      return { success: false, message: "Something went wrong in addSlotRepo" };
    }
  }
  
  


  async getAllSlotRepo(providerId: string): Promise<{ success: boolean; message?: string; slotData?: IGetSlotData[]; }> {
      try {

        const findAllSlot = await BookingSlot.find({providerId:providerId}).sort({date:1})

        const data = findAllSlot.map((slot) => ({
          _id:slot._id+"",
          date:slot.date,
          count:slot.count,
          bookedCount:slot.bookedCount
        }))
        console.log("This is the data: ", data)


        if(!findAllSlot){
          return {success:false, message:"Failed to findSlotData"}
        }

        return {success:true, slotData:data}
        
      } catch (error) {
          console.log("Error in getAllSlotRepo: ", error)
          return{success:false, message:"Something went wrong in getAllSlotRepo"}
      }
  }
  

  async updateSlotCountRepo(slotId: string, state: number): Promise<{ success: boolean; message?: string; }> {
    try {
      
      if (!mongoose.Types.ObjectId.isValid(slotId)) {
        return { success: false, message: "Invalid slotId" };
      }
  
      
      if (typeof state !== "number") {
        return { success: false, message: "Invalid state value" };
      }
  
      const updateSlot = await BookingSlot.findByIdAndUpdate(
        slotId,
        { $inc: { count: state } },
        { new: true }
      );
  
      if (!updateSlot) {
        return { success: false, message: "Failed to update Slot" };
      }
  
      return { success: true, message: "Updated successfully!!" };
    } catch (error) {
      console.error("Error in updateSlotCountRepo: ", error);
      return {
        success: false,
        message: "Something went wrong in updateSlotCountRepo",
      };
    }
  }

  async removeSlotRepo(slotId: string): Promise<{ success: boolean; message?: string; }> {
    try {
     
      if (!mongoose.Types.ObjectId.isValid(slotId)) {
        return { success: false, message: "Invalid slotId" };
      }
  
      
      const deletedSlot = await BookingSlot.findByIdAndDelete(slotId);
  
     
      if (!deletedSlot) {
        return { success: false, message: "Slot not found" };
      }
  
      return { success: true, message: "Slot removed successfully" };
    } catch (error) {
      console.error("Error in removeSlotRepo: ", error);
      return {
        success: false,
        message: "Something went wrong in removeSlotRepo",
      };
    }
  }

  async getProviderDetailsRepo(providerId: string): Promise<{ success: boolean; message?: string; providerData?: any; }> {
      try {
         
           const fetchedProvider = await providerModel.findOne({_id:providerId});

           if(!fetchedProvider){
              return {success:false, message:"Failed to fetch Provider"}
           }

           const data = {
               _id:fetchedProvider._id+"",
               workshopName:fetchedProvider.workshopName,
               ownerName:fetchedProvider.ownerName,
               mobile:fetchedProvider.mobile,
               email:fetchedProvider.email,
               workshopDetails:fetchedProvider.workshopDetails,
               about:fetchedProvider.about,
               logoUrl:fetchedProvider.logoUrl
           }
          

           return {success:true, providerData:data }
      } catch (error) {
         console.log("Error in getProviderDetailsRepo: ", error)
         return{success:false, message:"Something went wrong in getProviderDetailsRepo"}
      }
  }

  async editProfileRepo(data: IProfileEdit): Promise<{ success: boolean; message?: string; }> {
      try {

         const {providerId, workshopName, ownerName, phone, about} = data

         const updateProvider = await providerModel.findByIdAndUpdate(
                      providerId,
                      {
                        $set:{
                          workshopName:workshopName,
                          ownerName:ownerName,
                          mobile:phone,
                          about:about
                        }
                      },
                      {new:true}
         )

         if(!updateProvider){
            return{success:false, message:'Failed to update Provider'}
         }
           
         return {success:true, message:"Successfully updated"}
        
      } catch (error) {
          console.log("Error in editProfileRepo: ", error);
          return {success:false, message:"Something went wrong"}
        
      }
  }

  async updateProfileImageRepo(providerId: string, imageUrl: string): Promise<{ success: boolean; message?: string; prevImgUrl?: string | null; newImgUrl?: string; }> {
        try {
             const prevData = await providerModel.findById(providerId).select('logoUrl');

             const updateImage = await providerModel.findByIdAndUpdate(
                                          providerId,
                                          {
                                            $set:{
                                              logoUrl:imageUrl
                                            }
                                          },
                                          {new:true}
             );
             

             if(!updateImage){
                 return{success:false, message:"Something went wrong in updateImage"}
             }
                return{success:true,  message:"Successfully updated", newImgUrl:updateImage.logoUrl, prevImgUrl:prevData?.logoUrl}
          
        } catch (error) {
             console.log("Error occured in the updateProfileImage Repo: ", error);
             return {success:false, message:"Something went wrong in updateProfileImage Repo"}
          
        }
  }
  
  async getAllBookingRepo(providerId: string): Promise<{ success: boolean; message?: string; bookingData?: any; }> {
      try {
             

             const fetchBooking = await BookingModel.aggregate([
              {
                $match: {
                  providerId: new mongoose.Types.ObjectId(providerId),
                },
              },
              {
                $lookup:{
                  from:"users",
                  localField:"userId",
                  foreignField:"_id",
                  as:"userData"
                }
              },
              {$unwind:"$userData"},
              {
                $lookup: {
                  from: "services", 
                  localField: "serviceId", 
                  foreignField: "_id", 
                  as: "serviceDetails", 
                },
              },
              {
                $unwind: "$serviceDetails", 
              },
              {
                $lookup:{
                  from:"providers",
                  localField:"providerId",
                  foreignField:"_id",
                  as:"providerData"
                }
              },
              {
                $unwind:"$providerData"
              },
              {
                $project:{
                  _id:1,
                  serviceType:1,
                  userId:1,
                  providerId:1,
                  slotId:1,
                  serviceId:1,
                  vehicleDetails:1,
                  location:1,
                  bookingDate:1,
                  amount:1,
                  platformFee:1,
                  subTotal:1,
                  paymentId:1,
                  reason:1,
                  paymentStatus:1,
                  status:1,
                  selectedSubServices:1,
                  providerImage:"$providerData.logoUrl",
                  userData:{
                    _id:1,
                    name:1,
                    phone:1,
                    email:1, 
                    imageUrl:1,
                  },
                  serviceDetails:{
                    _id:1,
                    category:1,
                    serviceType:1,
                    imageUrl:1
                  }
                }
              }
            ]);

            console.log("This is the fucking data: ", fetchBooking)

             if(!fetchBooking){
                return {success:false, message:"Failed to fetchBooking"}
             }

             return {success:true, bookingData:fetchBooking}       
      } catch (error) {
            console.log("Error in getAllBookingRepo", error);
            return {success:false, message:"Something went wrong in getAllBookingRepo"}
        
      }
  }

  async  changeBookingStatusRepo(bookingId: string, status: string): Promise<{ success: boolean; message?: string }> {
    try {
      

      const result = await BookingModel.updateOne(
        { _id: bookingId },
        { $set: { status } } 
      );
  
      if (result.modifiedCount === 0) {
        return { success: false, message: "No booking found with the given ID or status is already the same" };
      }
  
      return { success: true, message: "Booking status updated successfully" };
  
    } catch (error) {
      console.log("Error in changeBookingStatusRepo: ", error);
      return { success: false, message: "Something went wrong in changeBookingStatusRepo" };
    }
  }


  async  resetPasswordRepo(
    providerId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{success:boolean, message?:string}> {
    try {
      
      const provider = await providerModel.findById(providerId); 
      if (!provider) {
        return { success: false, message: 'Provider not found' };
      }
  
      
      const isPasswordValid = await bcrypt.compare(currentPassword, provider.password);
      if (!isPasswordValid) {
        return { success: false, message: 'Current password is incorrect' };
      }
  
      
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      
      provider.password = hashedNewPassword;
      await provider.save(); 
  
      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      console.error('Error in resetPasswordRepo: ', error);
      return { success: false, message: 'Something went wrong in resetPasswordRepo' };
    }
  }

  async getSingleBookingRepo(bookingId: string): Promise<{ success: boolean; message?: string; bookingData?: any; }> {
      try {

         const booking = await BookingModel.findById(bookingId).select("reviewAdded");
         let fetchedBookingData

         !booking?.reviewAdded ?
            // if review is not added there is no review data(otherwise there will a error occur)
           fetchedBookingData = await BookingModel.aggregate([
             {$match:
              {_id:new mongoose.Types.ObjectId(bookingId)}
             },
             {
              $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"userData"
              }
            },
            {$unwind:"$userData"},
            {
              $lookup: {
                from: "services", 
                localField: "serviceId", 
                foreignField: "_id", 
                as: "serviceDetails", 
              },
            },
            {
              $unwind: "$serviceDetails", 
            },
           
            // {
            //   $lookup:{
            //     from:"ratingreviews", 
            //     localField:"_id",
            //     foreignField:"bookingId",
            //     as:"rating"
            //   }
            // },
            // {
            //   $unwind:"$rating"
            // },
            {
              $lookup:{
                from:"providers",
                localField:"providerId",
                foreignField:"_id",
                as:"providerDetails"
              }
            },
            {
              $unwind:"$providerDetails"
            },
            {
              $project:{
                _id:1,
                serviceType:1,
                userId:1,
                providerId:1,
                slotId:1,
                serviceId:1,
                vehicleDetails:1,
                location:1,
                bookingDate:1,
                amount:1,
                platformFee:1,
                subTotal:1,
                paymentId:1,
                reason:1,
                paymentStatus:1,
                status:1,
                selectedSubServices:1,
                reviewAdded:1,
                
               
                providerDetails:{
                      workshopName:1,
                      ownerName:1,
                      email:1,
                      mobile:1,
                      workshopDetails:1,
                      logoUrl:1
                    },
                providerImage:"$providerData.logoUrl",
                userData:{
                  _id:1,
                  name:1,
                  phone:1,
                  email:1, 
                  imageUrl:1,
                },
                serviceDetails:{
                  _id:1,
                  category:1,
                  serviceType:1,
                  imageUrl:1
                }
              }
            }
             
          ]):
          fetchedBookingData = await BookingModel.aggregate([
            {$match:
             {_id:new mongoose.Types.ObjectId(bookingId)}
            },
            {
             $lookup:{
               from:"users",
               localField:"userId",
               foreignField:"_id",
               as:"userData"
             }
           },
           {$unwind:"$userData"},
           {
             $lookup: {
               from: "services", 
               localField: "serviceId", 
               foreignField: "_id", 
               as: "serviceDetails", 
             },
           },
           {
             $unwind: "$serviceDetails", 
           },
          
           {
             $lookup:{
               from:"ratingreviews", 
               localField:"_id",
               foreignField:"bookingId",
               as:"rating"
             }
           },
           {
             $unwind:"$rating"
           },
           {
             $lookup:{
               from:"providers",
               localField:"providerId",
               foreignField:"_id",
               as:"providerDetails"
             }
           },
           {
             $unwind:"$providerDetails"
           },
           {
             $project:{
               _id:1,
               serviceType:1,
               userId:1,
               providerId:1,
               slotId:1,
               serviceId:1,
               vehicleDetails:1,
               location:1,
               bookingDate:1,
               amount:1,
               platformFee:1,
               subTotal:1,
               paymentId:1,
               reason:1,
               paymentStatus:1,
               status:1,
               selectedSubServices:1,
               reviewAdded:1,
               rating:{
                 rating:1,
                 feedback:1
               },
              
               providerDetails:{
                     workshopName:1,
                     ownerName:1,
                     email:1,
                     mobile:1,
                     workshopDetails:1,
                     logoUrl:1
                   },
               providerImage:"$providerData.logoUrl",
               userData:{
                 _id:1,
                 name:1,
                 phone:1,
                 email:1, 
                 imageUrl:1,
               },
               serviceDetails:{
                 _id:1,
                 category:1,
                 serviceType:1,
                 imageUrl:1
               }
             }
           }
            
         ])

          console.log("This is the fetchedBooking: ", fetchedBookingData)

          return {success:true, bookingData:fetchedBookingData[0]}
        
      } catch (error) {
          console.log("Error in getSingleBookingRepo: ", error);
          return{success:false, message:"something went wrong in getSingleBookingRepo"}
        
      }
  }

  
}

export default ProviderRepository;

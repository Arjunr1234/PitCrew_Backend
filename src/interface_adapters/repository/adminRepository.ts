import { response } from "express";
import IAdminRepository from "../../entities/irepository/iAdminRepository";
import { IAdminLoginData, IAdminLoginResponse, IBrands, IProviders, userData } from "../../entities/rules/admin";
import adminModel from "../../framework/mongoose/model/adminSchema";
import providerModel from "../../framework/mongoose/model/providerSchema";
import userModel from "../../framework/mongoose/model/userSchema";
import { stat } from "fs";
import { IData, IServices, ISubserviceData } from "../../entities/iInteractor/iAdminService";
import serviceModel from "../../framework/mongoose/model/serviceSchema";
import brandModel from "../../framework/mongoose/model/brandSchema";
import vehicleTypeModel from "../../framework/mongoose/model/vehicleTypeSchema";


class AdminRepository implements IAdminRepository{
    
    async loginRepo(loginData: IAdminLoginData): Promise<{ success: boolean; message?: string; adminData?: IAdminLoginResponse;}> {
       const {email, password} = loginData
       const loginResponse = await adminModel.findOne({
          email
       })
      

       if(!loginResponse){
          return {success:false, message:"userNotExists"}
       }

       if(loginResponse.password !== password){
         return {success:false, message:"incorrectPassword"}
       }
       const adminD = {
        _id:loginResponse._id.toString(),
        email:loginResponse.email,
        
       }
      
        return {success:true,adminData:adminD}
    }

   async getUsersRepo(): Promise<{ success: boolean; users?: userData[] | []; active?: number; blocked?: number; }> {
        
            try {
              
              const usersData = await userModel.find({}).sort({_id:-1});


              if(!usersData){
                 return {success:true, users:[]}
              }
 
              const [{ active, blocked }] = await userModel.aggregate([{
               $group: {
                   _id: null,
                   
                   active: { $sum: { $cond: [{ $eq: ["$blocked", false] }, 1, 0] } },
                   blocked: { $sum: { $cond: [{ $eq: ["$blocked", true] }, 1, 0] } }
               }
           }]);
 
           const updatedUsers :userData[] = usersData.map((user) => ({
               id:user.id.toString(),
               name:user.name,
               email:user.email,
               phone:user.phone,
               blocked:user.blocked
           }))
            console.log("This is the active and blocked Users In repo: ", active, blocked)
             return {success:true, users:updatedUsers, active:active, blocked:blocked}
            } catch (error) {
                console.log(error)
                return {success:false, users:[]}
            }
    }

    async adminBlockUnblockUser(id: string, state: boolean): Promise<{ success: boolean; message?: string }> {
      try {
          console.log('Blocking/Unblocking user with id: ', id);
          const blockResponse = await userModel.findByIdAndUpdate(id, { $set: { blocked: state } });
          console.log("This is the blockResponse: ", blockResponse);
  
          if (!blockResponse) {
              return { success: false, message: "User not found" };
          }
  
          return { success: true, message: state ? "User blocked successfully" : "User unblocked successfully" };
  
      } catch (error: any) {
          console.log('Error in block/unblock operation: ', error);
          return { success: false, message: "An error occurred while updating the user state" };
      }
  }

  async getPendingProvidersRepo(): Promise<{ success: boolean; providers?: IProviders[] | []; message?: string; }> {
         try {
                const provider:IProviders[] = await providerModel.aggregate([
                  {
                     $match:{
                        requestAccept:false,
                        
                     }
                  },
                  {$sort:{_id:-1}},
                  {
                    $project:{
                      _id:1,
                      workshopName:1,
                      ownerName:1,
                      mobile:1,
                      email:1,
                      workshopDetails:1,
                      blocked:1,
                      requestAccept:1
                    }
                  }
                ])
                console.log("This si the peiding provider; ", provider)
               if(!provider){
                 return {success:false, providers:[]}
               }

                 return {success:true, providers:provider}
                
         } catch (error:any) {
             console.log(error)
             return {success:false, message:"something wrong happend"}
          
         }
  }

  async getProvidersRepo(): Promise<{ success: boolean; providers?: IProviders[] | []; message?: string; }> {
    try {
     
      const provider: IProviders[] = await providerModel.aggregate([
        {
          $match: {
            requestAccept: true
          }
        },
        { $sort: { _id: -1 } },
        {
          $project: {
            _id: 1,
            workshopName: 1,
            ownerName: 1,
            mobile: 1,
            email: 1,
            workshopDetails: 1,
            blocked: 1,
            requestAccept: 1
          }
        }
      ])
      

      if (!provider) {
        return { success: false, providers: [] }
      }
      return { success: true, providers: provider }

    } catch (error: any) {
      console.log(error)
      return { success: false, message: "something wrong happend" }

    }
  }

  async providerAcceptOrRejectRepo(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> {


        try {
            const response = await providerModel.findByIdAndUpdate(id, {$set:{requestAccept:state}})
            if(state===null){
              const changeisRejectedStatus = await providerModel.findByIdAndUpdate(id, {$set:{isRejected:true}}) // just updating the is rejected status
            }

            if(!response){
              return {success:false}
            }
            //   add create provider service below

            return {success:true}
          
        } catch (error:any) {
            return {success:false, message:"something error happend!!"}
          
        }
  }

  

    async providerBlockAndUnblockUseCase(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> {
               
           try {

            const repsonse = await providerModel.findByIdAndUpdate(id, {$set:{blocked:state}});
           if(!response){
              return {success:false}
           }
           return{success:true}
            
           } catch (error) {
              return {success:false}
            
           }
    }


    async addServiceRepo(image: string, data: IData): Promise<{ success: boolean; message?: string; service?:IServices }> {
           
           try {
               const {category, serviceType} = data
               const createService = await serviceModel.create({
                imageUrl:image,
                category:category,
                serviceType:serviceType,
               })
              

               if(!createService){
                 return {success:false, message:"Data is not added"}
               }

               const service:IServices = {
                  _id:createService._id.toString(),
                  category:createService.category,
                  serviceTypes:createService.serviceType,
                  imageUrl:createService.imageUrl,
                  subTypes:createService.subTypes
               }

               return {success:true, service:service}
            
           } catch (error:any) {
               
               return {success:false, message:"Some error occured in add service"}
          }
    }

    async addBrandRepo(brand: string): Promise<{ success: boolean; message?: string; brand?:IBrands}> {
      try {
      
          const findBrand = await brandModel.findOne({ brand });
          if (findBrand) {
              return { success: false, message: "Brand already exists!!" };
          }
  
          
          const createBrand = await brandModel.create({ brand });
           console.log("Create Brand: ", createBrand)
           const brandData:IBrands = {
               _id:createBrand._id + "",
               brand:createBrand.brand,
           }
          if (!createBrand) {
              return { success: false, message: "Failed to add brand" };
          }

          return { success: true,  message: "Brand added successfully", brand:brandData };
  
      } catch (error: any) {
          console.error("Error adding brand:", error);  
          return { success: false, message: "Something went wrong" };
      }
  }

  async addVehicleTypeRepo(type: number): Promise<{ success: boolean; message?: string; }> {
    try {
      const findType = await vehicleTypeModel.findOne({ vehicleType: type });

      if (findType) {
        return { success: false, message: "Type already exists!!" }
      }

      const createType = await vehicleTypeModel.create({ vehicleType: type });

      if (!createType) {
        return { success: false, message: "Failed to create type!!" }
      }

      return { success: true }

    } catch (error) {
      console.error("Error in repo: ", error)
      return { success: false, message: "something went wrong" }

    }
  }

  async getAllBrandsRepo(): Promise<{ success: boolean; message?: string; brands?: IBrands[] | []; }> {

    try {

      const response = await brandModel.find({});

      const brandData: IBrands[] = response.map(brand => ({
        _id: brand._id + "",
        brand: brand.brand,
      }));

      if (!response) {
        return { success: false, message: "Couldn't find Brands" }
      }

      return { success: true, brands: brandData }

    } catch (error) {
      return { success: false, message: "Something went wrong in getAllBrandsRepo" }

    }
  }

  async deleteBrandRepo(id: string): Promise<{ success: boolean; message?: string; }> {

    try {

      const deleteBrand = await brandModel.deleteOne({ _id: id })

      if (!deleteBrand) {
        return { success: false, message: "An issue occured during delete" }
      }

      return { success: true, }

    } catch (error) {
      return { success: false, message: "Something went wrong in deletBrand" }
      console.log(error)

    }

  }

  async getAllGeneralServiceRepo(): Promise<{ success: boolean; message?: string; services?: IServices[] | []; }> {

    try {
       const getGeneralServices = await serviceModel.find({ category: 'general' });
 
      
       if (!getGeneralServices || getGeneralServices.length === 0) {
          return { success: false, message: "Cannot find the general services", services: [] };
       }
 
      
       const services: IServices[] = getGeneralServices.map((service) => ({
          _id: service._id.toString(), 
          category: service.category,
          serviceTypes: service.serviceType,
          imageUrl: service.imageUrl,
          subTypes: service.subTypes || [] 
       }));
 
       
       return { success: true, services };
 
    } catch (error) {
       
       console.error("Error fetching general services: ", error);
       return { success: false, message: "An error occurred while fetching services", services: [] };
    }
 }
 


 async getAllRoadServicesRepo(): Promise<{ success: boolean; message?: string; services?: IServices[] | []; }> {
  try {
      const getAllRoadService = await serviceModel.find({ category: "road" });

      if (!getAllRoadService || getAllRoadService.length === 0) {
          return { success: false, message: "Couldn't find Road services", services: [] };
      }

      const services: IServices[] = getAllRoadService.map(service => ({
          _id: service._id.toString(),
          category: service.category,
          serviceTypes: service.serviceType, 
          imageUrl: service.imageUrl,
          subTypes: service.subTypes || []
      }));

      return { success: true, services };

  } catch (error) {
      console.error("Error fetching road services:", error);
      return { success: false, message: "An error occurred while fetching road services", services: [] };
  }
}

async deleteServiceRepo(id: string): Promise<{ success: boolean; message?: string }> {
  try {
      const deleteService = await serviceModel.deleteOne({ _id: id });

      if (deleteService.deletedCount === 0) {
          return { success: false, message: "Failed to delete service. Service not found." };
      }

      return { success: true, message: "Successfully deleted" };
  } catch (error) {

      return { success: false, message: "An error occurred while deleting the service." };
  }
}

  async addSubServiceRepo(data: ISubserviceData): Promise<{ success: boolean; message?: string }> {
    try {
      const { id, subService } = data;

      if (!id || !subService) {
        return { success: false, message: "Invalid data provided" };
      }

      const checkExist = await serviceModel.findOne({_id:id, subTypes:{$in:[subService]}})
      
      if (checkExist) {
        return { success: false, message: "Service already exists" };
      }

      const addSubService = await serviceModel.findByIdAndUpdate(
        id,
        { $push: { subTypes: subService } },
        { new: true }
      );

      console.log("This is the addSubServiceRepo: ", addSubService);

      if (!addSubService) {
        return { success: false, message: "Failed to add service!!" };
      }

      return { success: true };

    } catch (error) {
      console.error("Error in addSubServiceRepo: ", error);
      return { success: false, message: "An error occurred while adding the sub-service." };
    }
  }





}

export default AdminRepository;
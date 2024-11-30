import { response } from "express";
import IAdminRepository from "../../entities/irepository/iAdminRepository";
import { IAdminLoginData, IAdminLoginResponse, IBrands, IProviders, ISubServiceData, userData } from "../../entities/rules/admin";
import adminModel from "../../framework/mongoose/model/adminSchema";
import providerModel from "../../framework/mongoose/model/providerSchema";
import userModel from "../../framework/mongoose/model/userSchema";
import { stat } from "fs";
import { IData, IServices, ISubserviceData } from "../../entities/iInteractor/iAdminService";
import serviceModel from "../../framework/mongoose/model/serviceSchema";
import brandModel from "../../framework/mongoose/model/brandSchema";
import vehicleTypeModel from "../../framework/mongoose/model/vehicleTypeSchema";
import providerServiceModel from "../../framework/mongoose/model/providerServiceSchema";
import mongoose from "mongoose";
import BookingModel from "../../framework/mongoose/model/BookingSchema";


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
            console.log("response",response);
            
            if(state===null){
              const changeisRejectedStatus = await providerModel.findByIdAndUpdate(id, {$set:{isRejected:true}}) // just updating the is rejected status
            }

            if(!response){
              return {success:false}
            }
            // if admin accepiting the request automatically creating a providerservice collection
            if (state === true) {
              const createProviderService = await providerServiceModel.create({
                  workshopId: response._id,  
                  twoWheeler: [], 
                  fourWheeler: []
              });
  
              if (!createProviderService) {
                  return { success: false, message: 'Failed to create provider service' };
              }
          }

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


               const findService = await serviceModel.findOne({ serviceType: new RegExp(`^${serviceType}$`, 'i') });
               if(findService){
                   return {success:false, message:"Service already exists!!"}
               }
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

          const findBrand = await brandModel.findOne({ brand: new RegExp(`^${brand}$`, 'i') });
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

  async addSubServiceRepo(data: ISubserviceData): Promise<{ success: boolean; message?: string, subService?:ISubServiceData }> {
    try {
      const { id, subService } = data;
      console.log("This si subService: ", subService)

      if (!id || !subService) {
        return { success: false, message: "Invalid data provided" };
      }

      console.log("Thhhhhhhhhhhhhhhhhhhhhhhhis is the subservice: ", )
      
      const checkExist = await serviceModel.findOne({
        _id: id,
        'subTypes.type': { $regex: new RegExp(`^${subService}$`, 'i') }, 
      });
      console.log("This is check exist: ", checkExist);
      
      if (checkExist) {
        return { success: false, message: "Service already exists" };
      }
      

     const addSubService = await serviceModel.findByIdAndUpdate(
                       id,
                       {$push:{subTypes:{type:subService}}},
                       {new:true}
     )

      console.log("This is the addSubServiceRepo: ", addSubService);

      if (!addSubService) {
        return { success: false, message: "Failed to add service!!" };
      }

      const newSubService = addSubService.subTypes[addSubService.subTypes.length-1];
      const subSerivceData:ISubServiceData = {
         _id:newSubService._id,
         type:newSubService.type
      }

      return { success: true, subService:subSerivceData };

    } catch (error) {
      console.error("Error in addSubServiceRepo: ", error);
      return { success: false, message: "An error occurred while adding the sub-service." };
    }
  }

 async removeSubServiceRepo(serviceId: string, subServiceId: string): Promise<{ success: boolean; message?: string; }> {
     try {

        const removeSubService = await serviceModel.updateOne(
            {_id:serviceId},
            {$pull : {subTypes:{_id:new mongoose.Types.ObjectId(subServiceId)}}}
        );

        if (removeSubService.modifiedCount === 0) {
          return { success: false, message: "Sub-Service not found or already removed." };
        }

        return { success: true, message: "Sub-Service removed successfully." };
        
      
     } catch (error) {
         console.log("Error in removeSubService: ", error);
         return {success:false, message:"something went wrong in removeSubServiceRepo"}
      
     }
 }


 async getAllBookingsRepo(): Promise<{ success: boolean; message?: string; bookingData?: any; }> {
       try {
             const bookingData = await BookingModel.aggregate([
              {
                $match:{}
              },
              {
                 $lookup:{
                    from:"users",
                    localField:"userId",
                    foreignField:"_id",
                    as:"userDetails"
                 }
                  
                },
                {
                  $unwind:"$userDetails"
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
                  $lookup:{
                    from:"services",
                    localField:"serviceId",
                    foreignField:"_id",
                    as:"serviceDetails"
                  }
                },
                {
                   $unwind:"$serviceDetails"
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
                    status:1,
                    serviceName:"$serviceDetails.serviceType",
                    selectedSubServices:1,
                    userDetails:{
  
                      name:1,
                      phone:1,
                      email:1,
                      imageUrl:1
                    },
                    providerDetails:{
                      
                      workshopName:1,
                      ownerName:1,
                      email:1,
                      mobile:1,
                      workshopDetails:1,
                      logoUrl:1
                    }
                  }
                }
             ]);

             if(!bookingData){
                return{success:false, message:"Failed to fetch the bookings"}
             }
             //console.log("Thsi is the data: ", bookingData)
             return {success:true, bookingData:bookingData}
        
       } catch (error) {
           console.log("Error in getAllBookingsRepo: ", error);
           return{success:false, message:"Something went wrong in getAllBookingsRepo"}
        
       }
 }




}

export default AdminRepository;
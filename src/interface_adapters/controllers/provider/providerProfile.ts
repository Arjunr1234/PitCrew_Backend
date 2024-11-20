import { Request, Response } from "express";
import { IProviderProfileInteractor } from "../../../entities/iInteractor/provider/profile";
import { NextFunction } from "express-serve-static-core";
import HttpStatus from "../../../entities/rules/statusCodes";



class ProviderProfileController{
  constructor(private readonly providerProfileInteractor:IProviderProfileInteractor){}

    async getProviderDetails(req:Request, res:Response, next:NextFunction){
           try {
                const providerId = req.query.providerId as string
                if(!providerId){
                   res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide necessary data"});
                   return
                }
                
                const response = await this.providerProfileInteractor.getProviderDetailsUseCase(providerId);

                if(!response.success){
                   res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
                   return
                }

                  res.status(HttpStatus.OK).json({success:response.success,message:response.message, providerData:response.providerData})
            
           } catch (error) {
              console.log("Error in getProviderDetails: ", error);
              next(error);
            
           }
    }

    async editProfile(req:Request, res:Response, next:NextFunction){
        try {
              const { workshopName,ownerName,phone,about, providerId } = req.body

              const data = { workshopName,ownerName,phone,about, providerId }

              const response = await this.providerProfileInteractor.editProfileUseCase(data);

              if(!response.success){
                  res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message});
                  return
              }
                
                res.status(HttpStatus.OK).json({success:response.success,mesage:response.message, providerData:response.message })
          
        } catch (error) {
           console.log("Error in EditProfile: ", error);
           next(error)     
        }

    }

    async updateProfilePic(req:Request, res:Response, next:NextFunction){
         try {
             const file = req.file?.buffer as Buffer;
             const providerId = req.body.providerId as string;
             
             if(!file || !providerId){
                res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provider the data"});
                return
             }
             const response = await this.providerProfileInteractor.updateProfilePicUseCase(providerId, file);
             

             if(!response.success){
                res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message});
                return
             }
               res.status(HttpStatus.OK).json({success:response.success, message:response.message, imageUrl:response.imageUrl})


         } catch (error) {
            console.log("Error in updateProfilePic: ", error)
          
         }
    }
}

export default ProviderProfileController
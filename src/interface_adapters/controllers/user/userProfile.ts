import { Request, Response } from "express";
import IUserProfileInteractor from "../../../entities/user/iprofile";
import { NextFunction } from "express-serve-static-core";
import HttpStatus from "../../../entities/rules/statusCodes";



class UserProfileController {
      constructor(private readonly userProfileInteractor:IUserProfileInteractor){}

    async getUserDetails(req:Request, res:Response, next:NextFunction){
            try {
              const userId = req.query.userId as string;

              if(!userId){
                 res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provider the data"})
                 return 
              }
 
              const response = await this.userProfileInteractor.getUserDetailsUsecase(userId);
 
              if(!response.success){
                 res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message});
                 return
              }
 
              res.status(HttpStatus.OK).json({success:response.success, userData:response.userData})
              
            } catch (error) {
                console.log("Error in getUserDetailsController: ",error)
                next(error)
            }

             
    }

    async editUserProfile(req:Request, res:Response, next:NextFunction){
      try {
          const {name, phone, userId} = req.body;
          console.log("This is the reecived data from req.body: ", req.body);

          const data = {
            name, phone, userId
          }

          const response = await this.userProfileInteractor.editUserProfileUseCase(data);

          if(!response.success){
            res.status(HttpStatus.BAD_REQUEST).json({success:false, message:response.message})
            return 
          }
          
            res.status(HttpStatus.OK).json({success:true});
        
      } catch (error) {
          console.log("Error in editUserProfileController: ", error)
          next(error)
      }
    }

    async updateImage(req:Request, res:Response, next:NextFunction){
       try {

        
       } catch (error) {
          console.log("Error ocuured in updateImage: ", error)
          next(error);
       }
    }

    async updateProfileImage(req:Request, res:Response, next:NextFunction){
        try {

          const userId = req.body.userId as string
          const file = req.file?.buffer as Buffer

          const response = await this.userProfileInteractor.updateProfileImageUseCase(file, userId);
            
          if(!response.success){
            res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
            return
          }
           
          res.status(HttpStatus.OK).json({success:response.success, imageUrl:response.imageUrl})
          
        } catch (error) {
            console.log("Error occured in updateProfileImage: ", error);
            next(error)
          
        }
    }


}

export default UserProfileController
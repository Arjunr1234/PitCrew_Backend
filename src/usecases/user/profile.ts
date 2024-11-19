import { response } from "express";
import iUserRepository from "../../entities/irepository/iuserRepository";
import { IProfileData, IUserData } from "../../entities/rules/user";
import IUserProfileInteractor from "../../entities/user/iprofile";
import { ICloudinaryService } from "../../entities/services/iCloudinary";


class UserProfileInteractor implements IUserProfileInteractor{
     constructor(
      private readonly userRepository:iUserRepository,
      private readonly cloudinaryService:ICloudinaryService){}

     async getUserDetailsUsecase(userId: string): Promise<{ success: boolean; message?: string; userData?: IUserData; }> {
         try {
             const response = await this.userRepository.getUserDetailsRepo(userId);
             return response
          
         } catch (error) {
            console.log("Error in getUserDetailsUsecase: ", error);
            return {success:false, message:"Something went wrong in getUserDetails: "}
          
         }
     }

     async editUserProfileUseCase(data: IProfileData): Promise<{ success: boolean; message?: string; }> {
         try {

              const response = await this.userRepository.editUserProfileRepo(data);
              return response
         } catch (error) {
             console.log("Error in editUserProfileUseCase: ", error)
             return{success:false, message:"Something went wrong in editUserProfileUsecase"}
         }
     }

   async updateProfileImageUseCase(file: Buffer, userId:string): Promise<{ success: boolean; message?: string; imageUrl?: string; }> {
         try {
            const folderName = 'userprofilePic'
            const responseImageUrl = await this.cloudinaryService.uploadImage(file, folderName);
            console.log("This si resposeImageUrl: ", responseImageUrl);
            
            if(!responseImageUrl){
               return{success:false, message:"Failed to upload image"}
            }

            const response = await this.userRepository.updateProfileImageRepo(userId, responseImageUrl);

            if(response.success){
               const deletePreImage = await this.cloudinaryService.deleteImage(response.prevImgUrl as string);
               console.log("This is the deletePrevImage response(This won't affect the working of uploads but make sure that prev message is deleted): ", deletePreImage)
               return {success:response.success, message:response.message, imageUrl:response.newImgUrl}
            }else{
               return {success:false, message:response.message}
            }
            

            
          
         } catch (error) {
            console.log("Error in updateProfileImageUseCase: ", error);
            return {success:false, message:"Something went wrong in updateProfileImageUsecase"}
          
         }
   }  
     
}

export default UserProfileInteractor
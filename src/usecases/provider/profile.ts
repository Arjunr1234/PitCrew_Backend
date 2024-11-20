import { response } from "express";
import { IProviderProfileInteractor } from "../../entities/iInteractor/provider/profile";
import IproviderRepository from "../../entities/irepository/iproviderRepo";
import { IProfileEdit } from "../../entities/rules/provider";
import { ICloudinaryService } from "../../entities/services/iCloudinary";



class ProviderProfileInteractor implements IProviderProfileInteractor{
     constructor(
        private readonly providerProfileRepo:IproviderRepository,
        private readonly cloudinary:ICloudinaryService
     ){}

    async getProviderDetailsUseCase(providerId: string): Promise<{ success: boolean; message?: string; providerData?: any; }> {
        try {
          const response = await this.providerProfileRepo.getProviderDetailsRepo(providerId)
          return response
          
        } catch (error) {
            console.log("This is the error: ", error)
            return {success:false, message:"Something went wrong in getProviderDetailsUseCase "}
        }
    }

    async editProfileUseCase(data: IProfileEdit): Promise<{ success: boolean; message?: string; }> {
        try {
            const response = await this.providerProfileRepo.editProfileRepo(data)
            return response
        } catch (error) {
            console.log("Error in editProfileUseCase: ", error);
            return{success:false,message:"Somthing went wrong in editProfileUseCase"}
          
        }
    }

    async updateProfilePicUseCase(providerId: string, file: Buffer): Promise<{ success: boolean; message?: string; imageUrl?: string; }> {
        try {
          const folderName = 'providerProfilePic'
          const responseImageUrl = await this.cloudinary.uploadImage(file, folderName);
          

          if(!responseImageUrl){
            return{success:false, message:"Failed to upload the image"}
          }
          const response = await this.providerProfileRepo.updateProfileImageRepo(providerId, responseImageUrl);
          

          if(response.success){
              const deletePrevImage = await this.cloudinary.deleteImage(response.prevImgUrl as string);
              console.log("This is the deletePrevImage response(This won't affect the working of uploads but make sure that prev message is deleted): ", deletePrevImage);
              return {success:response.success, message:response.message, imageUrl:response.newImgUrl}
          }else{
              return {success:false, message:response.message}
          }
             
          
        } catch (error) {
           console.log("Error in updateProfilePicUseCase: ", error);
           return {success:false, message:"Something went wrong in updateProfileUsecase"}
          
        }
    }
}

export default ProviderProfileInteractor
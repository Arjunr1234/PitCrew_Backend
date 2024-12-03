import { IProfileEdit } from "../../rules/provider"



export interface IProviderProfileInteractor{
  getProviderDetailsUseCase(providerId:string):Promise<{success:boolean, message?:string, providerData?:any}>
  editProfileUseCase(data:IProfileEdit):Promise<{success:boolean, message?:string}>
  updateProfilePicUseCase(providerId:string, file:Buffer):Promise<{success:boolean, message?:string, imageUrl?:string}>
  resetPasswordUseCase(providerId:string, currentPassword:string, newPassword:string):Promise<{success:boolean, message?:string}>
}



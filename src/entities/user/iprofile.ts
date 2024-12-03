import { IProfileData, IUserData } from "../rules/user"





interface IUserProfileInteractor{
  getUserDetailsUsecase(userId:string):Promise<{success:boolean, message?:string, userData?:IUserData}>
  editUserProfileUseCase(data:IProfileData):Promise<{success:boolean, message?:string}>
  updateProfileImageUseCase(file:Buffer, userId:string):Promise<{success:boolean, message?:string, imageUrl?:string}>
  resetPasswordUseCase(userId:string, currentPassword:string, newPassword:string):Promise<{success:boolean, message?:string}>
}
export default IUserProfileInteractor
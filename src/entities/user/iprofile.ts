import { IProfileData, IUserData } from "../rules/user"





interface IUserProfileInteractor{
  getUserDetailsUsecase(userId:string):Promise<{success:boolean, message?:string, userData?:IUserData}>
  editUserProfileUseCase(data:IProfileData):Promise<{success:boolean, message?:string}>
  updateProfileImageUseCase(file:Buffer, userId:string):Promise<{success:boolean, message?:string, imageUrl?:string}>
}
export default IUserProfileInteractor
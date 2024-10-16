import { IData } from "../iInteractor/iAdminService"
import { IAdminLoginData, IAdminLoginResponse, IProviders, userData } from "../rules/admin"


interface IAdminRepository{

   loginRepo(loginData:IAdminLoginData):Promise<{success:boolean, message?:string, adminData?:IAdminLoginResponse}>
   getUsersRepo():Promise<{success:boolean, users?:userData[]|[], active?:number, blocked?:number}>
   adminBlockUnblockUser(_id:string,state:boolean):Promise<{success:boolean, message?:string}>
   getPendingProvidersRepo():Promise<{success:boolean, providers?:IProviders[] | [], message?:string}>
   getProvidersRepo():Promise<{success:boolean, providers?:IProviders[] | [], message?:string}>
   providerAcceptOrRejectRepo(id:string, state:boolean):Promise<{success:boolean, message?:string}>
   providerBlockAndUnblockUseCase(id:string, state:boolean):Promise<{success:boolean, message?:string}>
   addServiceRepo(image:string, data:IData):Promise<{success:boolean, message?:string}>

}

export default IAdminRepository
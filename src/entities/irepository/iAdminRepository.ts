import { IData, IServices, ISubserviceData } from "../iInteractor/iAdminService"
import { IAdminLoginData, IAdminLoginResponse, IProviders, userData, IBrands, ISubServiceData } from "../rules/admin"




interface IAdminRepository{

   loginRepo(loginData:IAdminLoginData):Promise<{success:boolean, message?:string, adminData?:IAdminLoginResponse}>
   getUsersRepo():Promise<{success:boolean, users?:userData[]|[], active?:number, blocked?:number}>
   adminBlockUnblockUser(_id:string,state:boolean):Promise<{success:boolean, message?:string}>
   getPendingProvidersRepo():Promise<{success:boolean, providers?:IProviders[] | [], message?:string}>
   getProvidersRepo():Promise<{success:boolean, providers?:IProviders[] | [], message?:string}>
   providerAcceptOrRejectRepo(id:string, state:boolean):Promise<{success:boolean, message?:string}>
  // providerAcceptRePo(id:string, state:boolean):Promise<{success:boolean, message?:string}>
   providerBlockAndUnblockUseCase(id:string, state:boolean):Promise<{success:boolean, message?:string}>
   addServiceRepo(image:string, data:IData):Promise<{success:boolean, message?:string, service?:IServices}>
   addBrandRepo(brand:string):Promise<{success:boolean, message?:string, brand?:IBrands}>
   addVehicleTypeRepo(type:number):Promise<{success:boolean, message?:string}>
   getAllBrandsRepo():Promise<{success:boolean, message?:string, brands?:IBrands[] | []}>
   deleteBrandRepo(id:string):Promise<{success:boolean, message?:string}>
   getAllGeneralServiceRepo():Promise<{success:boolean, message?:string, services?:IServices[] | []}>
   getAllRoadServicesRepo():Promise<{success:boolean, message?:string, services?:IServices[] | [] }>
   deleteServiceRepo(id:string):Promise<{success:boolean, message?:string}>
   addSubServiceRepo(data:ISubserviceData):Promise<{success:boolean, message?:string,subService?:ISubServiceData}>
   
}

export default IAdminRepository


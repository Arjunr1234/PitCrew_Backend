import { IBrands, ISubServiceData } from "../rules/admin";
import { subtype } from "../rules/provider";

interface IAdminServiceInteractor{
  addServiceUseCase(file: Buffer, data:IData): Promise<{success:boolean, message?:string, service?:IServices}>;
  addBrandUseCase(brand:string):Promise<{success:boolean, message?:string, brand?:IBrands}>
  addVehicleTypeUseCase(type:number):Promise<{success:boolean, message?:string}>
  getAllBrandUseCase():Promise<{success:boolean,message?:string, brands?:IBrands[] | []}>
  deleteBrandUseCase(id:string):Promise<{success:boolean, message?:string}>
  getAllGeneralServiceUseCase():Promise<{success:boolean, message?:string, services?:IServices[] | []}>
  getAllRoadServiceUseCase():Promise<{success:boolean, message?:string, services?:IServices[] | []}>
  deleteServiceUseCase(id:string):Promise<{success:boolean, message?:string}>
  addSubServiceUseCase(data:ISubserviceData):Promise<{success:boolean, message?:string,subService?:ISubServiceData}>

}

export interface ISubserviceData{
    id:string, 
    subService:string
}

export interface IData{
    category:string,
    serviceType:string
}

export interface IServices{
    _id:string,
    category:string,
    serviceTypes:string,
    imageUrl:string,
    subTypes:{_id:string,type:string}[]
}


export default IAdminServiceInteractor
import { IAddBrandData, IAddingData, IAdminBrand, IEditSubType, ILogData, IProviderBrand, IProviderData,IProviderRegisterData,IProviderResponseData, IRemoveBrandData, IRemoveService, IRemoveSubTypeData, ISubTypeData, ProviderModel } from "../rules/provider";
import { Types } from "mongoose";

interface IproviderRepository{
      providerExist(email:string):Promise<{success:boolean, message?:string}>
      saveOtp(otp:string, email:string):Promise<{success:boolean; message?:string}>
      getOtp(email:string, otp:string):Promise<{success:boolean, otp?:string|undefined}>
      createProvider(providerData:IProviderRegisterData):Promise<{success:boolean, message?:string}>
      loginRepo(loginData:ILogData):Promise<{success:boolean, message?:string, provider?:IProviderResponseData}>
      getAllProviderService(id:string, vehicleType:number):Promise<{success:boolean, message?:string, providerService?:IProviderServices|null,allServices?:IAllServices[]}>
      addGeneralOrRoadService(data:IAddingData):Promise<{success:boolean, message?:string}>
      getAllBrandsRepo(providerId:string):Promise<{success:boolean, message?:string, adminBrand?:IAdminBrand[] , providerBrand?:IProviderBrand[] | []}>
      addBrandRepo(brandData:IAddBrandData):Promise<{success:boolean, message?:string,}>
      removeBrandRepo(brandData:IRemoveBrandData):Promise<{success:boolean, message?:string}>
      addSubTypeRepo(data:ISubTypeData):Promise<{success:boolean, message?:string}>
      removeSubTypeRepo(data:IRemoveSubTypeData):Promise<{success:boolean, message?:string}>
      editSubTypeRepo(data:IEditSubType):Promise<{success:boolean, meessage?:string}>
      removeServiceRepo(data:IRemoveService):Promise<{success:boolean, message?:string}>

}










export default IproviderRepository






export interface IAllServices {
      _id:string
      category:  "general" | "road",
      serviceType: string
      imageUrl:string
      subTypes?: {_id:string,type:string}[]
 }

export interface IProviderServices {
      workshopId:Types.ObjectId,
      twoWheeler?:Service[],
      fourWheeler?:Service[]
    }

    interface Service {
      typeId: string;    
      category: string;
      subtype: Array<{
        type: string;
        startingPrice: number;
      }>;
    }

export interface IServices{
     id:string,
     category:string,
     serviceType:string,
     imageUrl:string
     subTypes:string[]
}

export interface IBrandData {
      id:string,
      brand:string
}
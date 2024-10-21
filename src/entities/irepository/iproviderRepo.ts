import { ILogData, IProviderData,IProviderResponseData, ProviderModel } from "../rules/provider";


interface IproviderRepository{
      providerExist(email:string):Promise<{success:boolean, message?:string}>
      saveOtp(otp:string, email:string):Promise<{success:boolean; message?:string}>
      getOtp(email:string, otp:string):Promise<{success:boolean, otp?:string|undefined}>
      createProvider(providerData:IProviderData):Promise<{success:boolean, message?:string}>
      loginRepo(loginData:ILogData):Promise<{success:boolean, message?:string, provider?:IProviderResponseData}>
      getAllServicesRepo():Promise<{success:boolean, message?:string, services?:IServices[] | []}>
      getAllBrandsRepo():Promise<{success:boolean, message?:string, brands?:IBrandData[] | []}>

}

export default IproviderRepository


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
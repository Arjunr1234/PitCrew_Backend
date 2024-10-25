import { IBrandData, IServices } from "../../irepository/iproviderRepo";
import { IAddBrandData, IAddingData, IBrand, IProviderGeneralServiceData, IProviderRoadServiceData, IRemoveBrandData } from "../../rules/provider";


export interface IProviderAddServiceInteractor{

      // getAllBrandsUseCase():Promise<{success:boolean, message?:string, brands?:IBrandData[] | []}>
      getAllProviderService(id:string, vehicleType:number):Promise<{success:boolean, message?:string, providerGeneralServiceData?:IProviderGeneralServiceData[],providerRoadServiceData?:IProviderRoadServiceData[]  }>
      addGeneralOrRoadServiceUseCase(data:IAddingData):Promise<{success:boolean, message?:string}>
      getAllBrandsUseCase(providerId:string):Promise<{success:boolean, message?:string, brandData?:IBrand[] | []}>
      addBrandUseCase(brandData:IAddBrandData):Promise<{success:boolean, message?:string}>
      removeBrandUseCase(brandData:IRemoveBrandData):Promise<{success:boolean, message?:string}>

}








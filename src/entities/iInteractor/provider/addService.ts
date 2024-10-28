import { IBrandData, IServices } from "../../irepository/iproviderRepo";
import { IAddBrandData, IAddingData, IBrand, IEditSubType, IProviderGeneralServiceData, IProviderRoadServiceData, IRemoveBrandData, IRemoveService, IRemoveSubTypeData, ISubTypeData } from "../../rules/provider";


export interface IProviderAddServiceInteractor{

      // getAllBrandsUseCase():Promise<{success:boolean, message?:string, brands?:IBrandData[] | []}>
      getAllProviderService(id:string, vehicleType:number):Promise<{success:boolean, message?:string, providerGeneralServiceData?:IProviderGeneralServiceData[],providerRoadServiceData?:IProviderRoadServiceData[]  }>
      addGeneralOrRoadServiceUseCase(data:IAddingData):Promise<{success:boolean, message?:string}>
      getAllBrandsUseCase(providerId:string):Promise<{success:boolean, message?:string, brandData?:IBrand[] | []}>
      addBrandUseCase(brandData:IAddBrandData):Promise<{success:boolean, message?:string}>
      removeBrandUseCase(brandData:IRemoveBrandData):Promise<{success:boolean, message?:string}>
      addSubTypeUseCase(data:ISubTypeData):Promise<{success:boolean, message?:string}>
      removeSubTypeUseCase(data:IRemoveSubTypeData):Promise<{success:boolean, message?:string}>
      editSubTypeUseCase(data:IEditSubType):Promise<{success:boolean, message?:string}>
      removeServiceUseCase(data:IRemoveService):Promise<{success:boolean, message?:string}>

}








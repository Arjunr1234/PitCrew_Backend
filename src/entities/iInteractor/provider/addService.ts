import { IBrandData, IServices } from "../../irepository/iproviderRepo";


export interface IProviderAddServiceInteractor{

      getAllServiceUseCase():Promise<{success:boolean, message?:string, services?:IServices[] | []}>
      getAllBrandsUseCase():Promise<{success:boolean, message?:string, brands?:IBrandData[] | []}>
}


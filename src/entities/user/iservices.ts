import { IFullDetails } from "../rules/provider"
import { IBrandData, IProvidersData, IProvidersUseData, IServiceData } from "../rules/user"




interface IUserServiceInteractor{

 getAllServiceUseCase():Promise<{success:boolean, message?:string, serviceData?:IServiceData[] | []}>
 getAllBrandsUseCase():Promise<{success:boolean, message?:string, brandData?:IBrandData[]}>
 findProvidersUseCase(data:IFullDetails):Promise<{success:boolean, message?:string, providersData?:IProvidersUseData[] | []}>
 
}



export default IUserServiceInteractor
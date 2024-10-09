import { IAdminProviderInteractor } from "../../entities/iInteractor/iAdminProviderInteractor";
import IAdminRepository from "../../entities/irepository/iAdminRepository";
import { IProviders } from "../../entities/rules/admin";

class AdminProviderInteractor implements IAdminProviderInteractor{
        constructor(private readonly adminProviderRepo:IAdminRepository){}

       async  getPendingProvidersUseCase(): Promise<{ providers?: IProviders[]; success: boolean; message?: string; }> {
               
               try {
                const response = await this.adminProviderRepo.getProvidersRepo();

                if(!response.success){
                    return  {success:response.success, message:response.message}
                }
 
                return {success:true, providers:response.providers, message:"Successfull"}
                
               } catch (error) {
                   console.log(error);
                   return {success:false}
                
               }   
        }

        async getProvidersUseCase(): Promise<{ providers?: IProviders[]; success: boolean; message?: string; }> {
          try {
            const response = await this.adminProviderRepo.getPendingProvidersRepo();

            if(!response.success){
                return  {success:response.success, message:response.message}
            }

            return {success:true, providers:response.providers, message:"Successfull"}
            
           } catch (error) {
               console.log(error);
               return {success:false}
            
           }
        }
}

export default AdminProviderInteractor
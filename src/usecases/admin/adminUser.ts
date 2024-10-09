import { IAdminUserInteractor } from "../../entities/iInteractor/iAdminUserInteractor";
import IAdminRepository from "../../entities/irepository/iAdminRepository";
import { userData } from "../../entities/rules/admin";


class AdminUserInteractor implements IAdminUserInteractor{
     constructor(private readonly adminUserRepo: IAdminRepository){}

   async  getUsersUseCase(): Promise<{ success: boolean; users?: userData[] | []; active?: number; blocked?: number; }> {

         try {
          const response = await this.adminUserRepo.getUsersRepo();
          if(!response.success){
             return {success:false }
          }
          
           return {success:true, users:response.users, active:response.active, blocked:response.blocked}
          
         } catch (error) {
             return {success:false}
        }
         
     }

    async userBlockAndUnblockUseCase(id: string, state: boolean): Promise<{ success: boolean; message?: string; }> {
         try {
              const response = await this.adminUserRepo.adminBlockUnblockUser(id, state);
              console.log("This is the response from userBlockUseCase: ", response)
              
               if(!response.success){
                   return {success:false, message:response.message}
               }
                return {success:true, message:response.message}
              
          
         } catch (error) {
             console.log(error);
             return {success:false}
          
         }
     }
     

}

export default AdminUserInteractor
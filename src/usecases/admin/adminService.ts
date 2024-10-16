import IAdminServiceInteractor from "../../entities/iInteractor/iAdminService";
import IAdminRepository from "../../entities/irepository/iAdminRepository";
import { ICloudinaryService } from "../../entities/services/iCloudinary";
import { IData } from "../../entities/iInteractor/iAdminService";

class AdminServiceInteractor implements IAdminServiceInteractor{
     constructor(
       private readonly cloudinaryService:ICloudinaryService,
       private readonly AdminServiceRepository:IAdminRepository
     ){}
 
     async addServiceUseCase(file: Buffer, data:IData): Promise<{success:boolean, message?:string}> {

      try {

        const folderName = 'service'
      const resposeImageUrl = await this.cloudinaryService.uploadImage(file, folderName);
      const response =  await this.AdminServiceRepository.addServiceRepo(resposeImageUrl, data)

      if(!response.success){
         return {success: false, message: response.message}
      }
         
      return {success:true, }
        
      } catch (error:any) {

          console.log(error)
          return {success:false}
        
      }

}
}

export default AdminServiceInteractor
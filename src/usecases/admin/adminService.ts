import IAdminServiceInteractor, { IServices, ISubserviceData } from "../../entities/iInteractor/iAdminService";
import IAdminRepository from "../../entities/irepository/iAdminRepository";
import { ICloudinaryService } from "../../entities/services/iCloudinary";
import { IData } from "../../entities/iInteractor/iAdminService";
import { IBrands, ISubServiceData } from "../../entities/rules/admin";

class AdminServiceInteractor implements IAdminServiceInteractor{
     constructor(
       private readonly cloudinaryService:ICloudinaryService,
       private readonly AdminServiceRepository:IAdminRepository
     ){}
 
     async addServiceUseCase(file: Buffer, data:IData): Promise<{success:boolean, message?:string, service?:IServices}> {

      try {

      const folderName = 'service'
      const resposeImageUrl = await this.cloudinaryService.uploadImage(file, folderName);
      const response =  await this.AdminServiceRepository.addServiceRepo(resposeImageUrl, data)

      if(!response.success){
         return {success: false, message: response.message}
      }
         
      return {success:true, service:response.service}
        
      } catch (error:any) {

          console.log(error)
          return {success:false}
        
      }

}

   async addBrandUseCase(brand: string): Promise<{ success: boolean; message?: string; brand?:IBrands}> {
         
           try {

            const response = await this.AdminServiceRepository.addBrandRepo(brand);

            if(!response.success){
                return {success:false, message:response.message}
            }
 
            return {success:true, message:"Created Successfully!!", brand:response.brand}
            
           } catch (error) {
              
               return {success:false, }
            
           }
   }

   async addVehicleTypeUseCase(type: number): Promise<{ success: boolean; message?: string; }> {
    try {
        
        const response = await this.AdminServiceRepository.addVehicleTypeRepo(type);

        
        if (!response.success) {
            return { success: false, message: response.message };
        }

      
        return { success: true };
        
    } catch (error) {
        
        console.error("Error adding vehicle type:", error);

        
        return { success: false, message: "Something went wrong while adding the vehicle type." };
    }
}

async getAllBrandUseCase(): Promise<{ success: boolean; message?: string; brands?: IBrands[] | [] }> {

  try {
    const response = await this.AdminServiceRepository.getAllBrandsRepo();

    if (!response.success) {
      return { success: false, message: response.message };
    }

    return { success: true, brands: response.brands };

  } catch (error) {
    return { success: false, message: "Something went wrong in getAllBrandUseCase" };
  }
}

  async deleteBrandUseCase(id: string): Promise<{ success: boolean; message?: string; }> {

    try {

      const response = await this.AdminServiceRepository.deleteBrandRepo(id);

      if (!response.success) {
        return { success: false, message: response.message }
      }

      return { success: true }

    } catch (error) {
       console.log(error)
      return { success: false, message: "Something went wrong when deleteBrandUsecase" }
     
    }
  }

  async getAllGeneralServiceUseCase(): Promise<{ success: boolean; message?: string; services?: IServices[] | []; }> {
    try {
        const response = await this.AdminServiceRepository.getAllGeneralServiceRepo();

        if (!response.success) {
            return { success: false, message: response.message };
        }

        return { success: true, services: response.services };

    } catch (error) {
        console.error("Error in getAllGeneralServiceUseCase:", error);
        return { success: false, message: "Something went wrong in getAllGeneralServiceUseCase" };
    }
}



async getAllRoadServiceUseCase(): Promise<{ success: boolean; message?: string; services?: IServices[] | []; }> {
  try {
      const response = await this.AdminServiceRepository.getAllRoadServicesRepo();

      if (!response.success) {
          return { success: false, message: response.message };
      }

      return { success: true, services: response.services };

  } catch (error) {
      console.error("Error in getAllRoadServiceUseCase:", error);
      return { success: false, message: "Something went wrong in getAllRoadServiceUseCase" };
  }
}

  
async deleteServiceUseCase(id: string): Promise<{ success: boolean; message?: string }> {
  try {
      const response = await this.AdminServiceRepository.deleteServiceRepo(id);

      if (!response.success) {
          return { success: false, message: response.message }; 
      }

          return { success: true, message: response.message }; 
  } catch (error) {
      
      return { success: false, message: "An error occurred while trying to delete the service." };
  }
}

async addSubServiceUseCase(data: ISubserviceData): Promise<{ success: boolean; message?: string,subService?:ISubServiceData }> {
  try {
    
    const response = await this.AdminServiceRepository.addSubServiceRepo(data);

    
    if (!response.success) {
      return { success: false, message: response.message };
    }

    
    return { success: true, message: "Successfully added!!", subService:response.subService };

  } catch (error) {
    
    console.error("Error in addSubServiceUseCase: ", error);

    
    return { success: false, message: "Something went wrong in addSubService UseCase" };
  }
}

async removeSubServiceUseCase(serviceId: string, subServiceId: string): Promise<{ success: boolean; message?: string; }> {
    try {
      const response = this.AdminServiceRepository.removeSubServiceRepo(serviceId, subServiceId);

     return response
      
    } catch (error) {
        console.log("Error in removeSubServiceUseCase: ", error);
        return {success:false, message:"Something went wrong in removeSubServiceUseCase"}
      
    }
}




}

export default AdminServiceInteractor
import { IProviderAddServiceInteractor } from "../../entities/iInteractor/provider/addService";
import IproviderRepository, { IBrandData, IServices } from "../../entities/irepository/iproviderRepo";

class ProviderAddServiceInteractor implements IProviderAddServiceInteractor {
    constructor(
        private readonly AddServiceRepository: IproviderRepository
    ) {}

    async getAllServiceUseCase(): Promise<{ success: boolean; message?: string; services?: IServices[] | [] }> {
        try {
            const response = await this.AddServiceRepository.getAllServicesRepo();

            if(!response.success){
                return {success:false, message:response.message}
            }
            return {
                success: response.success,
                services:response.services
               };
        } catch (error) {
            console.log("some error happened: ", error);

            
            return {
                success: false,
                message: "Something went wrong while fetching services"
            };
        }
    }

  async getAllBrandsUseCase(): Promise<{ success: boolean; message?: string; brands?: IBrandData[] | []; }> {

    try {
      const response = await this.AddServiceRepository.getAllBrandsRepo();

      if (!response.success) {
        return { success: false, message: response.message }
      }

      return { success: true, brands:response.brands}

    } catch (error) {
      console.log("Error occured in getAllBrandUseCase: ", error)
      return { success: false, message: "Something went wrong in getAllBrandUseCase" }
    }

  }

    

    
}

export default ProviderAddServiceInteractor;

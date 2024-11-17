import mongoose from "mongoose";
import iUserRepository from "../../entities/irepository/iuserRepository";
import { IFullDetails } from "../../entities/rules/provider";
import { IBrandData, IProvidersUseData, IServiceData } from "../../entities/rules/user";
import IUserServiceInteractor from "../../entities/user/iservices";




class UserServiceInteractor implements IUserServiceInteractor{

      constructor(private readonly userRepository:iUserRepository){}
  

      async getAllServiceUseCase(): Promise<{ success: boolean; message?: string; serviceData?: IServiceData[] | []; }> {
           try {
               const response = await this.userRepository.getAllServiceRepo();
               return response
            
           } catch (error) {
              console.log("This is the getAllServiceUseCaase: ",error)
              return {success:false, message:"Something went wrong in getAllserviceUseCase"}
            
           }
      }

      async getAllBrandsUseCase(): Promise<{ success: boolean; message?: string; brandData?: IBrandData[]; }> {
          try {
               const response = await this.userRepository.getAllBrandRepo();
               return response
            
          } catch (error) {
               console.log("Error in getAllBrandUseCase: ", error)
               return {success:false, message:"Something went wrong in getAllBrandUseCase"}
          }
      }

      private calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
      ): number {
        const R = 6371; 
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseFloat((R * c).toFixed(2)); 
      }


    async findProvidersUseCase(data: IFullDetails): Promise<{ success: boolean; message?: string; providersData?: IProvidersUseData[] | [] }> {
        try {
            const { location: { coordinates } } = data
            const response = await this.userRepository.findProvidersRepo(data);
            
            if (!response.success) {
                return { success: false, message: response.message }
            }

            if (!response.providersData) {
                return { success: false, message: "No matching provider found" }
            }
            const providerData = response.providersData.map((data) => ({
                ...data,
                distance: this.calculateDistance(coordinates[1], coordinates[0], data.coordinates[1], data.coordinates[0])

            }))


            return { success: true, providersData: providerData }

        } catch (error) {
            console.log("Error in findProviderUseCase: ", error)
            return { success: false, message: "Something went wrong in findProvidersUseCase" }
        }
    }

    async providerServiceViewUseCase(providerId: string, vehicleType: string, serviceId:string): Promise<{ success: boolean; message?: string;providerData?:any }> {
        try {
            const response = await this.userRepository.providerServiceViewRepo(providerId, vehicleType, serviceId);




            const providerServiceData = response.providerData;
            const serviceData = response.serviceData

            providerServiceData.services.subType.forEach((subType:any) => {
                
                const matchingService = serviceData.subTypes.find((serviceSubType:any) =>
                    serviceSubType._id.equals(new mongoose.Types.ObjectId(subType.type)) 
                );
            
                
                if (matchingService) {
                    subType.type = matchingService.type; 
                    subType.isAdded = false
                }
            });

            if(!response.success){
                return {success:false, message:response.message}
            }
            
            
            console.log("This is that thing ////////////////: ",JSON.stringify(providerServiceData, null, 2));


            return {success:true, providerData:response.providerData,}
            
        } catch (error) {
             console.log("Error in providerServiceVeiwUseCase: ",error);
             return {success:false, message:"Something went wrong in providerServiceViewUseCase"}
            
        }
}

      


}

export default UserServiceInteractor
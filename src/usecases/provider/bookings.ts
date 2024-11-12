import { IProviderBookingsInteractor } from "../../entities/iInteractor/provider/iBookings";
import IproviderRepository from "../../entities/irepository/iproviderRepo";
import { IAddSlotData, ISlotDataUseCase } from "../../entities/rules/provider";



class ProviderBookingsInteractor implements IProviderBookingsInteractor{
               constructor(private readonly BookingsRepository: IproviderRepository){}


      

  async addSlotUseCase(data: IAddSlotData): Promise<{ success: boolean; message?: string; slotData?: ISlotDataUseCase[] }> {
    try {

      const response = this.BookingsRepository.addSlotRepo(data)

      return response

    } catch (error) {
      console.log("Error in addSlotUseCase: ", error);
      return { success: false, message: "Something went wrong in addSlotUseCase" }

    }
  }

  async getAllSlotUseCase(providerId: string): Promise<{ success: boolean; message?: string; slotData?: ISlotDataUseCase[]; }> {
      try {
         const response  = await this.BookingsRepository.getAllSlotRepo(providerId)
         return response
         
      } catch (error) {
        console.log("Error in getAllSlotUseCase: ", error);
        return {success:false, message:"Something went wrong in getAllSlotUseCase" }
        
      }
  }




}

export default ProviderBookingsInteractor
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

  async updateSlotCountUseCase(slotId: string, state: number): Promise<{ success: boolean; message?: string; }> {
      try {
          const response = await this.BookingsRepository.updateSlotCountRepo(slotId, state);
          return response
        
      } catch (error) {
        console.log("Error in updateSlotCountUseCase: ",error)
        return {success:false, message:"Something went wrong in updateSlotCountUseCase"}
      }
  }

  async removeSlotUseCase(slotId: string): Promise<{ success: boolean; message?: string; }> {
      try {
        
          const response = await this.BookingsRepository.removeSlotRepo(slotId);
          return response
      } catch (error) {
          console.log("Error in removeSlotUseCase: ", error);
          return{success:false, message:"Something went wrong in removeSlotUsecase"}
        
      }
  }


  async getAllBookingsUseCase(providerId: string): Promise<{ success: boolean; message?: string; bookingData?: any; }> {
       try {
           const response = await this.BookingsRepository.getAllBookingRepo(providerId);
           return response
       } catch (error) {
           console.log("Error in getAllBookingUseCase: ", error);
           return{success:false, message:"Something went wrong in getAllBookingsUseCase"}
        
       }
  }
  async changeBookingStatusUseCase(bookingId: string, status: string): Promise<{ success: boolean; message?: string; }> {
       try {
             const response = await this.BookingsRepository.changeBookingStatusRepo(bookingId, status);
             return response
        
       } catch (error) {
           console.log("Error in changeBookingStatusUseCase: ", error);
           return{success:false, message:"Something went wrong in change bookingStatusUseCase"}
        
       }
  }

   async getSingleBookingUseCase(bookingId: string): Promise<{ success: boolean; message?: string; bookingData?: any; }> {
       try {
             const response = await this.BookingsRepository.getSingleBookingRepo(bookingId)
             return response
       } catch (error) {
            console.log('Error in getSingleBookingUseCase: ', error);
            return {success:false, message:"Something went wrong in getSingleBookingUseCase"}
        
       }
   }

   async getDashboardDetailsUseCase(providerId: string): Promise<{ success: boolean; message?: string; dashboardData?: any; }> {
        try {
            
          const response = await this.BookingsRepository.getDashboardDetailsRepo(providerId);
          return response

          
        } catch (error) {
            console.log("Error in getDashboardDetail");
            return {success:false, message:"Something went wrong in getDashboardDetailsUseCase"}
          
        }
   }


}

export default ProviderBookingsInteractor
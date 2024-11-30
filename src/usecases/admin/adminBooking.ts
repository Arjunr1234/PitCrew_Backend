import { IAdminBookingInteractor } from "../../entities/iInteractor/user/iAdminBookingInteractor";
import IAdminRepository from "../../entities/irepository/iAdminRepository";



class AdminBookingInteractor implements IAdminBookingInteractor{
     constructor(private readonly adminBookingRepository: IAdminRepository){}
     


     async getAllBookingsUseCase(): Promise<{ success: boolean; message?: string; bookingData?: any; }> {
         try {

            const response = await this.adminBookingRepository.getAllBookingsRepo();
            return response
          
         } catch (error) {
             console.log("Error in getAllBookingsUseCase: ", error);
             return {success:false, message:"Something went wrong in getAllBookingsUsecase"}
          
         }
     }
}

export default AdminBookingInteractor
import { Request , Response, NextFunction} from "express";
import { IAdminBookingInteractor } from "../../../entities/iInteractor/user/iAdminBookingInteractor";
import HttpStatus from "../../../entities/rules/statusCodes";




class AdminBookingController{
     constructor(private readonly adminBookingInteractor: IAdminBookingInteractor){}


     async getAllBookings(req:Request, res:Response, next:NextFunction){
           try {

            const response = await this.adminBookingInteractor.getAllBookingsUseCase();

            if(!response.success){
                res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
                return
            }

              res.status(HttpStatus.OK).json({success:true, bookingData: response.bookingData})
            
           } catch (error) {
               console.log("Error in getAllBookings Controller: ", error);
               next(error)
            
           }
     }
}

export default AdminBookingController
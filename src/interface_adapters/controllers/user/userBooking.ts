import { NextFunction, Response, Request } from "express";
import IUserBookingInteractor from "../../../entities/user/ibooking";
import HttpStatus from "../../../entities/rules/statusCodes";



class UserBookingController{
    constructor(private readonly userBookingInteractor:IUserBookingInteractor){}

    async serviceBookingPayment(req:Request, res:Response, next:NextFunction){
      try {
          const {data} = req.body
          console.log("Entered into serviceBookingPayment: ", JSON.stringify(data, null, 2))

           const response = await this.userBookingInteractor.serviceBookingPaymentUseCase(data);

           console.log("This is the resposne from controller: ", response)

           if(!response.success){
              res.status(400).json({success:response.success, message:response.message});
              return
           }

              res.status(HttpStatus.CREATED).json({success:response.success, session:response.session})
        
      } catch (error) {
          console.log("Error in serviceBooingInteractor: ", error)
        
      }
    }

    async checkAvaliableSlot(req:Request, res:Response, next:NextFunction){
         try {
            const providerId = req.query.providerId as string;
            const date = req.query.date as string

            console.log("This is providerId and date://////////////////////////////// ", providerId, date);

            if(!providerId){  
               res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide the necessary data"})
            }

            const response = await this.userBookingInteractor.checkingAvaliableSlotUseCase(providerId, date);
             
            if(!response.success){
               res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
            }

              res.status(HttpStatus.OK).json({success:response.success, message:response.message, slotId:response.slotId})

            
          
         } catch (error) {
             
             console.log("Error in checkAvaliable slot: ", error);
             next(error)
         }
    }

    async successfullPaymentStatusChange(req: Request, res: Response, next: NextFunction) {
        try {
            const { paymentSessionId, bookId } = req.body;

            if (!paymentSessionId || !bookId) {
                res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Please provide necessary data" })
            }

            const response = await this.userBookingInteractor.successfullPaymentStatusChangeUseCase(paymentSessionId, bookId);

            if (!response.success) {
                res.status(HttpStatus.BAD_REQUEST).json({ success: response.success, message: response.message })
            }

            res.status(HttpStatus.OK).json({ success: response.success, message: response.message })


        } catch (error) {
            console.log("Error in successfullPaymentStatusChange: ", error)
            next(error);
        }
    }

    async getAllBookings(req:Request, res:Response, next:NextFunction){
         try {
             const userId = req.query.userId as string;

             if(!userId){
                res.status(HttpStatus.BAD_REQUEST).json({success:false, mesage:"Please provide the id"})
             }

             const response = await this.userBookingInteractor.getAllBookingsUseCase(userId);

             if(!response.success){
                 res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
                 return 
             }

                res.status(HttpStatus.OK).json({success:response.success, bookingData:response.bookingData})


            
         } catch (error) {
            console.log("Error in getAllBookingsController: ", error)
            next(error)
         }
    }

}

export default UserBookingController
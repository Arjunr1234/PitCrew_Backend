import iUserRepository from "../../entities/irepository/iuserRepository";
import { IBookingData } from "../../entities/rules/provider";
import IUserBookingInteractor from "../../entities/user/ibooking";
import { confimPayment, makePayment, refundPayment } from "../../framework/config/stripe";
import {differenceInHours} from 'date-fns'




class UserBookingInteractor implements IUserBookingInteractor{
    constructor(private readonly userRepository:iUserRepository){}

    async checkingAvaliableSlotUseCase(providerId: string, date: string): Promise<{ success: boolean; message?: string; slotId?: string; }> {
        try {
            
             const response = await this.userRepository.checkAvaliableSlotRepo(providerId, date);
             return response
          
        } catch (error) {
            console.log("error in checkingAvalibleSlotUsecase: ", error);
            return {success:false, message:"Something went wrong in checkingAvaliableSlotUseCase"}
          
        }
    }

    async serviceBookingPaymentUseCase(
        data: IBookingData
      ): Promise<{ success: boolean; message?: string; session?: any }> {
        try {
          
          const serviceDetails = {
            services: data.selectedServices,
            amount: data.totalPrice + data.platformFee,
            platformFee:data.platformFee,
            serviceName: data.vehicleDetails.serviceName,
          };
      
         
          const bookService = await this.userRepository.serviceBookingRepo(data);
      
          if (bookService.success) {
           
            const session = await makePayment(serviceDetails, bookService.bookingDetails._id);
      
            if (session) {              
               
                return { success: true, session:session };
              
            } else {
              
              return { success: false, message: "Payment session creation failed." };
            }
          } else {
            
            return { success: false, message: bookService.message || "Service booking failed." };
          }
        } catch (error) {
          console.error("Something went wrong in serviceBookingPaymentUseCase:", error);
          return { success: false, message: "An error occurred during service booking and payment process." };
        }
      }

      
      async successfullPaymentStatusChangeUseCase(
        paymentSessionId: string,
        bookId: string
      ): Promise<{ success: boolean; message?: string }> {
        try {
        
          const paymentIntent = await confimPayment(paymentSessionId);
          console.log("This is the payment Intent: ", paymentIntent);
      
          if (!paymentIntent) {
            return { success: false, message: "Failed to fetch a valid payment intent" };
          }
      
          
          const changeBookingStatus = await this.userRepository.updateBooking(paymentIntent as string, bookId);
      
          
          return {
            success: changeBookingStatus.success,
            message: changeBookingStatus.message,
          };
      
        } catch (error) {
          console.error("Error occurred in successfullPaymentStatusChangeUseCase:", error);
          return { success: false, message: "Something went wrong in successfulPaymentStatusChangeUseCase" };
        }
      }

      async getAllBookingsUseCase(userId: string): Promise<{ success: boolean; message?: string; bookingData?: any; }> {
          try {
                const response = await this.userRepository.getAllBookingsRepo(userId);
                return response
            
          } catch (error) {
             console.log("Error in getAllBookingsUseCase: ", error);
             return {success:false, message:"Somthing went wrong in getAllBookingsUseCase"}
            
          }
      }

      async cancellBooingUseCase(bookingId: string, reason:string): Promise<{ success: boolean; message?: string; }> {
          try {


            const getBookingData = await this.userRepository.getCancelledBookingRepo(bookingId);

            if(!getBookingData.success){
               return {success:getBookingData.success, message:getBookingData.message} 
            }

             const currentTime = new Date();
             const scheduledDateTime = new Date(getBookingData.bookingData.serviceDate);

             const hourDifference = differenceInHours(scheduledDateTime, currentTime);

             let refundAmount:number;
             let refundStatus:string
             if(hourDifference >= 24){
                refundAmount = getBookingData.bookingData.subTotal - getBookingData.bookingData.platformFee
                refundStatus = "full refund"

             }else if(hourDifference > 0){
                refundAmount = (getBookingData.bookingData.subTotal - getBookingData.bookingData.platformFee) * .75
                refundStatus = "partial refund"

             }else {
              return { success: false, message: "Cancellation not allowed after the booking time has passed" };

            }

             const refund = await refundPayment(getBookingData.bookingData.paymentId, refundAmount);

             if(!refund.success){
                return {success:refund.success, message:refund.message}
             }

             const updateBooking = await this.userRepository.updateBookingAfterRefundRepo(bookingId, reason, refundAmount, refundStatus);

              return updateBooking
            
            
          } catch (error) {
             console.log("Error in cancellBookingUseCase: ", error);
             return {success:false, message:"Something went wrong in cancellBooingUsecase"}
            
          }
      }
      
   
}

export default UserBookingInteractor
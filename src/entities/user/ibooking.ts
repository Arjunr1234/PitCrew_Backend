import { IBookingData, IRatingData } from "../rules/provider"





interface IUserBookingInteractor{

   checkingAvaliableSlotUseCase(providerId:string, date:string):Promise<{success:boolean, message?:string, slotId?:string}>
   serviceBookingPaymentUseCase(data:IBookingData):Promise<{success:boolean, message?:string , session?:any}>
   successfullPaymentStatusChangeUseCase(paymentSessionId:string, bookId:string):Promise<{success:boolean, message?:string}>
   getAllBookingsUseCase(userId:string):Promise<{success:boolean, message?:string, bookingData?:any }>
   cancellBooingUseCase(bookingId:string, reason:string):Promise<{success:boolean, message?:string}>
   addRatingUseCase(ratingData:IRatingData):Promise<{success:boolean, message?:string}>
}

export default IUserBookingInteractor
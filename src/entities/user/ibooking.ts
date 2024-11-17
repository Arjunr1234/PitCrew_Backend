import { IBookingData } from "../rules/provider"





interface IUserBookingInteractor{

   checkingAvaliableSlotUseCase(providerId:string, date:string):Promise<{success:boolean, message?:string, slotId?:string}>
   serviceBookingPaymentUseCase(data:IBookingData):Promise<{success:boolean, message?:string , session?:any}>
   successfullPaymentStatusChangeUseCase(paymentSessionId:string, bookId:string):Promise<{success:boolean, message?:string}>
}

export default IUserBookingInteractor
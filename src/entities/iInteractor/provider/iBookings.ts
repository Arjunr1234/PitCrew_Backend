import { IAddSlotData, ISlotDataUseCase } from "../../rules/provider";



export interface IProviderBookingsInteractor{

  addSlotUseCase(data:IAddSlotData):Promise<{success:boolean, message?:string, slotData?:ISlotDataUseCase[]}>
  getAllSlotUseCase(providerId:string):Promise<{success:boolean, message?:string, slotData?:ISlotDataUseCase[]}>
  updateSlotCountUseCase(slotId:string, state:number):Promise<{success:boolean, message?:string}>
  removeSlotUseCase(slotId:string):Promise<{success:boolean, message?:string}>
  getAllBookingsUseCase(providerId:string):Promise<{success:boolean, message?:string, bookingData?:any}>
  changeBookingStatusUseCase(bookingId:string, status:string):Promise<{success:boolean, message?:string}>
  getSingleBookingUseCase(bookingId:string):Promise<{success:boolean, message?:string, bookingData?:any}>
  getDashboardDetailsUseCase(providerId:string):Promise<{success:boolean, message?:string, dashboardData?:any}>

}



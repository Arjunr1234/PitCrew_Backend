




export interface IAdminBookingInteractor{

  getAllBookingsUseCase():Promise<{success:boolean, message?:string, bookingData?:any}>

}





export interface IAdminBookingInteractor{

  getAllBookingsUseCase():Promise<{success:boolean, message?:string, bookingData?:any}>
  getDashboradDetailsUseCase():Promise<{success:boolean, message?:string, dashboradData?:any}>

}
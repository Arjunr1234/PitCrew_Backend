export interface IProviderAuthInteractor{
      sendOtp(email:string):Promise<{created:boolean, message?:string}>
}
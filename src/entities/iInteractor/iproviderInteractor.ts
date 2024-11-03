import { IProviderData,ILogData, IProviderResponseData, IProviderRegisterData } from "../rules/provider"



export interface IProviderAuthInteractor{
      sendOtp(email:string):Promise<{created:boolean, message?:string}>
      verifyOtpUseCase(email:string, otp:string):Promise<{success:boolean, message:string}>
      createProviderUseCase(providerData:IProviderRegisterData):Promise<{success:boolean, message:string}>
      loginUseCase(LogData:ILogData):Promise<{success:boolean, message?:string, provider?:IProviderResponseData, accessToken?:string, refreshToken?:string}>
}


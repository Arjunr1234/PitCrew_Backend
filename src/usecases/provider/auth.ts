import { NextFunction } from "express";
import { IProviderAuthInteractor } from "../../entities/iInteractor/iproviderInteractor";
import IproviderRepository from "../../entities/irepository/iproviderRepo";
import { ILogData, IProviderData, IProviderResponseData } from "../../entities/rules/provider";
import { Ijwtservices } from "../../entities/services/ijwt";
import Imailer from "../../entities/services/iMailer";
import UserRepository from "../../interface_adapters/repository/userRepository";
import { log } from "console";

class ProviderAuthInteractor implements IProviderAuthInteractor {
  constructor(
    private readonly providerAuthRepository: IproviderRepository, 
    private readonly mailer: Imailer, 
    private readonly jwt: Ijwtservices
  ) {}

  
  async sendOtp(email: string): Promise<{ created: boolean; message?: string }> {
    try {
      
      const providerExist = await this.providerAuthRepository.providerExist(email);
      if (!providerExist.success) {
        return { created: false, message: providerExist.message || "User already exists!" };
      }

      
      const sendMail = await this.mailer.sendMail(email);
      if (!sendMail.success) {
        return { created: false, message: "Failed to send OTP!" };
      }

      
      const saveOtp = await this.providerAuthRepository.saveOtp(sendMail.otp, email);
      if (!saveOtp.success) {
        return { created: false, message: saveOtp.message || "Failed to save OTP!" };
      }

      
      return { created: true, message: "OTP sent successfully!" };
    } catch (error) {
      
      console.error("Error in sendOtp:", error);
      return { created: false, message: "An error occurred while sending OTP." };
    }
  }
      async verifyOtpUseCase(email: string, otp: string): Promise<{ success: boolean; message: string; }> {
             
               const responseOtp = await this.providerAuthRepository.getOtp(email, otp);
                 
               if(responseOtp.otp === otp){
                 return {success:true, message:"Successfully Verified!!"}
               }
               return {success:false, message:"Verification failed!!"}
             
      }
     async createProviderUseCase(providerData: IProviderData): Promise<{ success: boolean; message: string; }> {
          
         console.log(providerData)
         const createUserRepo = await this.providerAuthRepository.createProvider(providerData);

          if(!createUserRepo){
            return {success:false, message:"some issue in creating the provider"}
          }
          
           return {success:true, message:"Registered successfully!!!"}
     
     }

      async loginUseCase(LogData: ILogData): Promise<{ success: boolean; message?: string;provider? :IProviderResponseData; accessToken?: string; refreshToken?: string;  }> {
                      
              try {
                console.log("This is the data in loginUserCase,", LogData)
                const loginResponse = await this.providerAuthRepository.loginRepo(LogData)

                if(loginResponse.message === "Wrong email"){
                    return {success:false, message:"Please enter a valid email!!"}
                }
 
                if(loginResponse.message === "Wrong password"){
                   return {success:false, message:"Incorrect password"}
                }

                const payload = {
                   _id:loginResponse.provider?._id,
                   email:loginResponse.provider?.email,
                   role:'provider'

                }
                const accessToken = this.jwt.generateToken(payload, {expiresIn:'1h'})
                const refreshToken = this.jwt.generateRefreshToken(payload, {expiresIn:'14d'})
 
                return {success:true, message:"Login Successfull!!",provider:loginResponse.provider, accessToken:accessToken, refreshToken:refreshToken} 

              } catch (error) {
                  console.log("Error occur: ",error);
                  return {success:false, message:"Some error occured during login interactor",}
                
              }
      }

    

     
      
}

export default ProviderAuthInteractor;

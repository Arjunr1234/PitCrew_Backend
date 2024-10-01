import { IProviderAuthInteractor } from "../../entities/iInteractor/iproviderInteractor";
import IproviderRepository from "../../entities/irepository/iproviderRepo";
import { Ijwtservices } from "../../entities/services/ijwt";
import Imailer from "../../entities/services/iMailer";

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
}

export default ProviderAuthInteractor;

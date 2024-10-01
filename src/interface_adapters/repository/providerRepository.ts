import IproviderRepository from "../../entities/irepository/iproviderRepo";
import providerModel from "../../framework/mongoose/model/providerSchema";
import OtpModel from "../../framework/mongoose/model/otpSchema";

class ProviderRepository implements IproviderRepository {

  
  async providerExist(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const findProvider = await providerModel.findOne({ email });
      if (findProvider) {
        return { success: false, message: "User already exists!" };
      }
      return { success: true };
    } catch (error) {
      throw new Error("Error checking provider existence");
    }
  }

  
  async saveOtp(otp: string, email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const storeOtp = await OtpModel.create({ email, otp });
      return { success: true };
    } catch (error) {
      throw new Error("Error saving OTP");
    }
  }
}

export default ProviderRepository;

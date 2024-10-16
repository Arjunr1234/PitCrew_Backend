import IproviderRepository from "../../entities/irepository/iproviderRepo";
import providerModel from "../../framework/mongoose/model/providerSchema";
import OtpModel from "../../framework/mongoose/model/otpSchema";
import { ILogData, IProviderData,IProviderResponseData } from "../../entities/rules/provider";
import bcrypt from 'bcrypt'

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

  async getOtp(email: string, otp: string): Promise<{ success: boolean; otp?:string | undefined }> {
         
        const checkOtp = await OtpModel.findOne({email,otp})
        console.log("This is the response: ", checkOtp);

        if(!checkOtp){
          return {success:false, otp:''}
        }
        return {success:true, otp:checkOtp.otp}

  }

  async createProvider(providerData: IProviderData): Promise<{ success: boolean; message?: string }> {
    try {
      const saltRounds = 10;
  
      
      const hashedPassword = await bcrypt.hash(providerData.password, saltRounds);
  
      
      const {password, ...restProvidedData} = providerData
      const providerCreated = await providerModel.create({
        password: hashedPassword,
        ...restProvidedData,
      });
  
      
      if (!providerCreated) {
        return { success: false, message: 'Provider creation failed' };
      }
  
      
      return { success: true };
  
    } catch (error) {
      
      console.error("Error in createProvider:", error);
      return { success: false, message: 'An error occurred during provider creation' };
    }
  }

  async loginRepo(loginData: ILogData): Promise<{ success: boolean; message?: string,  provider?: IProviderResponseData; }> {
    try {
      const { email, password } = loginData;
      console.log("Entered into loginRepo");
  
      
      const loginResponse = await providerModel.findOne({ email: email });
      
  
     
      if (!loginResponse) {
        return { success: false, message: "Wrong email" };
      }
  
      
      const passwordMatch = await bcrypt.compare(password, loginResponse.password);
  
      
     
      if(loginResponse.requestAccept === null){
        return {success:false, message:"rejected"}
      }
      if(!loginResponse.requestAccept){
        return {success:false, message:"pending"}
      }

      if(loginResponse.blocked){
        return {success:false, message:"blocked"}
      }
      if (!passwordMatch) {
        return { success: false, message: "Wrong password" };
      }
      
  
      console.log("This is the providerResponse: ", loginResponse);
  
      
      const loginResponseObject = loginResponse.toObject();
  
     
      const { password: hashedPassword, ...remainResponse } = loginResponseObject;
      const providerData: IProviderResponseData = {
        ...remainResponse,
        _id: loginResponseObject._id.toString() 
      };
      
      return { success: true, provider:providerData  };
  
    } catch (error) {
      console.log("Error in loginRepo:", error);
      return { success: false, message: "An error occurred during login" };
    }
  }

  
  
  
  
   

  
}

export default ProviderRepository;

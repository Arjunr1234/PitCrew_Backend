import { user, userResponseData, userSignIn } from "../rules/user";

interface IUserAuthInteractor {
  sendotp(email: string): Promise<{ success: boolean; message: string }>; 
  otpVerification(email: string, otp: string): Promise<boolean>;
  verifyAndSignup(
    userData: user,
    otp: string
  ): Promise<{
    user?: Object;
    success: boolean;
    message: string;
    acessToken?: string | undefined;
    refreshToken?: string | undefined;
  }>;
  login(userData:userSignIn):Promise<{user?:userResponseData ,success:boolean ,message?:string,accesToken?:string,refreshToken?:string}>

}

export default IUserAuthInteractor;

import iUserRepository from "../../entities/irepository/iuserRepository";
import { user, userResponseData, userSignIn } from "../../entities/rules/user";
import { Ijwtservices } from "../../entities/services/ijwt";
import Imailer from "../../entities/services/iMailer";
import IUserAuthInteractor from "../../entities/user/iauth";

class UserAuthInteractor implements IUserAuthInteractor {
  constructor(
    private readonly userRepository: iUserRepository,
    private readonly Mailer: Imailer,
    private readonly jwtServices: Ijwtservices
  ) {}

  async sendotp(email: string): Promise<{ success: boolean; message: string }> {
    const userExist = await this.userRepository.userexist(email);

    if (!userExist) {
      console.log("Entered into not userExist in userInteractor");
      const mailresponse = await this.Mailer.sendMail(email);
      console.log("This is the mail response: ", mailresponse);
      await this.userRepository.tempOTp(mailresponse.otp, email);
      if (mailresponse.success) {
        return { success: true, message: "Otp sent to your email" };
      } else {
        return { success: false, message: "Something went wrong, cannot send otp to your email" };
      }
    } else {
      return { success: false, message: "User already exists with the same email" };
    }
  }

  // Implementing the otpVerification method as required by the interface
  async otpVerification(email: string, otp: string): Promise<boolean> {
    const otpVerified = await this.userRepository.otpVerification(email, otp);
    return otpVerified;
  }

  async verifyAndSignup(
    userData: user,
    otp: string
  ): Promise<{
    user?: Object;
    success: boolean;
    message: string;
    acessToken?: string | undefined;
    refreshToken?: string | undefined;
  }> {
    const otpVerified = await this.otpVerification(userData.email, otp);
    if (!otpVerified) {
      return { success: false, message: "Otp verification failed" };
    }

    const signup = await this.userRepository.signup(userData);
    if (!signup.created) {
      return { success: false, message: "Signup failed, try again" };
    }

    const acessToken = this.jwtServices.generateToken(
      { user: signup.user, email: userData.email },
      { expiresIn: "1h" }
    );
    const refreshToken = this.jwtServices.generateRefreshToken(
      { user: signup.user, email: userData.email },
      { expiresIn: "1d" }
    );

    return {
      user: signup.user,
      success: true,
      message: "Signup successful",
      acessToken: acessToken,
      refreshToken: refreshToken,
    };
  }

  async login(userData: userSignIn): Promise<{ user?: userResponseData; success: boolean; message?: string; accesToken?: string; refreshToken?: string; }> {

    console.log(userData);
        
    const response = await this.userRepository.login(userData)
    console.log("This is the response from interctor : ",response)
    if (!response.success) {
        if (response.message === "wrong email") {
            return response
        }
        if (response.message === "wrong password") {
            return response
        }
    }
    const acessToken = this.jwtServices.generateToken({ user: response.user, email: userData.email }, { expiresIn: '1h' })
    const refreshToken = this.jwtServices.generateRefreshToken({ user: response.user, email: userData.email }, { expiresIn: '1d' })

    return { user: response.user, success: response.success, message: response.message, accesToken: acessToken, refreshToken: refreshToken }
      
  }
  
}

export default UserAuthInteractor;

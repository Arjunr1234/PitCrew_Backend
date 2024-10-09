import iUserRepository from "../../entities/irepository/iuserRepository";
import userModel from "../../framework/mongoose/model/userSchema";
import OtpModel from "../../framework/mongoose/model/otpSchema";
import { user, userResponseData, userSignIn } from "../../entities/rules/user";
import bcrypt from 'bcrypt';

class UserRepository implements iUserRepository {

  async tempOTp(otp: string, email: string): Promise<{ created: boolean }> {
    console.log("Entered in temp otp in userRepository");
    const newotp = await OtpModel.create({
      email: email,
      otp: otp
    });
    if (newotp) {
      return { created: true };
    }
    return { created: false };
  }
  
  async userexist(email: string): Promise<boolean> {
    const userExist = await userModel.findOne({ email: email });
    console.log(userExist);
    return !!userExist;
  }

  async phoneExist(phone:string):Promise<boolean>{
      const phoneExist = await userModel.findOne({phone:phone})
      return !!phoneExist
  }

  async otpVerification(email: string, otp: string): Promise<boolean> {
    const otpverifed = await OtpModel.findOne({ otp: otp, email: email });
    console.log("otpverfied", otpverifed);
    return otpverifed !== null;
  }

  async signup(userData: user): Promise<{ user: userResponseData; created: boolean; }> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const createUser = await userModel.create({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: hashedPassword, 
      blocked: false
    });

    const user = {
      id: createUser._id.toString(),
      name: createUser.name,
      email: createUser.email,
      mobile: createUser.phone.toString(),
      blocked: createUser.blocked
    };

    if (createUser) {
      return { user: user, created: true };
    } else {
      return { user: user, created: false };
    }
  }

  async login(userData: userSignIn): Promise<{ user?: userResponseData; success: boolean; message?: string; }> {
      const user = await userModel.findOne({email:userData.email});
      console.log("This is the userDAta from login: ", userData)
      console.log(user)
      if(!user){
        return {success:false, message:"wrong email"}
      }
      console.log("reeach here")
      
      const passwordMatch = await bcrypt.compare(userData.password, user.password);
        
      if (!passwordMatch) {
         return {success:false, message:"wrong password"}
      }

      

      
      const userinfo: userResponseData = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          mobile: user.phone + "" ,
          blocked: user.blocked
      };

      
      return { user: userinfo, success: true };
  }
}

export default UserRepository;

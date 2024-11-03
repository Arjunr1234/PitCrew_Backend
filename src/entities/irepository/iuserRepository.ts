import { IBrandData, IDetails, IProvidersData, IServiceData, user } from "../rules/user"
import { userResponseData } from "../rules/user"
import { userSignIn } from "../rules/user"



interface iUserRepository{
  tempOTp(otp:string,email:string):Promise<{created:boolean}>
  userexist(email:string):Promise<boolean>
  otpVerification(email:string, otp:string):Promise<boolean>
  signup(userData:user):Promise<{user:userResponseData,created:boolean}>
  login(userData:userSignIn):Promise<{user?:userResponseData,success:boolean,message?:string}>
  phoneExist(phone:string):Promise<boolean>
  getAllServiceRepo():Promise<{success:boolean, serviceData?:IServiceData[] , message?:string}>
  getAllBrandRepo():Promise<{success:boolean, message?:string, brandData?:IBrandData[]}>
  findProvidersRepo(data:IDetails):Promise<{success:boolean, message?:string, providersData?:IProvidersData[] | [] }>

}







export default iUserRepository
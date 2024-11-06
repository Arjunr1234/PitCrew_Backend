import { IAdminAuthInteactor } from "../../entities/iInteractor/iAdminInteractor";
import IAdminRepository from "../../entities/irepository/iAdminRepository";
import { IAdminLoginData, IAdminLoginResponse } from "../../entities/rules/admin";
import { Ijwtservices } from "../../entities/services/ijwt";


class AdminAuthInteactor implements IAdminAuthInteactor{
     constructor(
        private readonly adminAuthRepository:IAdminRepository,
        private readonly jwt:Ijwtservices
     ){}

     async loginUseCase(adminLoginData: IAdminLoginData): Promise<{success: boolean; message?: string; adminData?: IAdminLoginResponse; accessToken?: string; refreshToke?: string;  }> {
         
        const loginResponse = await this.adminAuthRepository.loginRepo(adminLoginData);

        if(!loginResponse.success){
           if(loginResponse.message === "userNotExists"){
               return {success:false, message:"Invalid email please try another"}
           }
           if(loginResponse.message === "incorrectPassword"){
              return {success:false, message:"Incorrect password!!"}
           }

           return {success:false, message: "some unknown error is occured "}
        }

        const payload = {
            roleId:loginResponse.adminData?._id,
            email:loginResponse.adminData?.email,
            role:"admin"
        }

        const accessToken = this.jwt.generateToken(payload, {expiresIn:'1h'});
        const refreshToken = this.jwt.generateRefreshToken(payload, {expiresIn:"14d"});


        return {success:true, message:"Successfully LoggedIn ",adminData:loginResponse.adminData, accessToken:accessToken, refreshToke:refreshToken}
     }
   



}

export default AdminAuthInteactor
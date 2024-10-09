import { IAdminLoginData, IAdminLoginResponse } from "../rules/admin";


export interface IAdminAuthInteactor{

  loginUseCase(adminLoginData:IAdminLoginData):Promise<{success:boolean, message?:string, adminData?:IAdminLoginResponse,accessToken?:string, refreshToke?:string }>
  
}


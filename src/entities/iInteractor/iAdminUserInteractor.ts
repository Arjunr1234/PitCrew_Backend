import { userData } from "../rules/admin";

export interface IAdminUserInteractor{

  getUsersUseCase():Promise<{success:boolean; users?:userData[]|[], active?:number, blocked?:number}>
  userBlockAndUnblockUseCase(id:string,state:boolean):Promise<{success:boolean,message?:string}>
   
}
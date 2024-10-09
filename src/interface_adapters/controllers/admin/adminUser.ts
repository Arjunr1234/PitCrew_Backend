
import { NextFunction, Request, Response } from "express-serve-static-core";
import { IAdminUserInteractor } from "../../../entities/iInteractor/iAdminUserInteractor";



class AdminUserCotroller{
    constructor(private readonly adminUserInteractor:IAdminUserInteractor){}

    async getUser(req:Request, res:Response, next:NextFunction){
      
        const response = await this.adminUserInteractor.getUsersUseCase()
        console.log("This is the response from getUser AdminController: ", response)
        if(!response.success){
           res.status(503).json({success:response.success})
        }
        console.log("This is blockunblc from controller: ", response.active, response.blocked)
        res.status(200).json({success:true, users:response.users, active:response.active, blocked:response.blocked})
    }

    async userBlockAndUnblock(req:Request, res:Response, next:NextFunction){
          console.log("Entered into userBlock unblock: ")
           const {id, state} = req.body

           const response = await this.adminUserInteractor.userBlockAndUnblockUseCase(id, state);

           if(!response.success){
              res.status(400).json({success:response.success, message:response.message })
              return 
           }
           
           res.status(200).json({success:response.success, message:response.message})

    }


}

export default AdminUserCotroller
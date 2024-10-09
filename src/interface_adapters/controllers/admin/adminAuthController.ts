import { NextFunction, Request, Response } from "express";
import { IAdminAuthInteactor } from "../../../entities/iInteractor/iAdminInteractor";



class AdminAuthController{
 
    constructor(
      private readonly AdminAuthInteractor:IAdminAuthInteactor
    ){}


    async login(req:Request, res:Response, next:NextFunction){
        console.log("Enteed in to admincontroller login")
        console.log("This is the body: ", req.body);

        const loginResponse = await this.AdminAuthInteractor.loginUseCase(req.body);

        if(!loginResponse.success){
           res.status(400).json({success:false, message:loginResponse.message})
        }else{
          console.log("refresh: ",loginResponse.refreshToke)

          res.cookie('refreshToken', loginResponse.refreshToke, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 * 1000, 
        });

        res.cookie('accessToken', loginResponse.accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        });

        res.status(200).json({success:true, message:loginResponse.message, adminData:loginResponse.adminData, })

        }

    }

    async logout(req:Request, res:Response, next:NextFunction){
        try {
          res.clearCookie('refreshToken', {
            httpOnly:true,
            sameSite:true,
            path:'/'
         });
         res.status(200).json({success:true, message: 'Logout successfull' });
          
        } catch (error) {
          console.log(error)
          next(error)
          
        }
    }

    async verifiedToken(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        // Your logic here
        res.status(200).json({ success: true });
      } catch (error) {
        next(error); // Pass errors to Express error handling middleware
      }
    }
         
}

export default AdminAuthController
import { NextFunction, Request, Response } from "express";
import { IAdminAuthInteactor } from "../../../entities/iInteractor/iAdminInteractor";
import jwt from "jsonwebtoken";



class AdminAuthController{
 
    constructor(
      private readonly AdminAuthInteractor:IAdminAuthInteactor
    ){}


    async login(req: Request, res: Response, next: NextFunction) {
      console.log("Entered into admincontroller login");
      console.log("This is the body: ", req.body);
  
      const loginResponse = await this.AdminAuthInteractor.loginUseCase(req.body);
  
      if (!loginResponse.success) {
          res.status(400).json({ success: false, message: loginResponse.message });
      } else {
          
          res.cookie('adminRefreshToken', loginResponse.refreshToke, {
              httpOnly: true,
              sameSite: 'strict',
              path: '/',
              maxAge: 14 * 24 * 60 * 60 * 1000, 
          });
  
          
          res.cookie('adminAccessToken', loginResponse.accessToken, {
              httpOnly: true,
              sameSite: 'strict',
              maxAge: 15 * 60 * 1000, 
          });
  
          res.status(200).json({
              success: true,
              message: loginResponse.message,
              adminData: loginResponse.adminData,
          });
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

  

    // async verifiedToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    //   try {
    //     // Extract token from cookies or headers
    //     const accessToken = req.cookies?.adminAccessToken || req.headers.authorization?.split(" ")[1];
    //     if (!accessToken) {
    //        res.status(403).json({ success: false, message: 'Access token is missing' });
    //        return
    //     }
    
    //     // Verify token
    //     jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY as string, (err:any, decoded:any) => {
    //       if (err) {
    //         return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    //       }
    
    //       // If token is valid
    //       res.status(200).json({ success: true });
    //     });
    //   } catch (error) {
    //     next(error); // Pass errors to Express error handling middleware
    //   }
    // }
    
         
}

export default AdminAuthController
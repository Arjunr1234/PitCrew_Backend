import { NextFunction, Request, Response } from "express-serve-static-core";
import { IProviderAuthInteractor } from "../../../entities/iInteractor/iproviderInteractor";

class ProviderAuthController {
  constructor(private readonly providerAuthInteractor: IProviderAuthInteractor) {}

  
  async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log("hellow")
      const { email } = req.body;

      
      if (!email) {
        res.status(400).json({ success: false, message: "Please provide email" });
        return;
      }

      
      const sendOtpResponse = await this.providerAuthInteractor.sendOtp(email);

      
      if (!sendOtpResponse.created) {
        console.log("There is someting error happend")
        res.status(400).json({ success: false, message: sendOtpResponse.message });
        return;
      }

      console.log("otp is sended")
      res.status(200).json({ success: true, message: sendOtpResponse.message });
    } catch (error) {
      
      console.error("Error in sendOtp:", error);
      next(error); 
    }
  }

   async verifyOtp(req:Request, res:Response, next:NextFunction){
       const {email, otp} = req.body

       const verifyOtp = await this.providerAuthInteractor.verifyOtpUseCase(email, otp);
       if(verifyOtp.success){
          res.status(200).json({success:true, message:verifyOtp.message})
          return 
       }
          res.status(400).json({success:false, message:verifyOtp.message})



   }

    async createProvider(req:Request, res:Response, next:NextFunction){
          try {
            
            const response = await this.providerAuthInteractor.createProviderUseCase(req.body);
            if(!response.success){
              res.status(400).json({success:response.success, message:response.message})
              return 
            }
             res.status(200).json({success:response.success, message:response.message})
            
          } catch (error) {
              console.log(error);
            
            
          }
    }

    async login(req:Request, res:Response, next:NextFunction){
         try {

           //   console.log("This is the body: ",req.body);

             const loginResponse  = await this.providerAuthInteractor.loginUseCase(req.body);
             
             if(!loginResponse.success){
                res.status(400).json({success:false, message:loginResponse.message})
             }else{
              res.cookie('providerRefreshToken', loginResponse.refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge:  7 * 24 * 60 * 60 * 1000,
            });

            res.cookie('providerAccessToken', loginResponse.accessToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000, 
            });
           

            res.status(200).json({ provider: loginResponse.provider, success: true, message:loginResponse.message});
            
          }
             
          
         } catch (error) {
           console.log(error);
           
          
         }
    }

    async logout(req:Request, res:Response, next:NextFunction){
             
              try {
                  
                console.log("Entered in to logout provider")

                res.clearCookie('providerRefreshToken', {
                 httpOnly: true,
                 sameSite: true,
                 path: '/'
                });
                res.clearCookie('providerAccessToken', {
                  httpOnly: true,
                  sameSite: true,
                  path: '/'
                 });
                res.status(200).json({success:true, message:"Logout successfull!!"})

              } catch (error) {
                  next(error);
                  
                
              }
    }
}

export default ProviderAuthController;

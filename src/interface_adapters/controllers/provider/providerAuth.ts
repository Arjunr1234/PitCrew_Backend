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
        res.status(400).json({ success: false, message: sendOtpResponse.message });
        return;
      }

      
      res.status(200).json({ success: true, message: sendOtpResponse.message });
    } catch (error) {
      
      console.error("Error in sendOtp:", error);
      next(error); 
    }
  }
}

export default ProviderAuthController;

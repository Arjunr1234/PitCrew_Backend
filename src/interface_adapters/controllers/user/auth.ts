import { Response, Request, NextFunction } from "express";
import IUserAuthInteractor from "../../../entities/user/iauth";

class AuthController {
  constructor(private readonly interactor: IUserAuthInteractor) {}

  async sendOtpController(req: Request, res: Response): Promise<void> {
    try {
      const email = req.body?.email;
      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return; 
      }

      const response = await this.interactor.sendotp(email);
      console.log("This is the response in controller: ", response);
      if (response.success) {
        res.status(200).json({ success: true, message: response.message });
      } else {
        res.status(200).json({ success: false, message: response.message });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Failed to send OTP", error: error.message });
    }
  }

  async otpVerificationAndSignup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userData, otp } = req.body;

      if (!userData || !otp) {
        res.status(400).json({ success: false, message: "Missing user data or OTP." });
        return;
      }

      const response = await this.interactor.verifyAndSignup(userData, otp);

      if (response.success) {
        res.cookie('refreshToken', response.refreshToken, {
          httpOnly: true,
          sameSite: true,
          path: '/',
          maxAge: 15 * 60 * 1000 // 15 minutes
        });

        res.cookie('accessToken', response.acessToken, { // Fixed the typo here
          httpOnly: true,
          sameSite: true,
          maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({ user: response.user, success: true, message: response.message });
      } else {
        res.status(400).json({ success: false, message: response.message });
      }
    } catch (error) {
      console.error(error);
      next(error); 
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { logData } = req.body;
        const response = await this.interactor.login(logData);

        if (!response.success) {
            res.status(400).json({ success: false, message: response.message });
        } else {
            res.cookie('refreshToken', response.refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/',
                maxAge: 15 * 60 * 1000, 
            });

            res.cookie('accessToken', response.accesToken, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });

            res.status(200).json({ user: response.user, success: true, message: "LOGGED IN" });
        }
    } catch (error: unknown) {
        next(error);
    }
}

}

export default AuthController;

import { NextFunction, Request, Response } from "express-serve-static-core";
import { IAdminProviderInteractor } from "../../../entities/iInteractor/iAdminProviderInteractor";


class AdminProviderController {
     constructor(private readonly adminProviderInteractor:IAdminProviderInteractor){}

     async getPendingProviders(req:Request, res:Response, next:NextFunction){
       try {
         console.log("Entered into getPendingProviders");
         const response = await this.adminProviderInteractor.getPendingProvidersUseCase();
         if (!response.success) {
           res.status(401).json({ success: true, message: response.message })
         }
         res.status(200).json({ success: true, message: response.message, provider: response.providers })

       } catch (error) {
         next(error)

       }
     }

  async getProviders(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Entered into getPendingProviders");
      const response = await this.adminProviderInteractor.getPendingProvidersUseCase();
      if (!response.success) {
        res.status(401).json({ success: true, message: response.message })
      }
      res.status(200).json({ success: true, message: response.message, provider: response.providers })

    } catch (error) {
      next(error)

    }

  }
}

export default AdminProviderController
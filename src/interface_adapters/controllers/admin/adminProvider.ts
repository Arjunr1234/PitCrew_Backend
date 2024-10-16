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
      const response = await this.adminProviderInteractor.getProvidersUseCase();
      if (!response.success) {
        res.status(401).json({ success: true, message: response.message })
      }
      res.status(200).json({ success: true, message: response.message, provider: response.providers })

    } catch (error) {
      next(error)

    }

  }

  async providerAcceptOrReject(req:Request, res:Response, next:NextFunction){
               const {id, state} = req.body
           try {
               const response = await this.adminProviderInteractor.providerAcceptAndReject(id, state);
               if(!response.success){
                 res.status(400).json({success: false});
                 return 
               }
               res.status(200).json({success: true})
            
           } catch (error) {
              next(error)
            
           }    
  }

  async providerBlockAndUnblock(req:Request, res:Response, next:NextFunction){
            
          try {

            const {id, state} = req.body

            const response = await this.adminProviderInteractor.providerBlockAndUnblockUseCase(id, state);
 
            if(!response.success){
               res.status(400).json({success:false})
               return
            }
            res.status(200).json({success:true})
            
          } catch (error) {
              next(error)
            
          }
  }
}

export default AdminProviderController
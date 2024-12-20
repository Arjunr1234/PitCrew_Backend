import { NextFunction, Request, Response } from "express-serve-static-core";
import { IAdminProviderInteractor } from "../../../entities/iInteractor/iAdminProviderInteractor";
import HttpStatus from "../../../entities/rules/statusCodes";


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
               const {id, state, reason,providerEmail} = req.body
           try {
            const data = {
              id,state, reason,providerEmail
           }
             if(state === false){
               if(!id  || !reason || !providerEmail){
                   res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide the necessary data"});
                   return
               }
              }
                console.log("This is data: ",data)

               const response = await this.adminProviderInteractor.providerAcceptAndReject(id, state, reason, providerEmail);
               if(!response.success){
                 res.status(400).json({success: false, message:response.message});
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
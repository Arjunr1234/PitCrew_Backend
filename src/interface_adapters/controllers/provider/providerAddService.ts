import { NextFunction, Request, Response } from "express-serve-static-core";
import { IProviderAddServiceInteractor } from "../../../entities/iInteractor/provider/addService";




class ProviderAddServiceController {
  constructor(private readonly providerAddServiceInteractor: IProviderAddServiceInteractor) { }

  async getAllServices(req: Request, res: Response, next: NextFunction) {
    try {
      
      const response = await this.providerAddServiceInteractor.getAllServiceUseCase();

      if(!response.success){
          res.status(400).json({success:false, message:response.message, })
          return 
      }

      res.status(200).json({success:response.success, message:response.message, services:response.services})


    } catch (error) {
      next(error)

    }
  }

  async getAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("Entered into getAllBrands");

        const response = await this.providerAddServiceInteractor.getAllBrandsUseCase();

        if (!response.success) {
            res.status(400).json({ success: response.success, message: response.message });
            return;
        }

        res.status(200).json({ success: true, brands: response.brands });
        return;

    } catch (error) {
        console.error("Error in getAllBrands:", error); 
        next(error); 
    }
}




}

export default ProviderAddServiceController


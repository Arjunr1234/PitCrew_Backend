import { NextFunction, Request, Response } from "express-serve-static-core";
import { IProviderAddServiceInteractor } from "../../../entities/iInteractor/provider/addService";
import HttpStatus from "../../../entities/rules/statusCodes";




class ProviderAddServiceController {
  constructor(private readonly providerAddServiceInteractor: IProviderAddServiceInteractor) { }

 

  async getAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("Entered into getAllBrands");

        const providerId = req.query.id

        if(!providerId){
          res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Id is not found!!"})
        }
        
        
        const response = await this.providerAddServiceInteractor.getAllBrandsUseCase(providerId as string)
         
        console.log("This is the response: ", response);

        if(!response.success){
           res.status(HttpStatus.BAD_REQUEST).json({success:false, message:response.message})
        }

          res.status(HttpStatus.OK).json({success:response.success, brandData:response.brandData})
        

    } catch (error) {
        console.error("Error in getAllBrands:", error); 
        next(error);
    }
}

async getAllProviderService(req:Request, res:Response, next:NextFunction){

     const  id = req.query.id as string | ""
     const vehicleType = req.query.vehicleType as string | ""

     if(!id || !vehicleType){
         res.status(400).json({
            success:false,
            message:"id and vehicle type is required"
         })
     }

     try {

        const response = await this.providerAddServiceInteractor.getAllProviderService(id, parseInt(vehicleType))
        res.status(response.success ? HttpStatus.OK : HttpStatus.NOT_FOUND).json(response)

        
     } catch (error) {
        console.error("Error fetching provider services:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching provider services.",
      });
        next(error)
        
     }


}

async addGeneralOrRoadService(req:Request, res:Response, next:NextFunction){
      try {
          console.log("Entered into addGereal or raodservice")

           const {providerId, typeId, category, vehicleType} = req.body;
           console.log(req.body);

           if(!providerId || !category || !typeId || !vehicleType){
            res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide Id"})
         }
           

           const data = {
              providerId: providerId,
              typeId,
              category,
              vehicleType
           }

           const response = await this.providerAddServiceInteractor.addGeneralOrRoadServiceUseCase(data);

           if(!response.success){
              res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
           }
            
           
           res.status(HttpStatus.CREATED).json({success:response.success,  message:response.message})


        
      } catch (error) {
          next(error)
        
      }
}


async addBrand(req:Request, res:Response,  next:NextFunction){
     console.log("Enteed into addBrand controlller")
          try {
             const {providerId, brandId,brandName } = req.body
             const data = {
               providerId,
               brandId,
               brandName
             }
             const response = await this.providerAddServiceInteractor.addBrandUseCase(data)
             if(!response.success){
                res.status(HttpStatus.BAD_REQUEST).json({success:false, message:response.message})
                return
             }

             res.status(HttpStatus.OK).json({success:true, message:response.message})
            
          } catch (error) {
              next(error)
            
          }
}

async removeBrand(req:Request, res:Response, next:NextFunction){
     try {

      const providerId = req.query.providerId as string;
      const brandId = req.query.brandId as string;

      if(!providerId || !brandId){
         res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide the Id"})
         return
      }
      const data = {
        providerId ,
        brandId ,
      }

      const response = await this.providerAddServiceInteractor.removeBrandUseCase(data);

      if(!response.success){
         res.status(HttpStatus.BAD_REQUEST).json({success:false, message:response.message})
         return
      }
      
      res.status(HttpStatus.OK).json({success:true, message:response.message})
      
      
     } catch (error) {
         next(error)
      
     }
}

async addGeneralService(req:Request, res:Response, next:NextFunction){
        try {
             const {providerId,category, serviceId, vehicleType } = req.body 

             if(!providerId || !category || !serviceId || !vehicleType){
                res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide Id"})
             }
          
        } catch (error) {
            console.log("Errro in addGeneralService: ", error);
            next(error)
          
        }
}




}

export default ProviderAddServiceController


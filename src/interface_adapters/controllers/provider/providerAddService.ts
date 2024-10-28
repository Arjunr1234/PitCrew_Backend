import { NextFunction, Request, Response } from "express-serve-static-core";
import { IProviderAddServiceInteractor } from "../../../entities/iInteractor/provider/addService";
import HttpStatus from "../../../entities/rules/statusCodes";
import { IRemoveSubTypeData, ISubTypeData } from "../../../entities/rules/provider";




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

       response.providerGeneralServiceData?.forEach((item)=>{
        console.log("the data",item);
        
       })
         
      
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

async addSubType(req:Request, res:Response, next:NextFunction){
    try {

          const { providerId, serviceId, newSubType} = req.body

          const data:ISubTypeData = {providerId, serviceId, newSubType} 

          const response = await this.providerAddServiceInteractor.addSubTypeUseCase(data)

          if(!response.success){
             res.status(HttpStatus.BAD_REQUEST).json({succeess:false, message:response.message});
             return
          }
          
          res.status(HttpStatus.OK).json({success:true, message:response.message})
          
      
    } catch (error) {
         console.log("Error in addSubType: ",error);
         next(error)
      
    }
}

async removeSubType(req:Request, res:Response, next:NextFunction){
      try {
            console.log("Entered into removeSubType");

            const providerId = req.query.providerId as string;
            const serviceId = req.query.serviceId as string;
            const type = req.query.type as string;
            const vehicleType = req.query.vehicleType as string

            const data:IRemoveSubTypeData = {
               providerId,
               serviceId,
               type,
               vehicleType
           }
          

            if(!providerId || !serviceId || !type || !vehicleType){
               res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provider the necessary details"})
               return
            }

            
          

            const response = await this.providerAddServiceInteractor.removeSubTypeUseCase(data);

            if(!response.success){
               res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
               return
            }

              res.status(HttpStatus.OK).json({success:response.success, message:response.message})
            
         
      } catch (error) {
         console.log("Error in removeSubType: ", error)
          next(error);
         
      }
}


async editSubtype (req:Request, res:Response, next:NextFunction){
     try {
          const {providerId, serviceId, subType} = req.body

          const data = {providerId, serviceId, subType}
          console.log("This is data: ",data)
          if(!providerId || !serviceId || !subType){
             res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide the necessary data!!"});
             return
          }
          

          const response = await this.providerAddServiceInteractor.editSubTypeUseCase(data);
          if(!response.success){
            res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
            return 
          }

          res.status(HttpStatus.CREATED).json({success:response.success, messeage:response.message})
      
     } catch (error) {
          console.log("Error in the editSubType: ", error);
          next(error)
      
     }
}

async removeService(req:Request, res:Response, next:NextFunction){
     try {
          const providerId = req.query.providerId as string;
          const serviceId  = req.query.serviceId as string
          const vehicleType = req.query.vehicleType as string

          if(!providerId || !serviceId || !vehicleType){
            res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"please provide the data"})
             return 
          }

          const data = {providerId, serviceId, vehicleType}

          const response = await this.providerAddServiceInteractor.removeServiceUseCase(data);
          if(!response.success){
            res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message});
            return
          }

          res.status(HttpStatus.OK).json({success:response.success, message:response.message})

      
     } catch (error) {
        console.log("Error in removeService: ",error);
        next(error)
      
     }
}




}

export default ProviderAddServiceController


import { NextFunction, Request, Response } from "express";
import IAdminServiceInteractor, { ISubserviceData } from "../../../entities/iInteractor/iAdminService";

class AdminServiceController {
    constructor(
        private readonly AdminServiceInteractor: IAdminServiceInteractor
    ) {}

    async addServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const {category, serviceType} = req.body
            const data = {category, serviceType}
            const file = req.file?.buffer; 
            if (!file) {
                res.status(400).json({ success: false, message: "File not found" });
                return;
            }
            const response = await this.AdminServiceInteractor.addServiceUseCase(file,data); 

            if(!response.success){
              res.status(400).json({success:response.success, message:response.message})
              return
            }

            
            res.status(200).json({ success: true, service:response.service });
        } catch (error) {
            next(error); 
        }
    }

  async addBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const { brand } = req.body;
      
      const response = await this.AdminServiceInteractor.addBrandUseCase(brand);

      if (!response.success) {

         res.status(400).json({ success: false, message: response.message });
         return 
      }

      res.status(201).json({ success: true, message: "Created Successfully!!" , brand:response.brand});

    } catch (error) {
      next(error);
    }
  }

  async addVehicleTypes(req: Request, res: Response, next: NextFunction) {
    try {
      
        const { vehicleType } = req.body;

        const response = await this.AdminServiceInteractor.addVehicleTypeUseCase(vehicleType);

       
        if (!response.success) {
             res.status(400).json({ success: false, message: response.message });
             return 
        }
        
        res.status(201).json({ success: true, message: "Created successfully!!" });


    } catch (error) {
       
        next(error);
    }
}


  async getAllBrands(req: Request, res: Response, next: NextFunction) {

    try {
       console.log("This is the object://////////////////// ", req)

      const response = await this.AdminServiceInteractor.getAllBrandUseCase();

      if (!response.success) {
        res.status(400).json({ success: false, message: response.message })
        return
      }

      res.status(200).json({ success: true, brand: response.brands })

    } catch (error) {
      next(error)

    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query
      if (!id || typeof id !== "string") {
        res.status(400).json({ success: false, message: "Invalid or Missing ID" })
        return
      }
      const response = await this.AdminServiceInteractor.deleteBrandUseCase(id);

      if (!response.success) {
        res.status(400).json({ success: false, message: response.message })
        return
      }
      res.status(200).json({ success: true, message: "Successfully deleted" })


    } catch (error) {
      console.log(error)
      next(error)

    }
  }

  async getAllGeneralService(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("Entered in to getAllGeneralService");

        const response = await this.AdminServiceInteractor.getAllGeneralServiceUseCase();

        if (!response.success) {
             res.status(400).json({ success: false, message: response.message });
             return
        }

         res.status(200).json({ success: true, services: response.services });

    } catch (error) {
        next(error); 
    }
}


async getAllRoadServices(req: Request, res: Response, next: NextFunction) {
  try {
      const response = await this.AdminServiceInteractor.getAllRoadServiceUseCase();

      if (!response.success) {
           res.status(400).json({ success: false, message: response.message });
           return
      }

       res.status(200).json({ success: true, services: response.services });

  } catch (error) {
      next(error); 
  }
}

async deleteService(req: Request, res: Response, next: NextFunction) {
  try {

      const { id } = req.query;

      if (!id || typeof id !== 'string') {
           res.status(400).json({ success: false, message: "ID is not found!" }); 
           return
      }

      const response = await this.AdminServiceInteractor.deleteServiceUseCase(id);

      if (!response.success) {
           res.status(400).json({ success: false, message: response.message });
           return
      }

       res.status(200).json({ success: true, message: response.message });

  } catch (error) {
      next(error);
  }
}

async addSubServices(req: Request, res: Response, next: NextFunction) {
  try {
    
    const { id, subService } = req.body;

    
    if (!id || !subService) {
       res.status(400).json({ success: false, message: "ID and subService are required" });
       return
    }

    
    const data: ISubserviceData = { id, subService };

    
    const response = await this.AdminServiceInteractor.addSubServiceUseCase(data);

    
    if (!response.success) {
       res.status(400).json({ success: false, message: response.message });
       return
    }

    
     res.status(200).json({ success: true, message: response.message, subService:response.subService });

  } catch (error) {
    
    next(error);
  }
}



 

  
}

export default AdminServiceController;

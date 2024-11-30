import { NextFunction, Request, Response } from "express";
import { IProviderBookingsInteractor } from "../../../entities/iInteractor/provider/iBookings";
import HttpStatus from "../../../entities/rules/statusCodes";





class ProviderBookingsController {

  constructor(private readonly providerBookingsInteractor: IProviderBookingsInteractor) { }


  async addSlot(req: Request, res: Response, next: NextFunction) {

    try {

      const { providerId, startingDate, endingDate, count } = req.body

      if (!providerId || !startingDate || !count) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Please provide necessary data" })
      }
     
      const data = { providerId, startingDate, endingDate, count }

      console.log("This is data: ", data);

      const response = await this.providerBookingsInteractor.addSlotUseCase(data);

      if (!response.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: response.success, message: response.message })
        return
      }
      res.status(HttpStatus.CREATED).json({ success: response.success, message: response.message, slotData: response.slotData })


    } catch (error) {
      console.log("Error in addSlot Controller: ", error)
      next(error)

    }
  }


  async getAllSlot(req: Request, res: Response, next: NextFunction) {
    try {

      const providerId = req.query.providerId as string;
      if (!providerId) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Please provider providerId" })
      }

      const response = await this.providerBookingsInteractor.getAllSlotUseCase(providerId);
      console.log("This is the getAll slotResponse: ", response)
      if (!response.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: response.success, message: response.message });
        return
      }
      res.status(HttpStatus.OK).json({ success: response.success, message: response.message, slotData: response.slotData })


    } catch (error) {
      console.log("Error in getAllSlot: ", error)

    }
  }


  async updateSlotCount(req:Request, res:Response, next:NextFunction){
     try {
        const {slotId, state} = req.body

        if(!slotId || !state){
           res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide necessary details"})
        }

        const response = await this.providerBookingsInteractor.updateSlotCountUseCase(slotId, state);
        
        if(!response.success){
          res.status(HttpStatus.BAD_REQUEST).json({success:false, message:response.message})
        }

         res.status(HttpStatus.OK).json({success:response.success, message:response.message})

      
     } catch (error) {
         console.log("Error in updateSlotCountController: ",error)
         next(error)
     }
  }

  async removeSlot(req:Request, res:Response, next:NextFunction){
         try {

          const slotId = req.query.slotId as string

          if(!slotId){
            res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide slotId"})
          }

            const response = await this.providerBookingsInteractor.removeSlotUseCase(slotId);

            if(!response.success){
               res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
            }

               res.status(HttpStatus.OK).json({success:response.success, message:response.message})

          
         } catch (error) {
             console.log("Error in removeSlot: ", error);
             next(error)
          
         }
  }

  async getAllBookings(req:Request, res:Response, next:NextFunction){
      try {
            const providerId = req.query.providerId as string

            if(!providerId){
              res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide Id"})
              return
            }

            const response = await this.providerBookingsInteractor.getAllBookingsUseCase(providerId);
            console.log("This si reh resposne: ", response)

            if(!response.success){
               res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
               return
            }

              res.status(HttpStatus.OK).json({success:response.success, bookingData:response.bookingData })

        
      } catch (error) {
          console.log("Error in getAllBookingsController: ", error);
          next(error);
        
      }
  }

  async changeBookingStatus(req:Request, res:Response, next:NextFunction){
       try {
            const bookingId = req.body?.bookingId;
            const status = req.body?.status;

            if(!bookingId || !status){
                res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide the necessary data"});
                return 
            }

            const response = await this.providerBookingsInteractor.changeBookingStatusUseCase(bookingId, status);

            if(!response.success){
              res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
              return
            }

            res.status(HttpStatus.OK).json({success:response.success, message:response.message})

             
        
       } catch (error) {
           console.log("Error in changeBookingStatus: ", error);
           next(error)
        
       }
  }

  

  


}

export default ProviderBookingsController
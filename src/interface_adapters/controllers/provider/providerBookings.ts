import { NextFunction, Request, Response } from "express";
import { IProviderBookingsInteractor } from "../../../entities/iInteractor/provider/iBookings";
import HttpStatus from "../../../entities/rules/statusCodes";





class ProviderBookingsController {

  constructor(private readonly providerBookingsInteractor: IProviderBookingsInteractor) { }


  async addSlot(req: Request, res: Response, next: NextFunction) {

    try {

      const { providerId, startingDate, endingDate, count } = req.body

      if (!providerId || !startingDate || !endingDate || !count) {
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

      if (!response.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: response.success, message: response.message });
        return
      }
      res.status(HttpStatus.OK).json({ success: response.success, message: response.message, slotData: response.slotData })


    } catch (error) {
      console.log("Error in getAllSlot: ", error)

    }
  }
  

}

export default ProviderBookingsController
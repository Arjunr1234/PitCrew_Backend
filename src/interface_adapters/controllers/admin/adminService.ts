import { NextFunction, Request, Response } from "express";
import IAdminServiceInteractor from "../../../entities/iInteractor/iAdminService";

class AdminServiceController {
    constructor(
        private readonly AdminServiceInteractor: IAdminServiceInteractor
    ) {}

    async addServices(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("Entered into the addServices");
            const {category, serviceType} = req.body
            const data = {category, serviceType}
            const file = req.file?.buffer; 
            if (!file) {
                res.status(400).json({ success: false, message: "File not found" });
                return;
            }
            const response = await this.AdminServiceInteractor.addServiceUseCase(file,data); 
            
            console.log("This is the response: ", response);
            res.status(200).json({ success: true, imageUrl: response });
        } catch (error) {
            next(error); 
        }
    }
}

export default AdminServiceController;

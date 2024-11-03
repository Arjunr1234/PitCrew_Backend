import { log } from "console";
import { NextFunction, Request, response, Response } from "express";
import IUserServiceInteractor from "../../../entities/user/iservices";
import HttpStatus from "../../../entities/rules/statusCodes";



class UserServiceController{
        constructor(private readonly userServiceInteractor:IUserServiceInteractor ){}



        async getAllServices(req:Request,res:Response, next:NextFunction){

            try {
               console.log("Entered into getAllservice controller ");
               const response = await this.userServiceInteractor.getAllServiceUseCase()

               if(!response.success){
                  res.status(HttpStatus.BAD_REQUEST).json({success:false, message:response.message})
               }

                 res.status(HttpStatus.OK).json({success:response.success, serviceData:response.serviceData})
              
            } catch (error) {
                console.log("Error in getAllserviceController: ",error);
                next(error)
                
              
            }

        }

        async getAllBrands(req:Request, res:Response, next:NextFunction){
               try {
                    const response = await this.userServiceInteractor.getAllBrandsUseCase();
                    if(!response.success){
                        res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message});
                        return
                    }
                      
                    res.status(HttpStatus.OK).json({success:response.success, brandData:response.brandData})
                
  
               } catch (error) {
                   console.log("Error in getAllBrands: ", error);
                   next(error)
                
               }
        }

        async findProviders(req:Request, res:Response, next:NextFunction){
            try {
                    console.log("This is the req.body fuck: ", req.body);

                    const {userId, role, ...newData} = req.body;

                    const response = await this.userServiceInteractor.findProvidersUseCase(newData);

                    if(!response.success){
                        res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message});
                        return
                    }
                     console.log("This is the final resonse: ", response.providersData)
                    res.status(HttpStatus.OK).json({success:response.success, providersData:response.providersData})


            } catch (error) {
                  console.log("Error in findProviders: ", error)

                
            }
        }
}

export default UserServiceController
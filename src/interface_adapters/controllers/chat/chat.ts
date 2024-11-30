import { NextFunction, Response, Request } from "express";
import { IChatInteractor } from "../../../entities/iInteractor/chat/chat";
import HttpStatus from "../../../entities/rules/statusCodes";


class ChatController{
   constructor (private readonly chatInteractor:IChatInteractor){}
   
   async getAllChats(req:Request, res:Response, next:NextFunction){
     try {
          const userId = req.query?.userId as string;
          const providerId = req.query?.providerId as string 

          if(!userId || !providerId){
              res.status(HttpStatus.BAD_REQUEST).json({success:false, message:"Please provide the id"})
          }

          const response = await this.chatInteractor.getAllChatsUseCase(userId, providerId);

          if(!response.success){
             res.status(HttpStatus.BAD_REQUEST).json({success:response.success, message:response.message})
          }

            res.status(HttpStatus.OK).json({success:response.success, chatData:response.chatData})
      
     } catch (error) {
        console.log("Error in getAllChats: ", error);
        next(error)
      
     }
   }
}

export default ChatController
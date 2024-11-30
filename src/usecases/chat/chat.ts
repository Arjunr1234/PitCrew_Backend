import { response } from "express";
import { IChatInteractor } from "../../entities/iInteractor/chat/chat";
import IChatRepository from "../../entities/irepository/iChatRepository";
import { IMessageDetails, IChatData } from "../../entities/rules/chat";



class ChatInteractor implements IChatInteractor{
    constructor(private readonly ChatRepository:IChatRepository){}

    async createChatUseCase(messageDetails: IMessageDetails): Promise<{ success: boolean; chatData?: IChatData; }> {
         try {
              const response = await this.ChatRepository.createChatRepo(messageDetails);
              return response
          
         } catch (error) {
              console.log("Error in creaeChatUseCase: ", error)
              return {success:false}
         }
    }

    async getAllChatsUseCase(userId: string, providerId: string): Promise<{ success: boolean; message?: string; chatData?: any; }> {
        try {
              const response = await this.ChatRepository.getAllChatRepo(userId, providerId);
              return response
          
        } catch (error) {
            console.log("Error in getAllChatUseCase: ", error);
            return {success:false, message:"Something went wrong in getAllChatUseCase "}
          
        }
    }
  
}

export default ChatInteractor
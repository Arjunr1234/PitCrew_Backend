import IChatRepository from "../../entities/irepository/iChatRepository";
import { IMessageDetails, IChatData } from "../../entities/rules/chat";
import ChatModel from "../../framework/mongoose/model/chatSchema";




class ChatRepository implements IChatRepository{

  async createChatRepo(
    messageDetails: IMessageDetails
  ): Promise<{ success: boolean; chatData?: IChatData }> {
    try {
      
      const query =
        messageDetails.sender === "provider"
          ? {
              providerId: messageDetails.senderId,
              userId: messageDetails.receiverId,
            }
          : {
              providerId: messageDetails.receiverId,
              userId: messageDetails.senderId,
            };
  
      const message = {
        sender:messageDetails.sender,
        message:messageDetails.message,
        type:"text"
      }
      
      const existingChat = await ChatModel.findOneAndUpdate(
        query,
        {
          $push: {
            messages: message
          },
        },
        { new: true, upsert: true }
      );
  
      return { success: true, chatData: existingChat };
    } catch (error) {
      console.error("Error in createChatRepo:", error);
      return { success: false };
    }
  }

  async getAllChatRepo(userId: string, providerId: string): Promise<{ success: boolean; message?: string; chatData?: any; }> {
      try {
           const findedChats = await ChatModel.findOne({providerId:providerId, userId:userId}).select("messages")

           if(!findedChats){
              return {success:false, message:"Failed to get chat message"}
           }

           return{success:true, chatData:findedChats}
        
      } catch (error) {
          console.log("Error in getAllChatRepo: ", error);
          return {success:false, message:"Something went wrong in getAllChatRepo "}
        
      }
  }
  
}

export default ChatRepository
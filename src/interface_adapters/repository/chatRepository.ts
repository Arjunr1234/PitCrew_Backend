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
  
      
      const existingChat = await ChatModel.findOneAndUpdate(
        query,
        {
          $push: {
            message: {
              sender: messageDetails.sender,
              message: messageDetails.message,
              type: "text",
            },
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
  
}

export default ChatRepository
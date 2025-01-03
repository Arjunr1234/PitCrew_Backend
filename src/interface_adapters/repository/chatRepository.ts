import mongoose from "mongoose";
import IChatRepository from "../../entities/irepository/iChatRepository";
import { IMessageDetails, IChatData } from "../../entities/rules/chat";
import ChatModel from "../../framework/mongoose/model/chatSchema";
import notificationModel from "../../framework/mongoose/model/notificationSchema";
import providerModel from "../../framework/mongoose/model/providerSchema";
import userModel from "../../framework/mongoose/model/userSchema";




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
  
      return { success: true, chatData: existingChat,  };
    } catch (error) {
      console.error("Error in createChatRepo:", error);
      return { success: false };
    }
  }

  async getAllChatRepo(userId: string, providerId: string): Promise<{ success: boolean; message?: string; chatData?: any; }> {
      try {
           const findedChats = await ChatModel.findOne({providerId:providerId, userId:userId})

           if(!findedChats){
              return {success:false, message:"Failed to get chat message"}
           }

           return{success:true, chatData:findedChats} 
        
      } catch (error) {
          console.log("Error in getAllChatRepo: ", error);
          return {success:false, message:"Something went wrong in getAllChatRepo "}
        
      }
  }

  async createNotificationRepo(messageDetails: any): Promise<{ success: boolean; message?: string; notification?:any }> {
      try {

        
          console.log("This is the sended messsssssssssssssssssssssssssssssssage: ", messageDetails)
          const   {senderId, receiverId, bookingId, name, message, sender} = messageDetails
          let notificaionMessage
          if(sender === 'user'){
              
               notificaionMessage = `You got a new message from ${name}`

          }else if(sender === 'provider'){
              
               notificaionMessage = `You got a new message from ${name}`
          }

            const notificationContent = {
                content:notificaionMessage,
                type:'message',
                read:false,
                bookingId
            }

           

            const notification = await notificationModel.findOneAndUpdate(
              { receiverId: new mongoose.Types.ObjectId(receiverId) },
              { $push: { notifications: notificationContent } },
              { new: true, upsert: true } 
            );
            
            if (!notification) {
              return { success: false, message: "Failed to create notification" };
            }
            
            return { success: true, message: "Notification updated successfully", notification:notificationContent };
            
          
             
      } catch (error) {
          console.log("Error in createNotification: ", error)
          return {success:false, message:"Something went wrong in createNotificationRepo"}
      }
  }
  
}

export default ChatRepository
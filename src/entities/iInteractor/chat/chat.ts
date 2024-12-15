import { IChatData, IMessageDetails } from "../../rules/chat";



export interface IChatInteractor{

  createChatUseCase(messageDetails:IMessageDetails):Promise<{success:boolean, chatData?:IChatData}>
  getAllChatsUseCase(userId:string, providerId:string):Promise<{success:boolean, message?:string, chatData?:any}>
  createNotificationUseCase(messageDetails:any):Promise<{success:boolean, message?:string, notification?:any}>
}
import { IChatData, IMessageDetails } from "../../rules/chat";



export interface IChatInteractor{

  createChatUseCase(messageDetails:IMessageDetails):Promise<{success:boolean, chatData?:IChatData}>
}
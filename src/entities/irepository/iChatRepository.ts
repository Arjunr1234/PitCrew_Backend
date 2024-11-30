import { IChatData, IMessageDetails } from "../rules/chat"





interface IChatRepository{
    createChatRepo(messageDetails:IMessageDetails):Promise<{success:boolean, chatData?:IChatData}>
    getAllChatRepo(userId:string, providerId:string):Promise<{success:boolean, message?:string, chatData?:any}>
}

export default IChatRepository
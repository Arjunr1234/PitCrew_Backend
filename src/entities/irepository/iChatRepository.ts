import { IChatData, IMessageDetails } from "../rules/chat"





interface IChatRepository{
    createChatRepo(messageDetails:IMessageDetails):Promise<{success:boolean, chatData?:IChatData}>
}

export default IChatRepository
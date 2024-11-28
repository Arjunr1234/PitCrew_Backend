import {Server as SocketServer} from 'socket.io';
import {Server as HttpServer} from 'http';
import ChatRepository from '../../interface_adapters/repository/chatRepository';
import ChatInteractor from '../../usecases/chat/chat';


const chatRepositoryinstance = new ChatRepository();
const chatInteractorInstance = new ChatInteractor(chatRepositoryinstance);

let io:SocketServer;
const onlineUser : {[key:string]: string} = {};

const userSocketMap : {[key:string]: string} = {};

export const getReceiverSocketId = (userId:string) => {
   return userSocketMap[userId]
}


const configSocketIO = (server:HttpServer) => {
    try {

      io = new SocketServer(server, {
        cors:{
          origin:["http://localhost:5173"]
        }
      });


      io.on("connection", (socket) => {
           const userId = socket.handshake.query.userId;

           if(userId !== undefined){
             userSocketMap[userId as string] = socket.id;
             onlineUser[userId as string] = socket.id
           }

           socket.on("joinChatRoom", ({providerId, userId, online}) => {
                 const roomName = [providerId, userId].sort().join("-");
                 if(online === 'USER'){
                    socket.join(roomName);
                    if(onlineUser[providerId]){
                       io.emit("receiverIsOnline", {user_id: providerId})
                    }else{
                       io.emit("receiverIsOffline", {user_id: providerId})
                    }
                 }
                 if(online === 'PROVIDER'){
                  socket.join(roomName);
                  if(onlineUser[userId]){
                    io.emit("receiverIsOnline", {user_id:userId})
                  }else{
                    io.emit("receiverIsOffline", {user_id:userId})
                  }
               }
                 
           });

           socket.on("sendMessages", async ({messageDetails}) => {
               try {

                  let savedMessage: any  = null;

                  const connectionDetails:any  = await chatInteractorInstance.createChatUseCase(messageDetails);

                  savedMessage = connectionDetails.chatData;

                  let chatRoom : string;

                  if(messageDetails.sender === "provider"){
                      chatRoom = [messageDetails.senderId, messageDetails.receiverId].sort().join("-")
                  }
                  else if(messageDetails.sender === "user"){
                      chatRoom = [messageDetails.receiverId,  messageDetails.senderId].sort().join("-")
                  }
                  else{
                     return
                  }

                  io.to(chatRoom).emit("receiveMessage", savedMessage)
                
               } catch (error) {
                console.error("Error in sendMessage handler:", error);
                
               }
           })
      })


      
    } catch (error) {

      
    }
}

export {configSocketIO}
import {Server as SocketServer} from 'socket.io';
import {Server as HttpServer} from 'http';
import ChatRepository from '../../interface_adapters/repository/chatRepository';
import ChatInteractor from '../../usecases/chat/chat';


const chatRepositoryinstance = new ChatRepository();
const chatInteractorInstance = new ChatInteractor(chatRepositoryinstance);

let io:SocketServer;
const onlineUser : {[key:string]: string, } = {};

const userSocketMap : {[key:string]: string, } = {};

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
           console.log("a connection is established")
           const userId = socket.handshake.query.userId;
           console.log("This is the userId: {provider/user}: ", userId)
           if(userId !== undefined){
             userSocketMap[userId as string] = socket.id;
             onlineUser[userId as string] = socket.id
           }

           io.emit("listOnlineUsers", onlineUser)

           socket.on("joinChatRoom", ({providerId, userId, online}) => {
            console.log("Enteed into join chat room: ", providerId, userId, online)
                 const roomName = [providerId, userId].sort().join("-");
                 socket.join(roomName)

                 if (online === "USER") {
                  console.log("online Users (user): ", onlineUser)
                  const isProviderOnline = !!onlineUser[providerId];
                  io.to(roomName).emit(isProviderOnline ? "receiverIsOnline" : "receiverIsOffline", {
                    user_id: providerId,
                  });
                }

                if (online === "PROVIDER") {
                  console.log("online Users (provider): ", onlineUser)
                  const isUserOnline = !!onlineUser[userId];
                  io.to(roomName).emit(isUserOnline ? "receiverIsOnline" : "receiverIsOffline", {
                    user_id: userId,
                  });
                }
               
             });

          //  socket.on("typing", ({userId, providerId, isTyping, typer}) => {
          //      console.log("This is the status; ", isTyping)
          //      const roomName = [providerId, userId].sort().join("-");
          //      if(typer === 'PROVIDER'){
          //       io.to(roomName).emit("typing", {isTyping,  typer})
          //      }
          //      if(typer === 'USER'){
          //       io.to(roomName).emit("typing", {isTyping,  typer})
          //      }
              
          //  })  
          socket.on("typing", ({ userId, providerId, isTyping, typer }) => {
            console.log("This is the status: ", isTyping);
          
            
            const roomName = [providerId, userId].sort().join("-");
          
            
            io.to(roomName).emit("typing", { isTyping, typer });
          });
          

           socket.on("sendMessage", async ({messageDetails}) => {
               try {
                  console.log("This si the messge: ", messageDetails)
                  let savedMessage: any  = null;

                  const connectionDetails:any  = await chatInteractorInstance.createChatUseCase(messageDetails);


                  savedMessage = connectionDetails.chatData;
                  
                 // console.log("This is connectionDetails  ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;: ", connectionDetails);

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
           });

           socket.on("disconnect", () => {
            const disconnectedUserId = Object.keys(userSocketMap).find(
              (key) => userSocketMap[key] === socket.id
            );
            if (disconnectedUserId) {
              delete userSocketMap[disconnectedUserId];
              delete onlineUser[disconnectedUserId];
    
              // Notify all clients that this user is offline
              io.emit("userOffline", { userId: disconnectedUserId });
              console.log(`${disconnectedUserId} disconnected, remaining online users:`, onlineUser);
            }
           })
      })
    } catch (error) {

      console.log("Error in configSocketIO ", error)
    }
}

export {configSocketIO}
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

                   const chatNotification = await chatInteractorInstance.createNotificationUseCase(messageDetails)
                   const userSocketId = getReceiverSocketId(messageDetails.receiverId)
                  io.to(chatRoom).emit("receiveMessage", savedMessage);
                  console.log("This is userSocketId: ", userSocketId);
                  console.log("This is chatNotificatioN: ", chatNotification.notification)
                  io.to(userSocketId).emit("receiveNotification", chatNotification.notification)
                
               } catch (error) {
                  console.error("Error in sendMessage handler:", error);
                
               }
           });


           socket.on("checkPersonIsOnline", async ({ userId, providerId, caller }) => {
          //  console.log("Checking if person is online: ", { userId, providerId, caller });
        
            
            let callerId = caller === 'user' ? userId : providerId;
            let receiverId = caller === 'user' ? providerId : userId;
        
            
            let socketId = getReceiverSocketId(callerId);
        
            
            let onlineStatus = !!onlineUser[receiverId];
        
           // console.log("callerId: ", callerId, "receiverId: ", receiverId);
        
            if (!socketId) {
                console.error("No valid socket ID found for caller!");
                return; 
            }
        
            
            io.to(socketId).emit("isPersonIsOnline", { success: onlineStatus });
        });

        socket.on("createRoomForCall", ({userId, providerId, caller, callerData}) => {
              console.log("userId: ",userId, "providerId: ", providerId, "caller: ", caller)
              
              const callerId = caller === 'user' ? userId : providerId;
              const receiverId = caller === 'user' ? providerId : userId;
              const roomId = [receiverId, callerId].sort().join('_');
              socket.join(roomId + "");
              console.log("Emitted to: ", receiverId)
              io.to(getReceiverSocketId(receiverId)).emit('incommingCall', {success:true, receiverId, callerId, callerData });
        })

        socket.on("rejectCall", ({ callerId, receiverId}) => {
               io.to(getReceiverSocketId(callerId)).emit("callRejected", {callerId, receiverId})
        });


        socket.on("callAccepted", ({success, callerId, receiverId, caller})=> {
          const roomId = [receiverId, callerId].sort().join('_');
          socket.join(roomId + "");
          io.to(getReceiverSocketId(callerId)).emit("callAccepted", {success, callerId, receiverId, caller})

        });

        socket.on("sendOffer", ({receiverId, offer, callerId}) => {
           console.log("Entered into sendeOffer to receiver socket offer: ", offer)
           io.to(getReceiverSocketId(receiverId)).emit("sendOfferToReceiver", {offer, callerId})
        });

        socket.on("answer", ({answer, to}) => {
          console.log('This is the answer to the caller: ', answer);
          io.to(getReceiverSocketId(to)).emit("receiveAnswer", {answer})
        });

        socket.on("sendCandidate", ({event, id, sender }) => {
           console.log("signaling;  sendIcecandidate: ", event);
           console.log("This is the sender: ", sender);
           
           console.log("This is thhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh fucking callerId: ", id)
           io.to(getReceiverSocketId(id)).emit("receiveCandidate", {event})
        })
        

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

const sendBookingNotification = (providerId:string, notification:any) => {
       console.log("This is sendBookingNOtification: ", providerId, notification);
       const userSocketId = getReceiverSocketId(providerId);
       io.to(userSocketId).emit("receiveNotification", notification)
}

export {configSocketIO, sendBookingNotification}
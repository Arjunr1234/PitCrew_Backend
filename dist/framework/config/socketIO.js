"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingNotification = exports.configSocketIO = exports.getReceiverSocketId = void 0;
const socket_io_1 = require("socket.io");
const chatRepository_1 = __importDefault(require("../../interface_adapters/repository/chatRepository"));
const chat_1 = __importDefault(require("../../usecases/chat/chat"));
const chatRepositoryinstance = new chatRepository_1.default();
const chatInteractorInstance = new chat_1.default(chatRepositoryinstance);
let io;
const onlineUser = {};
const userSocketMap = {};
const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};
exports.getReceiverSocketId = getReceiverSocketId;
const configSocketIO = (server) => {
    try {
        // io = new SocketServer(server, {
        //   cors:{
        //     origin:["http://localhost:5173"]
        //   }
        // });
        io = new socket_io_1.Server(server, {
            cors: {
                origin: ["http://localhost:5173"]
            }
        });
        io.on("connection", (socket) => {
            console.log("a connection is established");
            const userId = socket.handshake.query.userId;
            // console.log("This is the userId: {provider/user}: ", userId)
            if (userId !== undefined) {
                userSocketMap[userId] = socket.id;
                onlineUser[userId] = socket.id;
            }
            io.emit("listOnlineUsers", onlineUser);
            socket.on("joinChatRoom", ({ providerId, userId, online }) => {
                const roomName = [providerId, userId].sort().join("-");
                socket.join(roomName);
                if (online === "USER") {
                    const isProviderOnline = !!onlineUser[providerId];
                    io.to(roomName).emit(isProviderOnline ? "receiverIsOnline" : "receiverIsOffline", {
                        user_id: providerId,
                    });
                }
                if (online === "PROVIDER") {
                    const isUserOnline = !!onlineUser[userId];
                    io.to(roomName).emit(isUserOnline ? "receiverIsOnline" : "receiverIsOffline", {
                        user_id: userId,
                    });
                }
            });
            socket.on("typing", ({ userId, providerId, isTyping, typer }) => {
                const roomName = [providerId, userId].sort().join("-");
                io.to(roomName).emit("typing", { isTyping, typer });
            });
            socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ messageDetails }) {
                try {
                    let savedMessage = null;
                    const connectionDetails = yield chatInteractorInstance.createChatUseCase(messageDetails);
                    savedMessage = connectionDetails.chatData;
                    let chatRoom;
                    if (messageDetails.sender === "provider") {
                        chatRoom = [messageDetails.senderId, messageDetails.receiverId].sort().join("-");
                    }
                    else if (messageDetails.sender === "user") {
                        chatRoom = [messageDetails.receiverId, messageDetails.senderId].sort().join("-");
                    }
                    else {
                        return;
                    }
                    const chatNotification = yield chatInteractorInstance.createNotificationUseCase(messageDetails);
                    const userSocketId = (0, exports.getReceiverSocketId)(messageDetails.receiverId);
                    io.to(chatRoom).emit("receiveMessage", savedMessage);
                    io.to(userSocketId).emit("receiveNotification", chatNotification.notification);
                }
                catch (error) {
                    console.error("Error in sendMessage handler:", error);
                }
            }));
            socket.on("checkPersonIsOnline", (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, providerId, caller }) {
                let callerId = caller === 'user' ? userId : providerId;
                let receiverId = caller === 'user' ? providerId : userId;
                let socketId = (0, exports.getReceiverSocketId)(callerId);
                let onlineStatus = !!onlineUser[receiverId];
                if (!socketId) {
                    console.error("No valid socket ID found for caller!");
                    return;
                }
                io.to(socketId).emit("isPersonIsOnline", { success: onlineStatus });
            }));
            socket.on("createRoomForCall", ({ userId, providerId, caller, callerData }) => {
                const callerId = caller === 'user' ? userId : providerId;
                const receiverId = caller === 'user' ? providerId : userId;
                const roomId = [receiverId, callerId].sort().join('_');
                socket.join(roomId + "");
                io.to((0, exports.getReceiverSocketId)(receiverId)).emit('incommingCall', { success: true, receiverId, callerId, callerData });
            });
            socket.on("rejectCall", ({ callerId, receiverId }) => {
                io.to((0, exports.getReceiverSocketId)(callerId)).emit("callRejected", { callerId, receiverId });
            });
            socket.on("callAccepted", ({ success, callerId, receiverId, caller }) => {
                const roomId = [receiverId, callerId].sort().join('_');
                socket.join(roomId + "");
                io.to((0, exports.getReceiverSocketId)(callerId)).emit("callAccepted", { success, callerId, receiverId, caller });
            });
            socket.on("sendOffer", ({ receiverId, offer, callerId }) => {
                io.to((0, exports.getReceiverSocketId)(receiverId)).emit("sendOfferToReceiver", { offer, callerId });
            });
            socket.on("answer", ({ answer, to }) => {
                io.to((0, exports.getReceiverSocketId)(to)).emit("receiveAnswer", { answer });
            });
            socket.on("sendCandidate", ({ event, id, sender }) => {
                io.to((0, exports.getReceiverSocketId)(id)).emit("receiveCandidate", { event });
            });
            socket.on("callEnded", ({ to }) => {
                io.to((0, exports.getReceiverSocketId)(to)).emit("receivingCallEnded");
            });
            socket.on("disconnect", () => {
                const disconnectedUserId = Object.keys(userSocketMap).find((key) => userSocketMap[key] === socket.id);
                if (disconnectedUserId) {
                    delete userSocketMap[disconnectedUserId];
                    delete onlineUser[disconnectedUserId];
                    // Notify all clients that this user is offline
                    io.emit("userOffline", { userId: disconnectedUserId });
                    console.log(`${disconnectedUserId} disconnected, remaining online users:`, onlineUser);
                }
            });
        });
    }
    catch (error) {
        console.log("Error in configSocketIO ", error);
    }
};
exports.configSocketIO = configSocketIO;
const sendBookingNotification = (providerId, notification) => {
    console.log("This is sendBookingNOtification: ", providerId, notification);
    const userSocketId = (0, exports.getReceiverSocketId)(providerId);
    io.to(userSocketId).emit("receiveNotification", notification);
};
exports.sendBookingNotification = sendBookingNotification;

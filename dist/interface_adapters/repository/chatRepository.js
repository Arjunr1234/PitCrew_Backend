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
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema_1 = __importDefault(require("../../framework/mongoose/model/chatSchema"));
const notificationSchema_1 = __importDefault(require("../../framework/mongoose/model/notificationSchema"));
class ChatRepository {
    createChatRepo(messageDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = messageDetails.sender === "provider"
                    ? {
                        providerId: messageDetails.senderId,
                        userId: messageDetails.receiverId,
                    }
                    : {
                        providerId: messageDetails.receiverId,
                        userId: messageDetails.senderId,
                    };
                const message = {
                    sender: messageDetails.sender,
                    message: messageDetails.message,
                    type: "text"
                };
                const existingChat = yield chatSchema_1.default.findOneAndUpdate(query, {
                    $push: {
                        messages: message
                    },
                }, { new: true, upsert: true });
                return { success: true, chatData: existingChat, };
            }
            catch (error) {
                console.error("Error in createChatRepo:", error);
                return { success: false };
            }
        });
    }
    getAllChatRepo(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findedChats = yield chatSchema_1.default.findOne({ providerId: providerId, userId: userId });
                if (!findedChats) {
                    return { success: false, message: "Failed to get chat message" };
                }
                return { success: true, chatData: findedChats };
            }
            catch (error) {
                console.log("Error in getAllChatRepo: ", error);
                return { success: false, message: "Something went wrong in getAllChatRepo " };
            }
        });
    }
    createNotificationRepo(messageDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("This is the sended messsssssssssssssssssssssssssssssssage: ", messageDetails);
                const { senderId, receiverId, bookingId, name, message, sender } = messageDetails;
                let notificaionMessage;
                if (sender === 'user') {
                    notificaionMessage = `You got a new message from ${name}`;
                }
                else if (sender === 'provider') {
                    notificaionMessage = `You got a new message from ${name}`;
                }
                const notificationContent = {
                    content: notificaionMessage,
                    type: 'message',
                    read: false,
                    bookingId
                };
                const notification = yield notificationSchema_1.default.findOneAndUpdate({ receiverId: new mongoose_1.default.Types.ObjectId(receiverId) }, { $push: { notifications: notificationContent } }, { new: true, upsert: true });
                if (!notification) {
                    return { success: false, message: "Failed to create notification" };
                }
                return { success: true, message: "Notification updated successfully", notification: notificationContent };
            }
            catch (error) {
                console.log("Error in createNotification: ", error);
                return { success: false, message: "Something went wrong in createNotificationRepo" };
            }
        });
    }
}
exports.default = ChatRepository;

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
Object.defineProperty(exports, "__esModule", { value: true });
class ChatInteractor {
    constructor(ChatRepository) {
        this.ChatRepository = ChatRepository;
    }
    createChatUseCase(messageDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.ChatRepository.createChatRepo(messageDetails);
                return response;
            }
            catch (error) {
                console.log("Error in creaeChatUseCase: ", error);
                return { success: false };
            }
        });
    }
    getAllChatsUseCase(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.ChatRepository.getAllChatRepo(userId, providerId);
                return response;
            }
            catch (error) {
                console.log("Error in getAllChatUseCase: ", error);
                return { success: false, message: "Something went wrong in getAllChatUseCase " };
            }
        });
    }
    createNotificationUseCase(messageDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.ChatRepository.createNotificationRepo(messageDetails);
                return response;
            }
            catch (error) {
                console.log("Error in createNotification: ", error);
                return { success: false, message: "Something went wrong in createNoticationUseCase" };
            }
        });
    }
}
exports.default = ChatInteractor;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatRepository_1 = __importDefault(require("../../../interface_adapters/repository/chatRepository"));
const chat_1 = __importDefault(require("../../../usecases/chat/chat"));
const chat_2 = __importDefault(require("../../../interface_adapters/controllers/chat/chat"));
const chatRouter = express_1.default.Router();
const repository = new chatRepository_1.default();
const interactor = new chat_1.default(repository);
const controller = new chat_2.default(interactor);
chatRouter.get('/get-all-chats', controller.getAllChats.bind(controller));
exports.default = chatRouter;

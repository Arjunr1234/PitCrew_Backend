import express from 'express';
import ChatRepository from '../../../interface_adapters/repository/chatRepository';
import ChatInteractor from '../../../usecases/chat/chat';
import ChatController from '../../../interface_adapters/controllers/chat/chat';

const chatRouter = express.Router();


const repository = new ChatRepository();
const interactor = new ChatInteractor(repository);
const controller = new ChatController(interactor);






export default chatRouter
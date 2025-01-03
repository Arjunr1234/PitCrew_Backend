"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mailer_1 = __importDefault(require("../../../service/mailer"));
const providerRepository_1 = __importDefault(require("../../../../interface_adapters/repository/providerRepository"));
const auth_1 = __importDefault(require("../../../../usecases/provider/auth"));
const providerAuth_1 = __importDefault(require("../../../../interface_adapters/controllers/provider/providerAuth"));
const jwt_1 = __importDefault(require("../../../service/jwt"));
const providerAuthRouter = express_1.default.Router();
const repository = new providerRepository_1.default();
const mailer = new mailer_1.default();
const jwt = new jwt_1.default(process.env.ACCESS_TOKEN_KEY, process.env.REFRESH_TOKEN_KEY);
const providerAuthInteractor = new auth_1.default(repository, mailer, jwt);
const controller = new providerAuth_1.default(providerAuthInteractor);
//=============== routes ===========================//
providerAuthRouter.post('/otp-send', controller.sendOtp.bind(controller));
providerAuthRouter.post('/verify-otp', controller.verifyOtp.bind(controller));
providerAuthRouter.post('/create-provider', controller.createProvider.bind(controller));
providerAuthRouter.post('/login', controller.login.bind(controller));
providerAuthRouter.get('/logout', controller.logout.bind(controller));
exports.default = providerAuthRouter;

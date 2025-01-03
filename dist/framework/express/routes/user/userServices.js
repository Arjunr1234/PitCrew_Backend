"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userServices_1 = __importDefault(require("../../../../interface_adapters/controllers/user/userServices"));
const services_1 = __importDefault(require("../../../../usecases/user/services"));
const userRepository_1 = __importDefault(require("../../../../interface_adapters/repository/userRepository"));
const jwtAuthentication_1 = __importDefault(require("../../middleware/jwtAuthentication"));
const constants_1 = require("../../../../entities/rules/constants");
const userServiceRoute = express_1.default.Router();
const repository = new userRepository_1.default();
const interactor = new services_1.default(repository);
const controller = new userServices_1.default(interactor);
//=================  Routes  ==================//
userServiceRoute.get('/get-all-services', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.getAllServices.bind(controller));
userServiceRoute.get('/get-all-brands', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.getAllBrands.bind(controller));
userServiceRoute.post('/search-providers', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.findProviders.bind(controller));
userServiceRoute.post('/provider-serivce-view', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.providerServiceView.bind(controller));
exports.default = userServiceRoute;

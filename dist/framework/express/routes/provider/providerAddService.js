"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const providerRepository_1 = __importDefault(require("../../../../interface_adapters/repository/providerRepository"));
const addService_1 = __importDefault(require("../../../../usecases/provider/addService"));
const providerAddService_1 = __importDefault(require("../../../../interface_adapters/controllers/provider/providerAddService"));
const jwtAuthentication_1 = __importDefault(require("../../middleware/jwtAuthentication"));
const constants_1 = require("../../../../entities/rules/constants");
const providerAddServiceRouter = express_1.default.Router();
//=================   Dependency Injection  ============//
const repository = new providerRepository_1.default();
const interactor = new addService_1.default(repository);
const controller = new providerAddService_1.default(interactor);
//================   Routes  ===================//
providerAddServiceRouter.get('/get-all-provider-service', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.getAllProviderService.bind(controller));
providerAddServiceRouter.get('/get-all-brands', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.getAllBrands.bind(controller));
providerAddServiceRouter.patch('/remove-brand', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.removeBrand.bind(controller));
providerAddServiceRouter.patch('/edit-subtype', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.editSubtype.bind(controller));
providerAddServiceRouter.delete('/remove-subtype', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.removeSubType.bind(controller));
providerAddServiceRouter.delete('/remove-service', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.removeService.bind(controller));
providerAddServiceRouter.post('/add-brand', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.addBrand.bind(controller));
providerAddServiceRouter.post('/add-general-road-services', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.addGeneralOrRoadService.bind(controller));
providerAddServiceRouter.post('/add-subtype', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.addSubType.bind(controller));
exports.default = providerAddServiceRouter;

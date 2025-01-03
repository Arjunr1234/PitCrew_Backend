"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../../../../interface_adapters/repository/adminRepository"));
const adminProvider_1 = __importDefault(require("../../../../usecases/admin/adminProvider"));
const adminProvider_2 = __importDefault(require("../../../../interface_adapters/controllers/admin/adminProvider"));
const jwtAuthentication_1 = __importDefault(require("../../middleware/jwtAuthentication"));
const mailer_1 = __importDefault(require("../../../service/mailer"));
const constants_1 = require("../../../../entities/rules/constants");
const adminProviderRoute = express_1.default.Router();
const repository = new adminRepository_1.default();
const mailer = new mailer_1.default();
const interactor = new adminProvider_1.default(repository, mailer);
const controller = new adminProvider_2.default(interactor);
//================routes===============================//
adminProviderRoute.get('/get-pending-providers', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.getPendingProviders.bind(controller));
adminProviderRoute.get('/get-providers', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.getProviders.bind(controller));
adminProviderRoute.patch('/provider-accept-reject', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.providerAcceptOrReject.bind(controller));
adminProviderRoute.patch('/provider-block-unblock', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.providerBlockAndUnblock.bind(controller));
exports.default = adminProviderRoute;

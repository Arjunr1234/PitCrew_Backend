"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../../../../interface_adapters/repository/adminRepository"));
const adminUser_1 = __importDefault(require("../../../../usecases/admin/adminUser"));
const adminUser_2 = __importDefault(require("../../../../interface_adapters/controllers/admin/adminUser"));
const jwtAuthentication_1 = __importDefault(require("../../middleware/jwtAuthentication"));
const constants_1 = require("../../../../entities/rules/constants");
const adminUserRouter = express_1.default.Router();
const repository = new adminRepository_1.default();
const interactor = new adminUser_1.default(repository);
const controller = new adminUser_2.default(interactor);
//=============Routes=========================//
adminUserRouter.get('/get-user', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.getUser.bind(controller));
adminUserRouter.patch('/user-block-unblock', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.userBlockAndUnblock.bind(controller));
exports.default = adminUserRouter;

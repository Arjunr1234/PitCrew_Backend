"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthController_1 = __importDefault(require("../../../../interface_adapters/controllers/admin/adminAuthController"));
const auth_1 = __importDefault(require("../../../../usecases/admin/auth"));
const jwt_1 = __importDefault(require("../../../service/jwt"));
const adminRepository_1 = __importDefault(require("../../../../interface_adapters/repository/adminRepository"));
const adminAuthRouter = express_1.default.Router();
const repository = new adminRepository_1.default();
const jwt = new jwt_1.default(process.env.ACCESS_TOKEN_KEY, process.env.REFRESH_TOKEN_KEY);
const adminAuthInteractor = new auth_1.default(repository, jwt);
const controller = new adminAuthController_1.default(adminAuthInteractor);
// =================== routes ========================= //
adminAuthRouter.post('/login', controller.login.bind(controller));
adminAuthRouter.get('/logout', controller.logout.bind(controller));
//adminAuthRouter.get('/verify-token', controller.verifiedToken.bind(controller));
exports.default = adminAuthRouter;

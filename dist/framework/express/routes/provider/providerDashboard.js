"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const providerRepository_1 = __importDefault(require("../../../../interface_adapters/repository/providerRepository"));
const dashboard_1 = __importDefault(require("../../../../usecases/provider/dashboard"));
const providerDashboard_1 = __importDefault(require("../../../../interface_adapters/controllers/provider/providerDashboard"));
const providerDashBoardRoute = express_1.default.Router();
const respository = new providerRepository_1.default();
const interactor = new dashboard_1.default(respository);
const controller = new providerDashboard_1.default(interactor);
exports.default = providerDashBoardRoute;

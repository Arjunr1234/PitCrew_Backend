"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRouter_1 = __importDefault(require("./user/userRouter"));
const providerRoute_1 = __importDefault(require("./provider/providerRoute"));
const adminRoutes_1 = __importDefault(require("./admin/adminRoutes"));
const chatRoute_1 = __importDefault(require("./chatRoute"));
const routes = (app) => {
    app.use('/api/user', userRouter_1.default);
    app.use('/api/provider', providerRoute_1.default);
    app.use('/api/admin', adminRoutes_1.default);
    app.use('/api/chat', chatRoute_1.default);
};
exports.default = routes;

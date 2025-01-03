"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoute_1 = __importDefault(require("./authRoute"));
const userRouter_1 = __importDefault(require("./userRouter"));
const adminProviderRouter_1 = __importDefault(require("./adminProviderRouter"));
const adminServiceRoute_1 = __importDefault(require("./adminServiceRoute"));
const adminBookingRoute_1 = __importDefault(require("./adminBookingRoute"));
const adminRouter = express_1.default.Router();
adminRouter.use('/auth', authRoute_1.default);
adminRouter.use('/user', userRouter_1.default);
adminRouter.use('/providers', adminProviderRouter_1.default);
adminRouter.use('/services', adminServiceRoute_1.default);
adminRouter.use('/bookings', adminBookingRoute_1.default);
exports.default = adminRouter;

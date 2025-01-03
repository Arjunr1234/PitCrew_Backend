"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter_1 = __importDefault(require("./authRouter"));
const userServices_1 = __importDefault(require("./userServices"));
const userBooking_1 = __importDefault(require("./userBooking"));
const userProfile_1 = __importDefault(require("./userProfile"));
const userRoute = express_1.default.Router();
userRoute.use('/auth', authRouter_1.default);
userRoute.use('/services', userServices_1.default);
userRoute.use('/bookings', userBooking_1.default);
userRoute.use('/profile', userProfile_1.default);
exports.default = userRoute;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRouter_1 = __importDefault(require("./authRouter"));
const providerAddService_1 = __importDefault(require("./providerAddService"));
const providerBookings_1 = __importDefault(require("./providerBookings"));
const providerProfile_1 = __importDefault(require("./providerProfile"));
const providerRouter = express_1.default.Router();
providerRouter.use('/auth', authRouter_1.default);
providerRouter.use('/add-service', providerAddService_1.default);
providerRouter.use('/bookings', providerBookings_1.default);
providerRouter.use('/profile', providerProfile_1.default);
exports.default = providerRouter;

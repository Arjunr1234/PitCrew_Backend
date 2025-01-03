"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../../../../interface_adapters/repository/adminRepository"));
const adminBooking_1 = __importDefault(require("../../../../usecases/admin/adminBooking"));
const adminBooking_2 = __importDefault(require("../../../../interface_adapters/controllers/admin/adminBooking"));
const adminBookingRoute = express_1.default.Router();
const repository = new adminRepository_1.default();
const interactor = new adminBooking_1.default(repository);
const controller = new adminBooking_2.default(interactor);
adminBookingRoute.get('/get-all-bookings', controller.getAllBookings.bind(controller));
adminBookingRoute.get('/dashboard-details', controller.getDashboardDetails.bind(controller));
exports.default = adminBookingRoute;

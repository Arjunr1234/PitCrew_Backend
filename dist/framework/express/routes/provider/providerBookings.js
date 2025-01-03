"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const providerRepository_1 = __importDefault(require("../../../../interface_adapters/repository/providerRepository"));
const bookings_1 = __importDefault(require("../../../../usecases/provider/bookings"));
const providerBookings_1 = __importDefault(require("../../../../interface_adapters/controllers/provider/providerBookings"));
const jwtAuthentication_1 = __importDefault(require("../../middleware/jwtAuthentication"));
const constants_1 = require("../../../../entities/rules/constants");
const providerBookingsRoute = express_1.default.Router();
const repository = new providerRepository_1.default();
const interactor = new bookings_1.default(repository);
const controller = new providerBookings_1.default(interactor);
//======================= Routes ===================================
providerBookingsRoute.post('/add-slot', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.addSlot.bind(controller));
providerBookingsRoute.get('/get-all-slot', controller.getAllSlot.bind(controller));
providerBookingsRoute.get('/get-all-bookings', controller.getAllBookings.bind(controller));
providerBookingsRoute.get('/get-single-booking', controller.getSingleBooking.bind(controller));
providerBookingsRoute.get('/dashboard-details', controller.getDashboardDetails.bind(controller));
providerBookingsRoute.patch('/update-slot', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.updateSlotCount.bind(controller));
providerBookingsRoute.patch('/change-status', controller.changeBookingStatus.bind(controller));
providerBookingsRoute.delete('/remove-slot', (0, jwtAuthentication_1.default)(constants_1.role.provider), controller.removeSlot.bind(controller));
exports.default = providerBookingsRoute;

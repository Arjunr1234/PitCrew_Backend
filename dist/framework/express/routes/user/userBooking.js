"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRepository_1 = __importDefault(require("../../../../interface_adapters/repository/userRepository"));
const booking_1 = __importDefault(require("../../../../usecases/user/booking"));
const userBooking_1 = __importDefault(require("../../../../interface_adapters/controllers/user/userBooking"));
const jwtAuthentication_1 = __importDefault(require("../../middleware/jwtAuthentication"));
const constants_1 = require("../../../../entities/rules/constants");
const userBookingRoute = express_1.default.Router();
const repository = new userRepository_1.default();
const interactor = new booking_1.default(repository);
const controller = new userBooking_1.default(interactor);
//========================== Routes ==========================
userBookingRoute.post('/service-booking-payment', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.serviceBookingPayment.bind(controller));
userBookingRoute.post('/add-rating', controller.addRating.bind(controller));
userBookingRoute.get('/check-avaliable-slot', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.checkAvaliableSlot.bind(controller));
userBookingRoute.get('/get-all-bookings', controller.getAllBookings.bind(controller));
userBookingRoute.get('/get-notification', controller.getNotification.bind(controller));
userBookingRoute.put('/cancell-booking', controller.cancellBooing.bind(controller));
userBookingRoute.patch('/change-payment-status-success', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.successfullPaymentStatusChange.bind(controller));
userBookingRoute.patch('/notification-seen', controller.seenNotification.bind(controller));
exports.default = userBookingRoute;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("../../../entities/rules/statusCodes"));
class UserBookingController {
    constructor(userBookingInteractor) {
        this.userBookingInteractor = userBookingInteractor;
    }
    serviceBookingPayment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.body;
                console.log("Entered into serviceBookingPayment: ", JSON.stringify(data, null, 2));
                const response = yield this.userBookingInteractor.serviceBookingPaymentUseCase(data);
                console.log("This is the resposne from controller: ", response);
                if (!response.success) {
                    res.status(400).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.CREATED).json({ success: response.success, session: response.session });
            }
            catch (error) {
                console.log("Error in serviceBooingInteractor: ", error);
            }
        });
    }
    checkAvaliableSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.query.providerId;
                const date = req.query.date;
                console.log("This is providerId and date://////////////////////////////// ", providerId, date);
                if (!providerId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide the necessary data" });
                }
                const response = yield this.userBookingInteractor.checkingAvaliableSlotUseCase(providerId, date);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message, slotId: response.slotId });
            }
            catch (error) {
                console.log("Error in checkAvaliable slot: ", error);
                next(error);
            }
        });
    }
    successfullPaymentStatusChange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { paymentSessionId, bookId } = req.body;
                if (!paymentSessionId || !bookId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide necessary data" });
                }
                const response = yield this.userBookingInteractor.successfullPaymentStatusChangeUseCase(paymentSessionId, bookId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in successfullPaymentStatusChange: ", error);
                next(error);
            }
        });
    }
    getAllBookings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                if (!userId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, mesage: "Please provide the id" });
                }
                const response = yield this.userBookingInteractor.getAllBookingsUseCase(userId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, bookingData: response.bookingData });
            }
            catch (error) {
                console.log("Error in getAllBookingsController: ", error);
                next(error);
            }
        });
    }
    cancellBooing(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.body.bookingId;
                const reason = req.body.reason;
                if (!bookingId || !reason) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provider bookingId and reason" });
                    return;
                }
                const response = yield this.userBookingInteractor.cancellBooingUseCase(bookingId, reason);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in cancellBooking: ", error);
                next(error);
            }
        });
    }
    addRating(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userBookingInteractor.addRatingUseCase(req.body);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                }
                res.status(statusCodes_1.default.CREATED).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in addRatingController: ", error);
                next(error);
            }
        });
    }
    getNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const receiverId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.receiverId;
                if (!receiverId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provider receiverId" });
                    return;
                }
                const response = yield this.userBookingInteractor.getNotificationUseCase(receiverId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message, notification: response.notificationData });
            }
            catch (error) {
                console.log("Error in getNotification controller");
                next(error);
            }
        });
    }
    seenNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notificationId = req.query.notificationId;
                if (!notificationId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide seen Notification" });
                    return;
                }
                const response = yield this.userBookingInteractor.seenNotificationUseCase(notificationId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in seen Notification: ", error);
                next(error);
            }
        });
    }
}
exports.default = UserBookingController;

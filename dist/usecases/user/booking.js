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
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = require("../../framework/config/stripe");
const date_fns_1 = require("date-fns");
class UserBookingInteractor {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    checkingAvaliableSlotUseCase(providerId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.checkAvaliableSlotRepo(providerId, date);
                return response;
            }
            catch (error) {
                console.log("error in checkingAvalibleSlotUsecase: ", error);
                return { success: false, message: "Something went wrong in checkingAvaliableSlotUseCase" };
            }
        });
    }
    serviceBookingPaymentUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceDetails = {
                    services: data.selectedServices,
                    amount: data.totalPrice + data.platformFee,
                    platformFee: data.platformFee,
                    serviceName: data.vehicleDetails.serviceName,
                };
                const bookService = yield this.userRepository.serviceBookingRepo(data);
                if (bookService.success) {
                    const session = yield (0, stripe_1.makePayment)(serviceDetails, bookService.bookingDetails._id);
                    if (session) {
                        return { success: true, session: session };
                    }
                    else {
                        return { success: false, message: "Payment session creation failed." };
                    }
                }
                else {
                    return { success: false, message: bookService.message || "Service booking failed." };
                }
            }
            catch (error) {
                console.error("Something went wrong in serviceBookingPaymentUseCase:", error);
                return { success: false, message: "An error occurred during service booking and payment process." };
            }
        });
    }
    successfullPaymentStatusChangeUseCase(paymentSessionId, bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield (0, stripe_1.confimPayment)(paymentSessionId);
                console.log("This is the payment Intent: ", paymentIntent);
                if (!paymentIntent) {
                    return { success: false, message: "Failed to fetch a valid payment intent" };
                }
                const changeBookingStatus = yield this.userRepository.updateBooking(paymentIntent, bookId);
                return {
                    success: changeBookingStatus.success,
                    message: changeBookingStatus.message,
                };
            }
            catch (error) {
                console.error("Error occurred in successfullPaymentStatusChangeUseCase:", error);
                return { success: false, message: "Something went wrong in successfulPaymentStatusChangeUseCase" };
            }
        });
    }
    getAllBookingsUseCase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getAllBookingsRepo(userId);
                return response;
            }
            catch (error) {
                console.log("Error in getAllBookingsUseCase: ", error);
                return { success: false, message: "Somthing went wrong in getAllBookingsUseCase" };
            }
        });
    }
    cancellBooingUseCase(bookingId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getBookingData = yield this.userRepository.getCancelledBookingRepo(bookingId);
                if (!getBookingData.success) {
                    return { success: getBookingData.success, message: getBookingData.message };
                }
                const currentTime = new Date();
                const scheduledDateTime = new Date(getBookingData.bookingData.serviceDate);
                const hourDifference = (0, date_fns_1.differenceInHours)(scheduledDateTime, currentTime);
                let refundAmount;
                let refundStatus;
                if (hourDifference >= 24) {
                    refundAmount = getBookingData.bookingData.subTotal - getBookingData.bookingData.platformFee;
                    refundStatus = "full refund";
                }
                else if (hourDifference > 0) {
                    refundAmount = (getBookingData.bookingData.subTotal - getBookingData.bookingData.platformFee) * .75;
                    refundStatus = "partial refund";
                }
                else {
                    return { success: false, message: "Cancellation not allowed after the booking time has passed" };
                }
                const refund = yield (0, stripe_1.refundPayment)(getBookingData.bookingData.paymentId, refundAmount);
                if (!refund.success) {
                    return { success: refund.success, message: refund.message };
                }
                const updateBooking = yield this.userRepository.updateBookingAfterRefundRepo(bookingId, reason, refundAmount, refundStatus);
                return updateBooking;
            }
            catch (error) {
                console.log("Error in cancellBookingUseCase: ", error);
                return { success: false, message: "Something went wrong in cancellBooingUsecase" };
            }
        });
    }
    addRatingUseCase(ratingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.addRatingRepo(ratingData);
                return response;
            }
            catch (error) {
                console.log("Error in addRatingUseCase: ", error);
                return { success: false, message: "Something went wrong in addRatingUseCase" };
            }
        });
    }
    getNotificationUseCase(receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getNotificationRepo(receiverId);
                return response;
            }
            catch (error) {
                console.log("Error in getNotificationUseCase: ", error);
                return { success: false, message: "Something went wrong in getNotificationUseCase" };
            }
        });
    }
    seenNotificationUseCase(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.seenNotificationRepo(notificationId);
                return response;
            }
            catch (error) {
                console.log("Error in seenNotificationUseCase: ", error);
                return { success: false, message: "Something went wrong in seenNotificationUseCase" };
            }
        });
    }
    clearNotificationUseCase(receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.clearNotificationController(receiverId);
                return response;
            }
            catch (error) {
                return { success: false, message: "Something went wrong in clear notification" };
            }
        });
    }
}
exports.default = UserBookingInteractor;

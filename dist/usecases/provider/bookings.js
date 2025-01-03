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
class ProviderBookingsInteractor {
    constructor(BookingsRepository) {
        this.BookingsRepository = BookingsRepository;
    }
    addSlotUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = this.BookingsRepository.addSlotRepo(data);
                return response;
            }
            catch (error) {
                console.log("Error in addSlotUseCase: ", error);
                return { success: false, message: "Something went wrong in addSlotUseCase" };
            }
        });
    }
    getAllSlotUseCase(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.BookingsRepository.getAllSlotRepo(providerId);
                return response;
            }
            catch (error) {
                console.log("Error in getAllSlotUseCase: ", error);
                return { success: false, message: "Something went wrong in getAllSlotUseCase" };
            }
        });
    }
    updateSlotCountUseCase(slotId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.BookingsRepository.updateSlotCountRepo(slotId, state);
                return response;
            }
            catch (error) {
                console.log("Error in updateSlotCountUseCase: ", error);
                return { success: false, message: "Something went wrong in updateSlotCountUseCase" };
            }
        });
    }
    removeSlotUseCase(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.BookingsRepository.removeSlotRepo(slotId);
                return response;
            }
            catch (error) {
                console.log("Error in removeSlotUseCase: ", error);
                return { success: false, message: "Something went wrong in removeSlotUsecase" };
            }
        });
    }
    getAllBookingsUseCase(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.BookingsRepository.getAllBookingRepo(providerId);
                return response;
            }
            catch (error) {
                console.log("Error in getAllBookingUseCase: ", error);
                return { success: false, message: "Something went wrong in getAllBookingsUseCase" };
            }
        });
    }
    changeBookingStatusUseCase(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.BookingsRepository.changeBookingStatusRepo(bookingId, status);
                return response;
            }
            catch (error) {
                console.log("Error in changeBookingStatusUseCase: ", error);
                return { success: false, message: "Something went wrong in change bookingStatusUseCase" };
            }
        });
    }
    getSingleBookingUseCase(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.BookingsRepository.getSingleBookingRepo(bookingId);
                return response;
            }
            catch (error) {
                console.log('Error in getSingleBookingUseCase: ', error);
                return { success: false, message: "Something went wrong in getSingleBookingUseCase" };
            }
        });
    }
    getDashboardDetailsUseCase(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.BookingsRepository.getDashboardDetailsRepo(providerId);
                return response;
            }
            catch (error) {
                console.log("Error in getDashboardDetail");
                return { success: false, message: "Something went wrong in getDashboardDetailsUseCase" };
            }
        });
    }
}
exports.default = ProviderBookingsInteractor;

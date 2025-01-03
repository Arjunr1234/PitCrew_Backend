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
class ProviderBookingsController {
    constructor(providerBookingsInteractor) {
        this.providerBookingsInteractor = providerBookingsInteractor;
    }
    addSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, startingDate, endingDate, count } = req.body;
                if (!providerId || !startingDate || !count) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide necessary data" });
                }
                const data = { providerId, startingDate, endingDate, count };
                console.log("This is data: ", data);
                const response = yield this.providerBookingsInteractor.addSlotUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.CREATED).json({ success: response.success, message: response.message, slotData: response.slotData });
            }
            catch (error) {
                console.log("Error in addSlot Controller: ", error);
                next(error);
            }
        });
    }
    getAllSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.query.providerId;
                if (!providerId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provider providerId" });
                }
                const response = yield this.providerBookingsInteractor.getAllSlotUseCase(providerId);
                console.log("This is the getAll slotResponse: ", response);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message, slotData: response.slotData });
            }
            catch (error) {
                console.log("Error in getAllSlot: ", error);
            }
        });
    }
    updateSlotCount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { slotId, state } = req.body;
                if (!slotId || !state) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide necessary details" });
                }
                const response = yield this.providerBookingsInteractor.updateSlotCountUseCase(slotId, state);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: response.message });
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in updateSlotCountController: ", error);
                next(error);
            }
        });
    }
    removeSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slotId = req.query.slotId;
                if (!slotId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide slotId" });
                }
                const response = yield this.providerBookingsInteractor.removeSlotUseCase(slotId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in removeSlot: ", error);
                next(error);
            }
        });
    }
    getAllBookings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.query.providerId;
                if (!providerId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide Id" });
                    return;
                }
                const response = yield this.providerBookingsInteractor.getAllBookingsUseCase(providerId);
                console.log("This si reh resposne: ", response);
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
    changeBookingStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const bookingId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.bookingId;
                const status = (_b = req.body) === null || _b === void 0 ? void 0 : _b.status;
                if (!bookingId || !status) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide the necessary data" });
                    return;
                }
                const response = yield this.providerBookingsInteractor.changeBookingStatusUseCase(bookingId, status);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in changeBookingStatus: ", error);
                next(error);
            }
        });
    }
    getSingleBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const bookingId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.bookingId;
                if (!bookingId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide bookingId" });
                    return;
                }
                const response = yield this.providerBookingsInteractor.getSingleBookingUseCase(bookingId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message, bookingData: response.bookingData });
            }
            catch (error) {
                console.log("Error in getSingleBooking: ", error);
                next(error);
            }
        });
    }
    getDashboardDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.query.providerId;
                if (!providerId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please give providerID" });
                    return;
                }
                console.log("this is the providerId: ", providerId);
                const response = yield this.providerBookingsInteractor.getDashboardDetailsUseCase(providerId);
                console.log('This is respose: ', response);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message, dashboardData: response.dashboardData });
            }
            catch (error) {
                console.log("Error in getDashboardDetails: ", error);
                next(error);
            }
        });
    }
}
exports.default = ProviderBookingsController;

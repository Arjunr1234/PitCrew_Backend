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
class AdminBookingController {
    constructor(adminBookingInteractor) {
        this.adminBookingInteractor = adminBookingInteractor;
    }
    getAllBookings(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminBookingInteractor.getAllBookingsUseCase();
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: true, bookingData: response.bookingData });
            }
            catch (error) {
                console.log("Error in getAllBookings Controller: ", error);
                next(error);
            }
        });
    }
    getDashboardDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminBookingInteractor.getDashboradDetailsUseCase();
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message, dashboardData: response.dashboradData });
            }
            catch (error) {
                console.log("Error in getAllBookings controller");
                next(error);
            }
        });
    }
}
exports.default = AdminBookingController;

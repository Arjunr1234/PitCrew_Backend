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
class ProviderProfileController {
    constructor(providerProfileInteractor) {
        this.providerProfileInteractor = providerProfileInteractor;
    }
    getProviderDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.query.providerId;
                if (!providerId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide necessary data" });
                    return;
                }
                const response = yield this.providerProfileInteractor.getProviderDetailsUseCase(providerId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message, providerData: response.providerData });
            }
            catch (error) {
                console.log("Error in getProviderDetails: ", error);
                next(error);
            }
        });
    }
    editProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { workshopName, ownerName, phone, about, providerId } = req.body;
                const data = { workshopName, ownerName, phone, about, providerId };
                const response = yield this.providerProfileInteractor.editProfileUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, mesage: response.message, providerData: response.message });
            }
            catch (error) {
                console.log("Error in EditProfile: ", error);
                next(error);
            }
        });
    }
    updateProfilePic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
                const providerId = req.body.providerId;
                if (!file || !providerId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provider the data" });
                    return;
                }
                const response = yield this.providerProfileInteractor.updateProfilePicUseCase(providerId, file);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message, imageUrl: response.imageUrl });
            }
            catch (error) {
                console.log("Error in updateProfilePic: ", error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, currentPassword, newPassword } = req.body;
                if (!providerId || !currentPassword || !newPassword) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide necessary data" });
                    return;
                }
                const response = yield this.providerProfileInteractor.resetPasswordUseCase(providerId, currentPassword, newPassword);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in resetPassword controller");
                next(error);
            }
        });
    }
}
exports.default = ProviderProfileController;

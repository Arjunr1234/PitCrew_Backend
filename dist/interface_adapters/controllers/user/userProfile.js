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
class UserProfileController {
    constructor(userProfileInteractor) {
        this.userProfileInteractor = userProfileInteractor;
    }
    getUserDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                if (!userId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provider the data" });
                    return;
                }
                const response = yield this.userProfileInteractor.getUserDetailsUsecase(userId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, userData: response.userData });
            }
            catch (error) {
                console.log("Error in getUserDetailsController: ", error);
                next(error);
            }
        });
    }
    editUserProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, phone, userId } = req.body;
                console.log("This is the reecived data from req.body: ", req.body);
                const data = {
                    name, phone, userId
                };
                const response = yield this.userProfileInteractor.editUserProfileUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: true });
            }
            catch (error) {
                console.log("Error in editUserProfileController: ", error);
                next(error);
            }
        });
    }
    updateImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
            }
            catch (error) {
                console.log("Error ocuured in updateImage: ", error);
                next(error);
            }
        });
    }
    updateProfileImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.body.userId;
                const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
                const response = yield this.userProfileInteractor.updateProfileImageUseCase(file, userId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, imageUrl: response.imageUrl });
            }
            catch (error) {
                console.log("Error occured in updateProfileImage: ", error);
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, currentPassword, newPassword } = req.body;
                if (!userId || !currentPassword || !newPassword) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide necessary data" });
                    return;
                }
                const response = yield this.userProfileInteractor.resetPasswordUseCase(userId, currentPassword, newPassword);
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
exports.default = UserProfileController;

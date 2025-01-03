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
class UserProfileInteractor {
    constructor(userRepository, cloudinaryService) {
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }
    getUserDetailsUsecase(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getUserDetailsRepo(userId);
                return response;
            }
            catch (error) {
                console.log("Error in getUserDetailsUsecase: ", error);
                return { success: false, message: "Something went wrong in getUserDetails: " };
            }
        });
    }
    editUserProfileUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.editUserProfileRepo(data);
                return response;
            }
            catch (error) {
                console.log("Error in editUserProfileUseCase: ", error);
                return { success: false, message: "Something went wrong in editUserProfileUsecase" };
            }
        });
    }
    updateProfileImageUseCase(file, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const folderName = 'userprofilePic';
                const responseImageUrl = yield this.cloudinaryService.uploadImage(file, folderName);
                console.log("This si resposeImageUrl: ", responseImageUrl);
                if (!responseImageUrl) {
                    return { success: false, message: "Failed to upload image" };
                }
                const response = yield this.userRepository.updateProfileImageRepo(userId, responseImageUrl);
                if (response.success) {
                    const deletePreImage = yield this.cloudinaryService.deleteImage(response.prevImgUrl);
                    console.log("This is the deletePrevImage response(This won't affect the working of uploads but make sure that prev message is deleted): ", deletePreImage);
                    return { success: response.success, message: response.message, imageUrl: response.newImgUrl };
                }
                else {
                    return { success: false, message: response.message };
                }
            }
            catch (error) {
                console.log("Error in updateProfileImageUseCase: ", error);
                return { success: false, message: "Something went wrong in updateProfileImageUsecase" };
            }
        });
    }
    resetPasswordUseCase(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.resetPasswordRepo(userId, currentPassword, newPassword);
                return response;
            }
            catch (error) {
                console.log("Error in resetPassword : ", error);
                return { success: false, message: "Something went wrong in resetPasswordUseCase" };
            }
        });
    }
}
exports.default = UserProfileInteractor;

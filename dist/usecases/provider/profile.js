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
class ProviderProfileInteractor {
    constructor(providerProfileRepo, cloudinary) {
        this.providerProfileRepo = providerProfileRepo;
        this.cloudinary = cloudinary;
    }
    getProviderDetailsUseCase(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.providerProfileRepo.getProviderDetailsRepo(providerId);
                return response;
            }
            catch (error) {
                console.log("This is the error: ", error);
                return { success: false, message: "Something went wrong in getProviderDetailsUseCase " };
            }
        });
    }
    editProfileUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.providerProfileRepo.editProfileRepo(data);
                return response;
            }
            catch (error) {
                console.log("Error in editProfileUseCase: ", error);
                return { success: false, message: "Somthing went wrong in editProfileUseCase" };
            }
        });
    }
    updateProfilePicUseCase(providerId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const folderName = 'providerProfilePic';
                const responseImageUrl = yield this.cloudinary.uploadImage(file, folderName);
                if (!responseImageUrl) {
                    return { success: false, message: "Failed to upload the image" };
                }
                const response = yield this.providerProfileRepo.updateProfileImageRepo(providerId, responseImageUrl);
                if (response.success) {
                    const deletePrevImage = yield this.cloudinary.deleteImage(response.prevImgUrl);
                    console.log("This is the deletePrevImage response(This won't affect the working of uploads but make sure that prev message is deleted): ", deletePrevImage);
                    return { success: response.success, message: response.message, imageUrl: response.newImgUrl };
                }
                else {
                    return { success: false, message: response.message };
                }
            }
            catch (error) {
                console.log("Error in updateProfilePicUseCase: ", error);
                return { success: false, message: "Something went wrong in updateProfileUsecase" };
            }
        });
    }
    resetPasswordUseCase(providerId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.providerProfileRepo.resetPasswordRepo(providerId, currentPassword, newPassword);
                return response;
            }
            catch (error) {
                console.log("Error in resetPassword : ", error);
                return { success: false, message: "Something went wrong in resetPassword" };
            }
        });
    }
}
exports.default = ProviderProfileInteractor;

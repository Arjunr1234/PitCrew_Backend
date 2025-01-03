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
class AdminProviderInteractor {
    constructor(adminProviderRepo, mailer) {
        this.adminProviderRepo = adminProviderRepo;
        this.mailer = mailer;
    }
    getPendingProvidersUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminProviderRepo.getPendingProvidersRepo();
                if (!response.success) {
                    return { success: response.success, message: response.message };
                }
                return { success: true, providers: response.providers, message: "Successfull" };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    getProvidersUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminProviderRepo.getProvidersRepo();
                if (!response.success) {
                    return { success: response.success, message: response.message };
                }
                return { success: true, providers: response.providers, message: "Successfull" };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    providerAcceptAndReject(id, state, reason, providerEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminProviderRepo.providerAcceptOrRejectRepo(id, state);
                if (!response.success) {
                    return { success: false };
                }
                if (state === false) {
                    const sendRejectionMail = yield this.mailer.sendRejectonMail(providerEmail, reason);
                    if (!sendRejectionMail.success) {
                        return { success: false, message: response.message };
                    }
                }
                return { success: true, message: response.message };
            }
            catch (error) {
                return { success: false };
            }
        });
    }
    providerBlockAndUnblockUseCase(id, state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminProviderRepo.providerBlockAndUnblockUseCase(id, state);
                if (!response.success) {
                    return { success: false };
                }
                return { success: true };
            }
            catch (error) {
                return { success: false, message: "something wrong happend!!" };
            }
        });
    }
}
exports.default = AdminProviderInteractor;

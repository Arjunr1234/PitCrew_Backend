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
class AdminUserInteractor {
    constructor(adminUserRepo) {
        this.adminUserRepo = adminUserRepo;
    }
    getUsersUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminUserRepo.getUsersRepo();
                if (!response.success) {
                    return { success: false };
                }
                return { success: true, users: response.users, active: response.active, blocked: response.blocked };
            }
            catch (error) {
                return { success: false };
            }
        });
    }
    userBlockAndUnblockUseCase(id, state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminUserRepo.adminBlockUnblockUser(id, state);
                console.log("This is the response from userBlockUseCase: ", response);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true, message: response.message };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
}
exports.default = AdminUserInteractor;

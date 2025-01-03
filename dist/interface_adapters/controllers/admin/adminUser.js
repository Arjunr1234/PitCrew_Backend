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
class AdminUserCotroller {
    constructor(adminUserInteractor) {
        this.adminUserInteractor = adminUserInteractor;
    }
    getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.adminUserInteractor.getUsersUseCase();
            console.log("This is the response from getUser AdminController: ", response);
            if (!response.success) {
                res.status(503).json({ success: response.success });
            }
            console.log("This is blockunblc from controller: ", response.active, response.blocked);
            res.status(200).json({ success: true, users: response.users, active: response.active, blocked: response.blocked });
        });
    }
    userBlockAndUnblock(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered into userBlock unblock: ");
            const { id, state } = req.body;
            const response = yield this.adminUserInteractor.userBlockAndUnblockUseCase(id, state);
            if (!response.success) {
                res.status(400).json({ success: response.success, message: response.message });
                return;
            }
            res.status(200).json({ success: response.success, message: response.message });
        });
    }
}
exports.default = AdminUserCotroller;

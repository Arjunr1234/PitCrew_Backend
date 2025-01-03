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
class AdminAuthController {
    constructor(AdminAuthInteractor) {
        this.AdminAuthInteractor = AdminAuthInteractor;
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered into admincontroller login");
            const loginResponse = yield this.AdminAuthInteractor.loginUseCase(req.body);
            if (!loginResponse.success) {
                res.status(400).json({ success: false, message: loginResponse.message });
            }
            else {
                res.cookie('adminRefreshToken', loginResponse.refreshToke, {
                    httpOnly: true,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 14 * 24 * 60 * 60 * 1000,
                });
                res.cookie('adminAccessToken', loginResponse.accessToken, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000,
                });
                res.status(200).json({
                    success: true,
                    message: loginResponse.message,
                    adminData: loginResponse.adminData,
                });
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('adminRefreshToken', {
                    httpOnly: true,
                    sameSite: true,
                    path: '/'
                });
                res.clearCookie('adminAccessToken', {
                    httpOnly: true,
                    sameSite: true,
                    path: '/'
                });
                res.status(200).json({ success: true, message: 'Logout successfull' });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
}
exports.default = AdminAuthController;

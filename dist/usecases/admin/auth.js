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
class AdminAuthInteactor {
    constructor(adminAuthRepository, jwt) {
        this.adminAuthRepository = adminAuthRepository;
        this.jwt = jwt;
    }
    loginUseCase(adminLoginData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const loginResponse = yield this.adminAuthRepository.loginRepo(adminLoginData);
            if (!loginResponse.success) {
                if (loginResponse.message === "userNotExists") {
                    return { success: false, message: "Invalid email please try another" };
                }
                if (loginResponse.message === "incorrectPassword") {
                    return { success: false, message: "Incorrect password!!" };
                }
                return { success: false, message: "some unknown error is occured " };
            }
            const payload = {
                roleId: (_a = loginResponse.adminData) === null || _a === void 0 ? void 0 : _a._id,
                email: (_b = loginResponse.adminData) === null || _b === void 0 ? void 0 : _b.email,
                role: "admin"
            };
            const accessToken = this.jwt.generateToken(payload, { expiresIn: '1h' });
            const refreshToken = this.jwt.generateRefreshToken(payload, { expiresIn: "14d" });
            return { success: true, message: "Successfully LoggedIn ", adminData: loginResponse.adminData, accessToken: accessToken, refreshToke: refreshToken };
        });
    }
}
exports.default = AdminAuthInteactor;

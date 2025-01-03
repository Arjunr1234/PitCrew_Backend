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
class AuthController {
    constructor(interactor) {
        this.interactor = interactor;
    }
    sendOtpController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const email = (_a = req.body) === null || _a === void 0 ? void 0 : _a.email;
                if (!email) {
                    res.status(400).json({ message: "Email is required" });
                    return;
                }
                const response = yield this.interactor.sendotp(email);
                console.log("This is the response in controller: ", response);
                if (response.success) {
                    res.status(200).json({ success: true, message: response.message });
                }
                else {
                    res.status(200).json({ success: false, message: response.message });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Failed to send OTP", error: error.message });
            }
        });
    }
    otpVerificationAndSignup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userData, otp } = req.body;
                console.log("This is body: ", req.body);
                if (!userData || !otp) {
                    res.status(400).json({ success: false, message: "Missing user data or OTP." });
                    return;
                }
                const response = yield this.interactor.verifyAndSignup(userData, otp);
                if (response.success) {
                    res.cookie('userRefreshToken', response.refreshToken, {
                        httpOnly: true,
                        sameSite: true,
                        path: '/',
                        maxAge: 15 * 60 * 1000
                    });
                    res.cookie('userAccessToken', response.acessToken, {
                        httpOnly: true,
                        sameSite: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    });
                    res.status(200).json({ user: response.user, success: true, message: response.message });
                }
                else {
                    res.status(400).json({ success: false, message: response.message });
                }
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const logData = { email, password };
                const response = yield this.interactor.login(logData);
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                }
                else {
                    res.cookie('userRefreshToken', response.refreshToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        path: '/',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                    res.cookie('userAccessToken', response.accesToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000,
                    });
                    res.status(200).json({ user: response.user, success: true, message: "LOGGED IN" });
                }
            }
            catch (error) {
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('userRefreshToken', {
                    httpOnly: true,
                    sameSite: true,
                    path: '/'
                });
                res.clearCookie('userAccessToken', {
                    httpOnly: true,
                    sameSite: true,
                    path: '/'
                });
                res.status(200).json({ success: true, message: 'Logout successful' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AuthController;

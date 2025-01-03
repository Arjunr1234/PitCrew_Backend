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
class ProviderAuthController {
    constructor(providerAuthInteractor) {
        this.providerAuthInteractor = providerAuthInteractor;
    }
    sendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("hellow");
                const { email } = req.body;
                if (!email) {
                    res.status(400).json({ success: false, message: "Please provide email" });
                    return;
                }
                const sendOtpResponse = yield this.providerAuthInteractor.sendOtp(email);
                if (!sendOtpResponse.created) {
                    console.log("There is someting error happend");
                    res.status(400).json({ success: false, message: sendOtpResponse.message });
                    return;
                }
                console.log("otp is sended");
                res.status(200).json({ success: true, message: sendOtpResponse.message });
            }
            catch (error) {
                console.error("Error in sendOtp:", error);
                next(error);
            }
        });
    }
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            const verifyOtp = yield this.providerAuthInteractor.verifyOtpUseCase(email, otp);
            if (verifyOtp.success) {
                res.status(200).json({ success: true, message: verifyOtp.message });
                return;
            }
            res.status(400).json({ success: false, message: verifyOtp.message });
        });
    }
    createProvider(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.providerAuthInteractor.createProviderUseCase(req.body);
                if (!response.success) {
                    res.status(400).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(200).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //   console.log("This is the body: ",req.body);
                const loginResponse = yield this.providerAuthInteractor.loginUseCase(req.body);
                if (!loginResponse.success) {
                    res.status(400).json({ success: false, message: loginResponse.message });
                }
                else {
                    res.cookie('providerRefreshToken', loginResponse.refreshToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        path: '/',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                    res.cookie('providerAccessToken', loginResponse.accessToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 15 * 60 * 1000,
                    });
                    res.status(200).json({ provider: loginResponse.provider, success: true, message: loginResponse.message });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entered in to logout provider");
                res.clearCookie('providerRefreshToken', {
                    httpOnly: true,
                    sameSite: true,
                    path: '/'
                });
                res.clearCookie('providerAccessToken', {
                    httpOnly: true,
                    sameSite: true,
                    path: '/'
                });
                res.status(200).json({ success: true, message: "Logout successfull!!" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = ProviderAuthController;

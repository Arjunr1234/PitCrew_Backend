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
class ProviderAuthInteractor {
    constructor(providerAuthRepository, mailer, jwt) {
        this.providerAuthRepository = providerAuthRepository;
        this.mailer = mailer;
        this.jwt = jwt;
    }
    sendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerExist = yield this.providerAuthRepository.providerExist(email);
                if (!providerExist.success) {
                    console.log("user alredy exist");
                    return { created: false, message: providerExist.message || "User already exists!" };
                }
                const sendMail = yield this.mailer.sendMail(email);
                if (!sendMail.success) {
                    return { created: false, message: "Failed to send OTP!" };
                }
                const saveOtp = yield this.providerAuthRepository.saveOtp(sendMail.otp, email);
                if (!saveOtp.success) {
                    return { created: false, message: saveOtp.message || "Failed to save OTP!" };
                }
                return { created: true, message: "OTP sent successfully!" };
            }
            catch (error) {
                console.error("Error in sendOtp:", error);
                return { created: false, message: "An error occurred while sending OTP." };
            }
        });
    }
    verifyOtpUseCase(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseOtp = yield this.providerAuthRepository.getOtp(email, otp);
            if (responseOtp.otp === otp) {
                return { success: true, message: "Successfully Verified!!" };
            }
            return { success: false, message: "Verification failed!!" };
        });
    }
    createProviderUseCase(providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(providerData);
            const createUserRepo = yield this.providerAuthRepository.createProvider(providerData);
            if (!createUserRepo) {
                return { success: false, message: "some issue in creating the provider" };
            }
            return { success: true, message: "Registered successfully!!!" };
        });
    }
    loginUseCase(LogData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                console.log("This is the data in loginUserCase,", LogData);
                const loginResponse = yield this.providerAuthRepository.loginRepo(LogData);
                if (loginResponse.message === "Wrong email") {
                    return { success: false, message: "Please enter a valid email!!" };
                }
                if (loginResponse.message === "Wrong password") {
                    return { success: false, message: "Incorrect password" };
                }
                if (loginResponse.message === 'blocked') {
                    return { success: false, message: "You are blocked by Admin" };
                }
                if (loginResponse.message === 'rejected') {
                    return { success: false, message: "Sorry, your request is Rejected!!" };
                }
                if (loginResponse.message === 'pending') {
                    return { success: false, message: "Please wait, \n Admin is Verifying your data" };
                }
                const payload = {
                    roleId: (_a = loginResponse.provider) === null || _a === void 0 ? void 0 : _a._id,
                    email: (_b = loginResponse.provider) === null || _b === void 0 ? void 0 : _b.email,
                    role: 'provider'
                };
                console.log("This is the payload: ", payload);
                const accessToken = this.jwt.generateToken(payload, { expiresIn: '1h' });
                const refreshToken = this.jwt.generateRefreshToken(payload, { expiresIn: '14d' });
                return { success: true, message: "Login Successfull!!", provider: loginResponse.provider, accessToken: accessToken, refreshToken: refreshToken };
            }
            catch (error) {
                console.log("Error occur: ", error);
                return { success: false, message: "Some error occured during login interactor", };
            }
        });
    }
}
exports.default = ProviderAuthInteractor;

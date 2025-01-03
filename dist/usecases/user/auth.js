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
class UserAuthInteractor {
    constructor(userRepository, Mailer, jwtServices) {
        this.userRepository = userRepository;
        this.Mailer = Mailer;
        this.jwtServices = jwtServices;
    }
    sendotp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield this.userRepository.userexist(email);
            if (!userExist) {
                console.log("Entered into not userExist in userInteractor");
                const mailresponse = yield this.Mailer.sendMail(email);
                console.log("This is the mail response: ", mailresponse);
                yield this.userRepository.tempOTp(mailresponse.otp, email);
                if (mailresponse.success) {
                    return { success: true, message: "Otp sent to your email" };
                }
                else {
                    return { success: false, message: "Something went wrong, cannot send otp to your email" };
                }
            }
            else {
                return { success: false, message: "User already exists with the same email" };
            }
        });
    }
    // Implementing the otpVerification method as required by the interface
    otpVerification(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpVerified = yield this.userRepository.otpVerification(email, otp);
            return otpVerified;
        });
    }
    verifyAndSignup(userData, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpVerified = yield this.otpVerification(userData.email, otp);
            if (!otpVerified) {
                return { success: false, message: "Otp verification failed" };
            }
            const signup = yield this.userRepository.signup(userData);
            if (!signup.created) {
                return { success: false, message: "Signup failed, try again" };
            }
            console.log("This is the response of signup: ", signup);
            const payload = {
                roleId: signup.user.id,
                email: signup.user.email,
                role: 'user'
            };
            const acessToken = this.jwtServices.generateToken(payload, { expiresIn: "1h" });
            const refreshToken = this.jwtServices.generateRefreshToken(payload, { expiresIn: "1d" });
            return {
                user: signup.user,
                success: true,
                message: "Signup successful",
                acessToken: acessToken,
                refreshToken: refreshToken,
            };
        });
    }
    login(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(userData);
            const response = yield this.userRepository.login(userData);
            console.log("This is the response from interctor : ", response);
            if (!response.success) {
                if (response.message === "wrong email") {
                    return response;
                }
                if (response.message === "wrong password") {
                    return response;
                }
            }
            const payload = {
                roleId: (_a = response.user) === null || _a === void 0 ? void 0 : _a.id,
                email: (_b = response.user) === null || _b === void 0 ? void 0 : _b.email,
                role: 'user'
            };
            console.log("This is the payload of login: ", payload);
            const acessToken = this.jwtServices.generateToken(payload, { expiresIn: '1h' });
            const refreshToken = this.jwtServices.generateRefreshToken(payload, { expiresIn: '1d' });
            return { user: response.user, success: response.success, message: response.message, accesToken: acessToken, refreshToken: refreshToken };
        });
    }
}
exports.default = UserAuthInteractor;

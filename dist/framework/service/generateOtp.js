"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateRandomOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp + '';
}
exports.default = generateRandomOTP;

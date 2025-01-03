"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtServices {
    constructor(jwtAccessKey, RefreshKey) {
        this.jwtAccessKey = jwtAccessKey;
        this.RefreshKey = RefreshKey;
    }
    generateToken(payload, options) {
        return jsonwebtoken_1.default.sign(payload, this.jwtAccessKey, options);
    }
    generateRefreshToken(payload, options) {
        return jsonwebtoken_1.default.sign(payload, this.RefreshKey, options);
    }
    verifyjwt(refreshToken) {
        try {
            const decodedPayload = jsonwebtoken_1.default.verify(refreshToken, this.RefreshKey);
            if (!decodedPayload || !decodedPayload.username) {
                throw new Error('Invalid payload in refresh token');
            }
            const newAccessToken = jsonwebtoken_1.default.sign({ username: decodedPayload.username }, this.jwtAccessKey, { expiresIn: '15m' });
            return { success: true, newAccessToken };
        }
        catch (error) {
            return { success: false, error: error instanceof Error ? error.message : 'Invalid refresh token' };
        }
    }
}
exports.default = JwtServices;

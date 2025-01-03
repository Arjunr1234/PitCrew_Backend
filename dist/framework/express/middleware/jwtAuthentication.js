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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = __importDefault(require("../../mongoose/model/userSchema"));
const providerSchema_1 = __importDefault(require("../../mongoose/model/providerSchema"));
const statusCodes_1 = __importDefault(require("../../../entities/rules/statusCodes"));
const refreshAccessToken = (refreshToken) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        const newAccessToken = jsonwebtoken_1.default.sign({ roleId: decoded.roleId, role: decoded.role }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '1h' });
        return newAccessToken;
    }
    catch (error) {
        console.error("Error refreshing access token:", error);
        return null;
    }
};
const isUserBlocked = (roleId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userSchema_1.default.findById(roleId).select("blocked");
    return user ? user.blocked : false;
});
const isProviderBlocked = (roleId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Entered into isProviderBlocked://////////////////////////////////////////////////////////////// ");
    const provider = yield providerSchema_1.default.findById(roleId);
    console.log("This is the roleId: ", roleId);
    console.log("This is the status providerBlocked: ", provider);
    return provider ? provider.blocked : false;
});
const verification = (type) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[`${type}AccessToken`];
            if (!accessToken) {
                const refreshToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b[`${type}RefreshToken`];
                if (refreshToken) {
                    const newAccessToken = refreshAccessToken(refreshToken);
                    if (newAccessToken) {
                        res.cookie(`${type}AccessToken`, newAccessToken, {
                            httpOnly: true,
                            sameSite: "strict",
                            path: "/",
                            maxAge: 30 * 60 * 1000,
                        });
                        const decodedToken = jsonwebtoken_1.default.decode(newAccessToken);
                        req.body.roleId = decodedToken.roleId;
                        req.body.role = decodedToken.role;
                        console.log("Role ID from middleware (refresh token flow):", decodedToken.roleId);
                        const isBlocked = type === "user"
                            ? yield isUserBlocked(decodedToken.roleId)
                            : yield isProviderBlocked(decodedToken.roleId);
                        ///////////////////////////////////////////////////////////////// new ////////////////////////////////
                        if (decodedToken.role !== type) {
                            res.status(statusCodes_1.default.UNAUTHORIZED).json({ success: false, message: "Role is mismatching" });
                            return;
                        }
                        /////////////////////////////////////////////////////////////////////////////////////////////////////////
                        if (isBlocked) {
                            res.status(403).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} is blocked.`, role: type });
                            return;
                        }
                        return next();
                    }
                    else {
                        res.status(401).json({ message: "Invalid refresh token.", role: type });
                        return;
                    }
                }
                res.status(401).json({ message: "Access token and refresh token missing.", role: type });
                return;
            }
            jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_KEY, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                if (err) {
                    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a[`${type}RefreshToken`];
                    if (refreshToken) {
                        const newAccessToken = refreshAccessToken(refreshToken);
                        if (newAccessToken) {
                            res.cookie(`${type}AccessToken`, newAccessToken, {
                                httpOnly: true,
                                sameSite: "strict",
                                path: "/",
                                maxAge: 30 * 60 * 1000,
                            });
                            const decodedToken = jsonwebtoken_1.default.decode(newAccessToken);
                            req.body.roleId = decodedToken.roleId;
                            req.body.role = decodedToken.role;
                            console.log("Role ID from middleware (new access token flow):", decodedToken.roleId);
                            const isBlocked = type === "user"
                                ? yield isUserBlocked(decodedToken.roleId)
                                : yield isProviderBlocked(decodedToken.roleId);
                            console.log("Thi sis BBBBBBBlocked: ", isBlocked);
                            if (isBlocked) {
                                res.status(403).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} is blocked.`, role: type });
                                return;
                            }
                            return next();
                        }
                        else {
                            return res.status(401).json({ message: "Invalid refresh token.", role: type });
                        }
                    }
                    return res.status(401).json({ message: "Access token expired and refresh token missing.", role: type });
                }
                const decodedPayload = decoded;
                if (decodedPayload.role !== type) {
                    return res.status(403).json({ message: `Access denied for role: ${decodedPayload.role}`, role: decodedPayload.role });
                }
                req.body.roleId = decodedPayload.roleId;
                req.body.role = decodedPayload.role;
                console.log("Role ID from middleware (access token flow):", decodedPayload.roleId);
                const isBlocked = type === "user"
                    ? yield isUserBlocked(decodedPayload.roleId)
                    : yield isProviderBlocked(decodedPayload.roleId);
                if (isBlocked) {
                    res.status(403).json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} is blocked.`, role: type });
                    return;
                }
                next();
            }));
        }
        catch (error) {
            console.error("Token verification failed:", error);
            res.status(500).json({ message: "Internal server error.", role: type });
        }
    });
};
exports.default = verification;

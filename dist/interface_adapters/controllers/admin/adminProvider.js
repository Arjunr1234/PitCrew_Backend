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
const statusCodes_1 = __importDefault(require("../../../entities/rules/statusCodes"));
class AdminProviderController {
    constructor(adminProviderInteractor) {
        this.adminProviderInteractor = adminProviderInteractor;
    }
    getPendingProviders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entered into getPendingProviders");
                const response = yield this.adminProviderInteractor.getPendingProvidersUseCase();
                if (!response.success) {
                    res.status(401).json({ success: true, message: response.message });
                }
                res.status(200).json({ success: true, message: response.message, provider: response.providers });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProviders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entered into getPendingProviders");
                const response = yield this.adminProviderInteractor.getProvidersUseCase();
                if (!response.success) {
                    res.status(401).json({ success: true, message: response.message });
                }
                res.status(200).json({ success: true, message: response.message, provider: response.providers });
            }
            catch (error) {
                next(error);
            }
        });
    }
    providerAcceptOrReject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, state, reason, providerEmail } = req.body;
            try {
                const data = {
                    id, state, reason, providerEmail
                };
                if (state === false) {
                    if (!id || !reason || !providerEmail) {
                        res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide the necessary data" });
                        return;
                    }
                }
                console.log("This is data: ", data);
                const response = yield this.adminProviderInteractor.providerAcceptAndReject(id, state, reason, providerEmail);
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                    return;
                }
                res.status(200).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    providerBlockAndUnblock(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, state } = req.body;
                const response = yield this.adminProviderInteractor.providerBlockAndUnblockUseCase(id, state);
                if (!response.success) {
                    res.status(400).json({ success: false });
                    return;
                }
                res.status(200).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = AdminProviderController;

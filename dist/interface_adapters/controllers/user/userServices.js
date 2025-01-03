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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("../../../entities/rules/statusCodes"));
class UserServiceController {
    constructor(userServiceInteractor) {
        this.userServiceInteractor = userServiceInteractor;
    }
    getAllServices(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entered into getAllservice controller ");
                const response = yield this.userServiceInteractor.getAllServiceUseCase();
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: response.message });
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, serviceData: response.serviceData });
            }
            catch (error) {
                console.log("Error in getAllserviceController: ", error);
                next(error);
            }
        });
    }
    getAllBrands(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userServiceInteractor.getAllBrandsUseCase();
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, brandData: response.brandData });
            }
            catch (error) {
                console.log("Error in getAllBrands: ", error);
                next(error);
            }
        });
    }
    findProviders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("This is the req.body fuck: ", req.body);
                const _a = req.body, { userId, role } = _a, newData = __rest(_a, ["userId", "role"]);
                const response = yield this.userServiceInteractor.findProvidersUseCase(newData);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                console.log("This is the final resonse: ", response.providersData);
                res.status(statusCodes_1.default.OK).json({ success: response.success, providersData: response.providersData });
            }
            catch (error) {
                console.log("Error in findProviders: ", error);
            }
        });
    }
    providerServiceView(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, vehicleType, serviceId } = req.body;
                if (!providerId || !vehicleType || !serviceId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provider providerId and vehicleType and serviceId" });
                    return;
                }
                const response = yield this.userServiceInteractor.providerServiceViewUseCase(providerId, vehicleType, serviceId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                }
                res.status(statusCodes_1.default.OK).json({ success: true, providerData: response.providerData });
            }
            catch (error) {
                console.log("Error in providerServiceView Page: ", error);
                next(error);
            }
        });
    }
}
exports.default = UserServiceController;

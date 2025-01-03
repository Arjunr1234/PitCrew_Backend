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
class AdminServiceController {
    constructor(AdminServiceInteractor) {
        this.AdminServiceInteractor = AdminServiceInteractor;
    }
    addServices(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { category, serviceType } = req.body;
                const data = { category, serviceType };
                const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer;
                if (!file) {
                    res.status(400).json({ success: false, message: "File not found" });
                    return;
                }
                const response = yield this.AdminServiceInteractor.addServiceUseCase(file, data);
                if (!response.success) {
                    res.status(400).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(200).json({ success: true, service: response.service });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addBrands(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { brand } = req.body;
                const response = yield this.AdminServiceInteractor.addBrandUseCase(brand);
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                    return;
                }
                res.status(201).json({ success: true, message: "Created Successfully!!", brand: response.brand });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addVehicleTypes(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { vehicleType } = req.body;
                const response = yield this.AdminServiceInteractor.addVehicleTypeUseCase(vehicleType);
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                    return;
                }
                res.status(201).json({ success: true, message: "Created successfully!!" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllBrands(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("This is the object://////////////////// ", req);
                const response = yield this.AdminServiceInteractor.getAllBrandUseCase();
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                    return;
                }
                res.status(200).json({ success: true, brand: response.brands });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteBrand(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                if (!id || typeof id !== "string") {
                    res.status(400).json({ success: false, message: "Invalid or Missing ID" });
                    return;
                }
                const response = yield this.AdminServiceInteractor.deleteBrandUseCase(id);
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                    return;
                }
                res.status(200).json({ success: true, message: "Successfully deleted" });
            }
            catch (error) {
                console.log(error);
                next(error);
            }
        });
    }
    getAllGeneralService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entered in to getAllGeneralService");
                const response = yield this.AdminServiceInteractor.getAllGeneralServiceUseCase();
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                    return;
                }
                res.status(200).json({ success: true, services: response.services });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllRoadServices(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminServiceInteractor.getAllRoadServiceUseCase();
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                    return;
                }
                res.status(200).json({ success: true, services: response.services });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                if (!id || typeof id !== 'string') {
                    res.status(400).json({ success: false, message: "ID is not found!" });
                    return;
                }
                const response = yield this.AdminServiceInteractor.deleteServiceUseCase(id);
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                    return;
                }
                res.status(200).json({ success: true, message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addSubServices(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, subService } = req.body;
                if (!id || !subService) {
                    res.status(400).json({ success: false, message: "ID and subService are required" });
                    return;
                }
                const data = { id, subService };
                const response = yield this.AdminServiceInteractor.addSubServiceUseCase(data);
                if (!response.success) {
                    res.status(400).json({ success: false, message: response.message });
                    return;
                }
                res.status(200).json({ success: true, message: response.message, subService: response.subService });
            }
            catch (error) {
                next(error);
            }
        });
    }
    removeSubService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceId = req.query.serviceId;
                const subServiceId = req.query.subServiceId;
                if (!serviceId || !subServiceId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide necessary input" });
                    return;
                }
                const response = yield this.AdminServiceInteractor.removeSubServiceUseCase(serviceId, subServiceId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: response.message });
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in removeSubService: ", error);
                next(error);
            }
        });
    }
}
exports.default = AdminServiceController;

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
class ProviderAddServiceController {
    constructor(providerAddServiceInteractor) {
        this.providerAddServiceInteractor = providerAddServiceInteractor;
    }
    getAllBrands(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entered into getAllBrands");
                const providerId = req.query.id;
                if (!providerId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Id is not found!!" });
                }
                const response = yield this.providerAddServiceInteractor.getAllBrandsUseCase(providerId);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: response.message });
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, brandData: response.brandData });
            }
            catch (error) {
                console.error("Error in getAllBrands:", error);
                next(error);
            }
        });
    }
    getAllProviderService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = req.query.id;
            const vehicleType = req.query.vehicleType;
            if (!id || !vehicleType) {
                res.status(400).json({
                    success: false,
                    message: "id and vehicle type is required"
                });
            }
            try {
                const response = yield this.providerAddServiceInteractor.getAllProviderService(id, parseInt(vehicleType));
                (_a = response.providerGeneralServiceData) === null || _a === void 0 ? void 0 : _a.forEach((item) => {
                    console.log("the data", item);
                });
                res.status(response.success ? statusCodes_1.default.OK : statusCodes_1.default.NOT_FOUND).json(response);
            }
            catch (error) {
                console.error("Error fetching provider services:", error);
                res.status(500).json({
                    success: false,
                    message: "An error occurred while fetching provider services.",
                });
                next(error);
            }
        });
    }
    addGeneralOrRoadService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entered into addGereal or raodservice");
                const { providerId, typeId, category, vehicleType } = req.body;
                console.log(req.body);
                if (!providerId || !category || !typeId || !vehicleType) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide Id" });
                }
                const data = {
                    providerId: providerId,
                    typeId,
                    category,
                    vehicleType
                };
                const response = yield this.providerAddServiceInteractor.addGeneralOrRoadServiceUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                }
                res.status(statusCodes_1.default.CREATED).json({ success: response.success, message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addBrand(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Enteed into addBrand controlller");
            try {
                const { providerId, brandId, brandName } = req.body;
                const data = {
                    providerId,
                    brandId,
                    brandName
                };
                const response = yield this.providerAddServiceInteractor.addBrandUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: true, message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    removeBrand(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.query.providerId;
                const brandId = req.query.brandId;
                if (!providerId || !brandId) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide the Id" });
                    return;
                }
                const data = {
                    providerId,
                    brandId,
                };
                const response = yield this.providerAddServiceInteractor.removeBrandUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: true, message: response.message });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addGeneralService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, category, serviceId, vehicleType } = req.body;
                if (!providerId || !category || !serviceId || !vehicleType) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide Id" });
                }
            }
            catch (error) {
                console.log("Errro in addGeneralService: ", error);
                next(error);
            }
        });
    }
    addSubType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, serviceId, newSubType } = req.body;
                const data = { providerId, serviceId, newSubType };
                const response = yield this.providerAddServiceInteractor.addSubTypeUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ succeess: false, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: true, message: response.message });
            }
            catch (error) {
                console.log("Error in addSubType: ", error);
                next(error);
            }
        });
    }
    removeSubType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Entered into removeSubType");
                const providerId = req.query.providerId;
                const serviceId = req.query.serviceId;
                const type = req.query.type;
                const vehicleType = req.query.vehicleType;
                const data = {
                    providerId,
                    serviceId,
                    type,
                    vehicleType
                };
                if (!providerId || !serviceId || !type || !vehicleType) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provider the necessary details" });
                    return;
                }
                const response = yield this.providerAddServiceInteractor.removeSubTypeUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in removeSubType: ", error);
                next(error);
            }
        });
    }
    editSubtype(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, serviceId, subType } = req.body;
                const data = { providerId, serviceId, subType };
                console.log("This is data: ", data);
                if (!providerId || !serviceId || !subType) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "Please provide the necessary data!!" });
                    return;
                }
                const response = yield this.providerAddServiceInteractor.editSubTypeUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.CREATED).json({ success: response.success, messeage: response.message });
            }
            catch (error) {
                console.log("Error in the editSubType: ", error);
                next(error);
            }
        });
    }
    removeService(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.query.providerId;
                const serviceId = req.query.serviceId;
                const vehicleType = req.query.vehicleType;
                if (!providerId || !serviceId || !vehicleType) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: false, message: "please provide the data" });
                    return;
                }
                const data = { providerId, serviceId, vehicleType };
                const response = yield this.providerAddServiceInteractor.removeServiceUseCase(data);
                if (!response.success) {
                    res.status(statusCodes_1.default.BAD_REQUEST).json({ success: response.success, message: response.message });
                    return;
                }
                res.status(statusCodes_1.default.OK).json({ success: response.success, message: response.message });
            }
            catch (error) {
                console.log("Error in removeService: ", error);
                next(error);
            }
        });
    }
}
exports.default = ProviderAddServiceController;

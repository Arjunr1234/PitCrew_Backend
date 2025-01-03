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
class AdminServiceInteractor {
    constructor(cloudinaryService, AdminServiceRepository) {
        this.cloudinaryService = cloudinaryService;
        this.AdminServiceRepository = AdminServiceRepository;
    }
    addServiceUseCase(file, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const folderName = 'service';
                const resposeImageUrl = yield this.cloudinaryService.uploadImage(file, folderName);
                const response = yield this.AdminServiceRepository.addServiceRepo(resposeImageUrl, data);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true, service: response.service };
            }
            catch (error) {
                console.log(error);
                return { success: false };
            }
        });
    }
    addBrandUseCase(brand) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminServiceRepository.addBrandRepo(brand);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true, message: "Created Successfully!!", brand: response.brand };
            }
            catch (error) {
                return { success: false, };
            }
        });
    }
    addVehicleTypeUseCase(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminServiceRepository.addVehicleTypeRepo(type);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true };
            }
            catch (error) {
                console.error("Error adding vehicle type:", error);
                return { success: false, message: "Something went wrong while adding the vehicle type." };
            }
        });
    }
    getAllBrandUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminServiceRepository.getAllBrandsRepo();
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true, brands: response.brands };
            }
            catch (error) {
                return { success: false, message: "Something went wrong in getAllBrandUseCase" };
            }
        });
    }
    deleteBrandUseCase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminServiceRepository.deleteBrandRepo(id);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "Something went wrong when deleteBrandUsecase" };
            }
        });
    }
    getAllGeneralServiceUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminServiceRepository.getAllGeneralServiceRepo();
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true, services: response.services };
            }
            catch (error) {
                console.error("Error in getAllGeneralServiceUseCase:", error);
                return { success: false, message: "Something went wrong in getAllGeneralServiceUseCase" };
            }
        });
    }
    getAllRoadServiceUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminServiceRepository.getAllRoadServicesRepo();
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true, services: response.services };
            }
            catch (error) {
                console.error("Error in getAllRoadServiceUseCase:", error);
                return { success: false, message: "Something went wrong in getAllRoadServiceUseCase" };
            }
        });
    }
    deleteServiceUseCase(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminServiceRepository.deleteServiceRepo(id);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true, message: response.message };
            }
            catch (error) {
                return { success: false, message: "An error occurred while trying to delete the service." };
            }
        });
    }
    addSubServiceUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AdminServiceRepository.addSubServiceRepo(data);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                return { success: true, message: "Successfully added!!", subService: response.subService };
            }
            catch (error) {
                console.error("Error in addSubServiceUseCase: ", error);
                return { success: false, message: "Something went wrong in addSubService UseCase" };
            }
        });
    }
    removeSubServiceUseCase(serviceId, subServiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = this.AdminServiceRepository.removeSubServiceRepo(serviceId, subServiceId);
                return response;
            }
            catch (error) {
                console.log("Error in removeSubServiceUseCase: ", error);
                return { success: false, message: "Something went wrong in removeSubServiceUseCase" };
            }
        });
    }
}
exports.default = AdminServiceInteractor;

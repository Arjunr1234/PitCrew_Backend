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
const mongoose_1 = __importDefault(require("mongoose"));
class UserServiceInteractor {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    getAllServiceUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getAllServiceRepo();
                return response;
            }
            catch (error) {
                console.log("This is the getAllServiceUseCaase: ", error);
                return { success: false, message: "Something went wrong in getAllserviceUseCase" };
            }
        });
    }
    getAllBrandsUseCase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.getAllBrandRepo();
                return response;
            }
            catch (error) {
                console.log("Error in getAllBrandUseCase: ", error);
                return { success: false, message: "Something went wrong in getAllBrandUseCase" };
            }
        });
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return parseFloat((R * c).toFixed(2));
    }
    findProvidersUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { location: { coordinates } } = data;
                const response = yield this.userRepository.findProvidersRepo(data);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                if (!response.providersData) {
                    return { success: false, message: "No matching provider found" };
                }
                const providerData = response.providersData.map((data) => (Object.assign(Object.assign({}, data), { distance: this.calculateDistance(coordinates[1], coordinates[0], data.coordinates[1], data.coordinates[0]) })));
                return { success: true, providersData: providerData };
            }
            catch (error) {
                console.log("Error in findProviderUseCase: ", error);
                return { success: false, message: "Something went wrong in findProvidersUseCase" };
            }
        });
    }
    providerServiceViewUseCase(providerId, vehicleType, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.userRepository.providerServiceViewRepo(providerId, vehicleType, serviceId);
                const providerServiceData = response.providerData;
                const serviceData = response.serviceData;
                providerServiceData.services.subType.forEach((subType) => {
                    const matchingService = serviceData.subTypes.find((serviceSubType) => serviceSubType._id.equals(new mongoose_1.default.Types.ObjectId(subType.type)));
                    if (matchingService) {
                        subType.type = matchingService.type;
                        subType.isAdded = false;
                    }
                });
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                console.log("This is that thing ////////////////: ", JSON.stringify(providerServiceData, null, 2));
                return { success: true, providerData: response.providerData, };
            }
            catch (error) {
                console.log("Error in providerServiceVeiwUseCase: ", error);
                return { success: false, message: "Something went wrong in providerServiceViewUseCase" };
            }
        });
    }
}
exports.default = UserServiceInteractor;

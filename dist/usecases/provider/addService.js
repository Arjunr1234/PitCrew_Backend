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
class ProviderAddServiceInteractor {
    constructor(AddServiceRepository) {
        this.AddServiceRepository = AddServiceRepository;
    }
    getAllProviderService(id, vehicleType) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const getProviders = yield this.AddServiceRepository.getAllProviderService(id, vehicleType);
                if (!getProviders.allServices) {
                    return {
                        success: false,
                        message: "No services found for the provider"
                    };
                }
                const providerServices = vehicleType === 2
                    ? ((_a = getProviders.providerService) === null || _a === void 0 ? void 0 : _a.twoWheeler) || []
                    : ((_b = getProviders.providerService) === null || _b === void 0 ? void 0 : _b.fourWheeler) || [];
                if (providerServices.length === 0) {
                    return yield this.organizeProviderServices(getProviders.allServices);
                }
                else {
                    return yield this.organizeProviderServicesALL(getProviders.allServices, providerServices);
                }
            }
            catch (error) {
                console.error("Error in getAllProviderService: ", error);
                return {
                    success: false,
                    message: "An error occurred while fetching provider services"
                };
            }
        });
    }
    organizeProviderServices(allServices) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const providerGeneralService = [];
            const providerRoadService = [];
            if (allServices) {
                for (const service of allServices) {
                    if (service.category === 'general') {
                        const generalService = {
                            typeid: service._id,
                            typename: service.serviceType,
                            category: service.category,
                            image: service.imageUrl,
                            isAdded: false,
                            subType: ((_a = service.subTypes) === null || _a === void 0 ? void 0 : _a.map((item) => ({
                                isAdded: false,
                                type: item.type,
                                _id: item._id
                            }))) || []
                        };
                        providerGeneralService.push(generalService);
                    }
                    else if (service.category === 'road') {
                        const roadService = {
                            typeid: service._id,
                            typename: service.serviceType,
                            category: service.category,
                            image: service.imageUrl,
                            isAdded: false,
                        };
                        providerRoadService.push(roadService);
                    }
                }
            }
            return {
                success: true,
                message: "200",
                providerGeneralServiceData: providerGeneralService,
                providerRoadServiceData: providerRoadService
            };
        });
    }
    organizeProviderServicesALL(allServices, providerServices) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log("this si the adminService://////////////////////////////////////////////////", allServices);
            const result = providerServices.find((service) => service.typeId + "" === "671a48d7b99677956e7caee4");
            console.log("////////////////////////////////////////////: ", result);
            console.log("This is the providerServices:  /////////////////////////////////////////////////////////////", providerServices);
            const providerGeneralService = [];
            const providerRoadService = [];
            if (allServices && providerServices) {
                for (let service of allServices) {
                    if (service.category === "general") {
                        const checker = providerServices.find((item) => item.typeId + "" === service._id + "");
                        if (checker) {
                            const generalService = {
                                typeid: service._id,
                                typename: service.serviceType,
                                category: service.category,
                                image: service.imageUrl,
                                isAdded: true,
                                subType: ((_a = service.subTypes) === null || _a === void 0 ? void 0 : _a.map((item) => {
                                    var _a, _b, _c, _d;
                                    return ({
                                        isAdded: (_a = checker.subType) === null || _a === void 0 ? void 0 : _a.some((sub) => sub.type + "" === item._id + ""),
                                        priceRange: (_d = (_c = (_b = checker.subType) === null || _b === void 0 ? void 0 : _b.find((sub) => sub.type + "" === item._id + "")) === null || _c === void 0 ? void 0 : _c.startingPrice) !== null && _d !== void 0 ? _d : undefined,
                                        type: item.type,
                                        _id: item._id
                                    });
                                })) || []
                            };
                            providerGeneralService.push(generalService);
                        }
                        else {
                            const generalService = {
                                typeid: service._id,
                                typename: service.serviceType,
                                category: service.category,
                                image: service.imageUrl,
                                isAdded: false,
                                subType: ((_b = service.subTypes) === null || _b === void 0 ? void 0 : _b.map((item) => ({
                                    isAdded: false,
                                    type: item.type,
                                    _id: item._id,
                                    priceRange: undefined
                                }))) || []
                            };
                            providerGeneralService.push(generalService);
                        }
                    }
                    else if (service.category === "road") {
                        const checker = providerServices.find((item) => item.typeId + "" === service._id);
                        if (checker) {
                            const roadService = {
                                typeid: service._id,
                                image: service.imageUrl,
                                typename: service.serviceType,
                                category: service.category,
                                isAdded: true
                            };
                            providerRoadService.push(roadService);
                        }
                        else {
                            const roadService = {
                                typeid: service._id,
                                image: service.imageUrl,
                                typename: service.serviceType,
                                category: service.category,
                                isAdded: false
                            };
                            providerRoadService.push(roadService);
                        }
                    }
                }
            }
            return {
                success: true,
                message: "successfull",
                providerGeneralServiceData: providerGeneralService,
                providerRoadServiceData: providerRoadService
            };
        });
    }
    addGeneralOrRoadServiceUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AddServiceRepository.addGeneralOrRoadService(data);
                if (!response.success) {
                    return { success: response.success, message: response.message };
                }
                return { success: response.success, message: response.message };
            }
            catch (error) {
                console.log("Error in addGeneralOr");
                return { success: false, message: "something went wrong in addGeneralOrRoadService" };
            }
        });
    }
    getAllBrandsUseCase(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AddServiceRepository.getAllBrandsRepo(providerId);
                if (!response.success) {
                    return { success: false, message: response.message };
                }
                if (!response.adminBrand) {
                    return { success: false, message: "Admin brands not found" };
                }
                // Organize the admin and provider brands
                const adminBrandWithStatus = yield this.organizeBrand(response.adminBrand, response.providerBrand || []);
                // Map to IBrand[] and return
                const brandData = adminBrandWithStatus.map((brand) => ({
                    brandId: brand.id, // Mapping `id` as `brandId`
                    brandName: brand.brand, // Mapping `brand` as `brandName`
                    isAdded: brand.isAdded // Retaining the `isAdded` status
                }));
                return { success: true, brandData };
            }
            catch (error) {
                console.error(error);
                return { success: false, message: "An error occurred", brandData: [] };
            }
        });
    }
    organizeBrand(adminBrand, providerBrand) {
        return __awaiter(this, void 0, void 0, function* () {
            return adminBrand.map((admin) => {
                const isAdded = providerBrand.some((provider) => provider.brandId === admin.id);
                return Object.assign(Object.assign({}, admin), { isAdded });
            });
        });
    }
    addBrandUseCase(brandData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AddServiceRepository.addBrandRepo(brandData);
                return { success: response.success, message: response.message };
            }
            catch (error) {
                console.log("Error in addBrandUseCase: ", error);
                return { success: false, message: "Something went wrong in addBrandUseCase" };
            }
        });
    }
    removeBrandUseCase(brandData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AddServiceRepository.removeBrandRepo(brandData);
                return { success: response.success, message: response.message };
            }
            catch (error) {
                console.log("Error in removeBrandUseCase: ", error);
                return { success: false, message: "Somethng went wrong in removeBrandusecase" };
            }
        });
    }
    addSubTypeUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = this.AddServiceRepository.addSubTypeRepo(data);
                return response;
            }
            catch (error) {
                console.log("Error in addSubTypeUseCase: ", error);
                return { success: false, message: "Something went wrong in addSubTypeUseCase" };
            }
        });
    }
    removeSubTypeUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AddServiceRepository.removeSubTypeRepo(data);
                return { success: response.success, message: response.message };
            }
            catch (error) {
                console.log("Error in removeSubTypeUseCase: ", error);
                return { success: false, message: "something went wrong in removeSubTypeUseCase" };
            }
        });
    }
    editSubTypeUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AddServiceRepository.editSubTypeRepo(data);
                return response;
            }
            catch (error) {
                console.log("Error in editSubTypeUseCase: ", error);
                return { success: false, message: "Something went wrong in EditSubTypeRepo" };
            }
        });
    }
    removeServiceUseCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.AddServiceRepository.removeServiceRepo(data);
                return response;
            }
            catch (error) {
                console.log("Error in removeServiceUseCase: ", error);
                return { success: false, message: "Something went wrong in removeServiceUseCase" };
            }
        });
    }
}
exports.default = ProviderAddServiceInteractor;

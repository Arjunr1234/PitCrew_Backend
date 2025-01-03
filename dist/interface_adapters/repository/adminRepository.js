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
const express_1 = require("express");
const adminSchema_1 = __importDefault(require("../../framework/mongoose/model/adminSchema"));
const providerSchema_1 = __importDefault(require("../../framework/mongoose/model/providerSchema"));
const userSchema_1 = __importDefault(require("../../framework/mongoose/model/userSchema"));
const serviceSchema_1 = __importDefault(require("../../framework/mongoose/model/serviceSchema"));
const brandSchema_1 = __importDefault(require("../../framework/mongoose/model/brandSchema"));
const vehicleTypeSchema_1 = __importDefault(require("../../framework/mongoose/model/vehicleTypeSchema"));
const providerServiceSchema_1 = __importDefault(require("../../framework/mongoose/model/providerServiceSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const BookingSchema_1 = __importDefault(require("../../framework/mongoose/model/BookingSchema"));
class AdminRepository {
    loginRepo(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = loginData;
            const loginResponse = yield adminSchema_1.default.findOne({
                email
            });
            if (!loginResponse) {
                return { success: false, message: "userNotExists" };
            }
            if (loginResponse.password !== password) {
                return { success: false, message: "incorrectPassword" };
            }
            const adminD = {
                _id: loginResponse._id.toString(),
                email: loginResponse.email,
            };
            return { success: true, adminData: adminD };
        });
    }
    getUsersRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersData = yield userSchema_1.default.find({}).sort({ _id: -1 });
                if (!usersData) {
                    return { success: true, users: [] };
                }
                const [{ active, blocked }] = yield userSchema_1.default.aggregate([{
                        $group: {
                            _id: null,
                            active: { $sum: { $cond: [{ $eq: ["$blocked", false] }, 1, 0] } },
                            blocked: { $sum: { $cond: [{ $eq: ["$blocked", true] }, 1, 0] } }
                        }
                    }]);
                const updatedUsers = usersData.map((user) => ({
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    blocked: user.blocked
                }));
                console.log("This is the active and blocked Users In repo: ", active, blocked);
                return { success: true, users: updatedUsers, active: active, blocked: blocked };
            }
            catch (error) {
                console.log(error);
                return { success: false, users: [] };
            }
        });
    }
    adminBlockUnblockUser(id, state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Blocking/Unblocking user with id: ', id);
                const blockResponse = yield userSchema_1.default.findByIdAndUpdate(id, { $set: { blocked: state } });
                console.log("This is the blockResponse: ", blockResponse);
                if (!blockResponse) {
                    return { success: false, message: "User not found" };
                }
                return { success: true, message: state ? "User blocked successfully" : "User unblocked successfully" };
            }
            catch (error) {
                console.log('Error in block/unblock operation: ', error);
                return { success: false, message: "An error occurred while updating the user state" };
            }
        });
    }
    getPendingProvidersRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield providerSchema_1.default.aggregate([
                    {
                        $match: {
                            requestAccept: false,
                        }
                    },
                    { $sort: { _id: -1 } },
                    {
                        $project: {
                            _id: 1,
                            workshopName: 1,
                            ownerName: 1,
                            mobile: 1,
                            email: 1,
                            workshopDetails: 1,
                            blocked: 1,
                            requestAccept: 1
                        }
                    }
                ]);
                console.log("This si the peiding provider; ", provider);
                if (!provider) {
                    return { success: false, providers: [] };
                }
                return { success: true, providers: provider };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "something wrong happend" };
            }
        });
    }
    getProvidersRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield providerSchema_1.default.aggregate([
                    {
                        $match: {
                            requestAccept: true
                        }
                    },
                    { $sort: { _id: -1 } },
                    {
                        $project: {
                            _id: 1,
                            workshopName: 1,
                            ownerName: 1,
                            mobile: 1,
                            email: 1,
                            workshopDetails: 1,
                            blocked: 1,
                            requestAccept: 1
                        }
                    }
                ]);
                if (!provider) {
                    return { success: false, providers: [] };
                }
                return { success: true, providers: provider };
            }
            catch (error) {
                console.log(error);
                return { success: false, message: "something wrong happend" };
            }
        });
    }
    providerAcceptOrRejectRepo(id, state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield providerSchema_1.default.findByIdAndUpdate(id, { $set: { requestAccept: state } });
                console.log("response", response);
                if (state === null) {
                    const changeisRejectedStatus = yield providerSchema_1.default.findByIdAndUpdate(id, { $set: { isRejected: true } }); // just updating the is rejected status
                }
                if (!response) {
                    return { success: false };
                }
                // if admin accepiting the request automatically creating a providerservice collection
                if (state === true) {
                    const createProviderService = yield providerServiceSchema_1.default.create({
                        workshopId: response._id,
                        twoWheeler: [],
                        fourWheeler: []
                    });
                    if (!createProviderService) {
                        return { success: false, message: 'Failed to create provider service' };
                    }
                }
                return { success: true };
            }
            catch (error) {
                return { success: false, message: "something error happend!!" };
            }
        });
    }
    providerBlockAndUnblockUseCase(id, state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const repsonse = yield providerSchema_1.default.findByIdAndUpdate(id, { $set: { blocked: state } });
                if (!express_1.response) {
                    return { success: false };
                }
                return { success: true };
            }
            catch (error) {
                return { success: false };
            }
        });
    }
    addServiceRepo(image, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, serviceType } = data;
                const findService = yield serviceSchema_1.default.findOne({ serviceType: new RegExp(`^${serviceType}$`, 'i') });
                if (findService) {
                    return { success: false, message: "Service already exists!!" };
                }
                const createService = yield serviceSchema_1.default.create({
                    imageUrl: image,
                    category: category,
                    serviceType: serviceType,
                });
                if (!createService) {
                    return { success: false, message: "Data is not added" };
                }
                const service = {
                    _id: createService._id.toString(),
                    category: createService.category,
                    serviceTypes: createService.serviceType,
                    imageUrl: createService.imageUrl,
                    subTypes: createService.subTypes
                };
                return { success: true, service: service };
            }
            catch (error) {
                return { success: false, message: "Some error occured in add service" };
            }
        });
    }
    addBrandRepo(brand) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findBrand = yield brandSchema_1.default.findOne({ brand: new RegExp(`^${brand}$`, 'i') });
                if (findBrand) {
                    return { success: false, message: "Brand already exists!!" };
                }
                const createBrand = yield brandSchema_1.default.create({ brand });
                console.log("Create Brand: ", createBrand);
                const brandData = {
                    _id: createBrand._id + "",
                    brand: createBrand.brand,
                };
                if (!createBrand) {
                    return { success: false, message: "Failed to add brand" };
                }
                return { success: true, message: "Brand added successfully", brand: brandData };
            }
            catch (error) {
                console.error("Error adding brand:", error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    addVehicleTypeRepo(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findType = yield vehicleTypeSchema_1.default.findOne({ vehicleType: type });
                if (findType) {
                    return { success: false, message: "Type already exists!!" };
                }
                const createType = yield vehicleTypeSchema_1.default.create({ vehicleType: type });
                if (!createType) {
                    return { success: false, message: "Failed to create type!!" };
                }
                return { success: true };
            }
            catch (error) {
                console.error("Error in repo: ", error);
                return { success: false, message: "something went wrong" };
            }
        });
    }
    getAllBrandsRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield brandSchema_1.default.find({});
                const brandData = response.map(brand => ({
                    _id: brand._id + "",
                    brand: brand.brand,
                }));
                if (!response) {
                    return { success: false, message: "Couldn't find Brands" };
                }
                return { success: true, brands: brandData };
            }
            catch (error) {
                return { success: false, message: "Something went wrong in getAllBrandsRepo" };
            }
        });
    }
    deleteBrandRepo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteBrand = yield brandSchema_1.default.deleteOne({ _id: id });
                if (!deleteBrand) {
                    return { success: false, message: "An issue occured during delete" };
                }
                return { success: true, };
            }
            catch (error) {
                return { success: false, message: "Something went wrong in deletBrand" };
                console.log(error);
            }
        });
    }
    getAllGeneralServiceRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getGeneralServices = yield serviceSchema_1.default.find({ category: 'general' });
                if (!getGeneralServices || getGeneralServices.length === 0) {
                    return { success: false, message: "Cannot find the general services", services: [] };
                }
                const services = getGeneralServices.map((service) => ({
                    _id: service._id.toString(),
                    category: service.category,
                    serviceTypes: service.serviceType,
                    imageUrl: service.imageUrl,
                    subTypes: service.subTypes || []
                }));
                return { success: true, services };
            }
            catch (error) {
                console.error("Error fetching general services: ", error);
                return { success: false, message: "An error occurred while fetching services", services: [] };
            }
        });
    }
    getAllRoadServicesRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllRoadService = yield serviceSchema_1.default.find({ category: "road" });
                if (!getAllRoadService || getAllRoadService.length === 0) {
                    return { success: false, message: "Couldn't find Road services", services: [] };
                }
                const services = getAllRoadService.map(service => ({
                    _id: service._id.toString(),
                    category: service.category,
                    serviceTypes: service.serviceType,
                    imageUrl: service.imageUrl,
                    subTypes: service.subTypes || []
                }));
                return { success: true, services };
            }
            catch (error) {
                console.error("Error fetching road services:", error);
                return { success: false, message: "An error occurred while fetching road services", services: [] };
            }
        });
    }
    deleteServiceRepo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteService = yield serviceSchema_1.default.deleteOne({ _id: id });
                if (deleteService.deletedCount === 0) {
                    return { success: false, message: "Failed to delete service. Service not found." };
                }
                return { success: true, message: "Successfully deleted" };
            }
            catch (error) {
                return { success: false, message: "An error occurred while deleting the service." };
            }
        });
    }
    addSubServiceRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, subService } = data;
                console.log("This si subService: ", subService);
                if (!id || !subService) {
                    return { success: false, message: "Invalid data provided" };
                }
                console.log("Thhhhhhhhhhhhhhhhhhhhhhhhis is the subservice: ");
                const checkExist = yield serviceSchema_1.default.findOne({
                    _id: id,
                    'subTypes.type': { $regex: new RegExp(`^${subService}$`, 'i') },
                });
                console.log("This is check exist: ", checkExist);
                if (checkExist) {
                    return { success: false, message: "Service already exists" };
                }
                const addSubService = yield serviceSchema_1.default.findByIdAndUpdate(id, { $push: { subTypes: { type: subService } } }, { new: true });
                console.log("This is the addSubServiceRepo: ", addSubService);
                if (!addSubService) {
                    return { success: false, message: "Failed to add service!!" };
                }
                const newSubService = addSubService.subTypes[addSubService.subTypes.length - 1];
                const subSerivceData = {
                    _id: newSubService._id,
                    type: newSubService.type
                };
                return { success: true, subService: subSerivceData };
            }
            catch (error) {
                console.error("Error in addSubServiceRepo: ", error);
                return { success: false, message: "An error occurred while adding the sub-service." };
            }
        });
    }
    removeSubServiceRepo(serviceId, subServiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const removeSubService = yield serviceSchema_1.default.updateOne({ _id: serviceId }, { $pull: { subTypes: { _id: new mongoose_1.default.Types.ObjectId(subServiceId) } } });
                if (removeSubService.modifiedCount === 0) {
                    return { success: false, message: "Sub-Service not found or already removed." };
                }
                return { success: true, message: "Sub-Service removed successfully." };
            }
            catch (error) {
                console.log("Error in removeSubService: ", error);
                return { success: false, message: "something went wrong in removeSubServiceRepo" };
            }
        });
    }
    getAllBookingsRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = yield BookingSchema_1.default.aggregate([
                    {
                        $match: {}
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userDetails"
                        }
                    },
                    {
                        $unwind: "$userDetails"
                    },
                    {
                        $lookup: {
                            from: "providers",
                            localField: "providerId",
                            foreignField: "_id",
                            as: "providerDetails"
                        }
                    },
                    {
                        $unwind: "$providerDetails"
                    },
                    {
                        $lookup: {
                            from: "services",
                            localField: "serviceId",
                            foreignField: "_id",
                            as: "serviceDetails"
                        }
                    },
                    {
                        $unwind: "$serviceDetails"
                    },
                    {
                        $project: {
                            _id: 1,
                            serviceType: 1,
                            userId: 1,
                            providerId: 1,
                            slotId: 1,
                            serviceId: 1,
                            vehicleDetails: 1,
                            location: 1,
                            bookingDate: 1,
                            amount: 1,
                            platformFee: 1,
                            subTotal: 1,
                            paymentId: 1,
                            reason: 1,
                            status: 1,
                            serviceName: "$serviceDetails.serviceType",
                            selectedSubServices: 1,
                            userDetails: {
                                name: 1,
                                phone: 1,
                                email: 1,
                                imageUrl: 1
                            },
                            providerDetails: {
                                workshopName: 1,
                                ownerName: 1,
                                email: 1,
                                mobile: 1,
                                workshopDetails: 1,
                                logoUrl: 1
                            }
                        }
                    }
                ]);
                if (!bookingData) {
                    return { success: false, message: "Failed to fetch the bookings" };
                }
                //console.log("Thsi is the data: ", bookingData)
                return { success: true, bookingData: bookingData };
            }
            catch (error) {
                console.log("Error in getAllBookingsRepo: ", error);
                return { success: false, message: "Something went wrong in getAllBookingsRepo" };
            }
        });
    }
    getDashboardDetailsRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userSchema_1.default.countDocuments({});
                const providers = yield providerSchema_1.default.countDocuments({});
                const bookings = yield BookingSchema_1.default.find({});
                const revenue = bookings.reduce((sum, booking) => sum + booking.platformFee, 0);
                const statusDetails = yield BookingSchema_1.default.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            status: "$_id",
                            count: 1
                        }
                    }
                ]);
                const lineData = yield BookingSchema_1.default.aggregate([
                    {
                        $group: {
                            _id: { month: { $month: "$bookingDate" } },
                            totalRevenue: { $sum: "$platformFee" },
                            bookingCount: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            name: {
                                $arrayElemAt: [
                                    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                    { $subtract: ["$_id.month", 1] }
                                ]
                            },
                            revenue: "$totalRevenue",
                            bookings: "$bookingCount"
                        }
                    },
                    {
                        $sort: { name: 1 }
                    }
                ]);
                //console.log(lineData);
                // console.log("This is the users count: ", users);
                // console.log("This is the providers count: ", providers);
                // console.log("This is the totalRevenue; ", revenue);
                // console.log("This is the status Details: ", statusDetails);
                // console.log("This is the lineData: ", lineData)
                const dashboardData = {
                    users,
                    providers,
                    revenue,
                    statusDetails,
                    lineData
                };
                return { success: true, dashboradData: dashboardData };
            }
            catch (error) {
                console.log("Error in getDashboradDetailsRepo: ", error);
                return { success: false, message: "Something went wrong in getDashboardDetailsRepo " };
            }
        });
    }
}
exports.default = AdminRepository;

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
const providerSchema_1 = __importDefault(require("../../framework/mongoose/model/providerSchema"));
const otpSchema_1 = __importDefault(require("../../framework/mongoose/model/otpSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const serviceSchema_1 = __importDefault(require("../../framework/mongoose/model/serviceSchema"));
const brandSchema_1 = __importDefault(require("../../framework/mongoose/model/brandSchema"));
const providerServiceSchema_1 = __importDefault(require("../../framework/mongoose/model/providerServiceSchema"));
const vehicleTypeSchema_1 = __importDefault(require("../../framework/mongoose/model/vehicleTypeSchema"));
const BookingSlotSchema_1 = __importDefault(require("../../framework/mongoose/model/BookingSlotSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const BookingSchema_1 = __importDefault(require("../../framework/mongoose/model/BookingSchema"));
class ProviderRepository {
    providerExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findProvider = yield providerSchema_1.default.findOne({ email });
                if (findProvider) {
                    return { success: false, message: "User already exists!" };
                }
                return { success: true };
            }
            catch (error) {
                throw new Error("Error checking provider existence");
            }
        });
    }
    saveOtp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storeOtp = yield otpSchema_1.default.create({ email, otp });
                return { success: true };
            }
            catch (error) {
                throw new Error("Error saving OTP");
            }
        });
    }
    getOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkOtp = yield otpSchema_1.default.findOne({ email, otp });
            console.log("This is the response: ", checkOtp);
            if (!checkOtp) {
                return { success: false, otp: '' };
            }
            return { success: true, otp: checkOtp.otp };
        });
    }
    createProvider(providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saltRounds = 10;
                const { workshopName, workshopDetails, ownerName, email, mobile, password } = providerData;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                const providerRegisterData = {
                    workshopName,
                    ownerName,
                    email,
                    password: hashedPassword,
                    mobile,
                    workshopDetails: {
                        address: workshopDetails.address,
                        location: {
                            type: "Point",
                            coordinates: [workshopDetails.coordinates.long, workshopDetails.coordinates.lat],
                        },
                    },
                };
                const providerCreated = yield providerSchema_1.default.create(providerRegisterData);
                if (!providerCreated) {
                    return { success: false, message: 'Provider creation failed' };
                }
                return { success: true };
            }
            catch (error) {
                console.error("Error in createProvider:", error);
                return { success: false, message: 'An error occurred during provider creation' };
            }
        });
    }
    loginRepo(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = loginData;
                console.log("Entered into loginRepo");
                const loginResponse = yield providerSchema_1.default.findOne({ email: email });
                if (!loginResponse) {
                    return { success: false, message: "Wrong email" };
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, loginResponse.password);
                if (loginResponse.requestAccept === null) {
                    return { success: false, message: "rejected" };
                }
                if (!loginResponse.requestAccept) {
                    return { success: false, message: "pending" };
                }
                if (loginResponse.blocked) {
                    return { success: false, message: "blocked" };
                }
                if (!passwordMatch) {
                    return { success: false, message: "Wrong password" };
                }
                console.log("This is the providerResponse: ", loginResponse);
                const loginResponseObject = loginResponse.toObject();
                const { password: hashedPassword } = loginResponseObject, remainResponse = __rest(loginResponseObject, ["password"]);
                const providerData = Object.assign(Object.assign({}, remainResponse), { _id: loginResponseObject._id.toString() });
                return { success: true, provider: providerData };
            }
            catch (error) {
                console.log("Error in loginRepo:", error);
                return { success: false, message: "An error occurred during login" };
            }
        });
    }
    getAllProviderService(id, vehicleType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findedAllAdminService = yield serviceSchema_1.default.find().lean();
                const providerData = yield providerServiceSchema_1.default.findOne({ workshopId: id });
                const services = findedAllAdminService.map((service) => (Object.assign(Object.assign({}, service), { _id: service._id.toString() })));
                return {
                    success: true,
                    message: "200",
                    providerService: providerData,
                    allServices: services,
                };
            }
            catch (error) {
                console.log("Error in getallproviderService: ", error);
                return { success: false, message: "something went to wrong getallProviderService" };
            }
        });
    }
    addGeneralOrRoadService(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, category, typeId, vehicleType } = data;
                console.log("This is the data: ", data);
                const serviceData = {
                    typeId,
                    category,
                    subType: []
                };
                const vehicle = yield vehicleTypeSchema_1.default.findOne({
                    _id: vehicleType
                });
                if ((vehicle === null || vehicle === void 0 ? void 0 : vehicle.vehicleType) === 2) {
                    const provider = yield providerServiceSchema_1.default.findOne({
                        workshopId: providerId,
                        "twoWheeler.typeId": typeId
                    });
                    if (provider) {
                        const updateService = yield providerServiceSchema_1.default.findOneAndUpdate({ workshopId: providerId, "twoWheeler.typeId": typeId }, {
                            $push: { "twoWheeler.$": serviceData },
                        }, { new: true });
                        return {
                            success: true,
                            message: "Two-wheeler service updated successfully",
                        };
                        console.log("update ", updateService);
                    }
                    else {
                        const createdProvider = yield providerServiceSchema_1.default.findOneAndUpdate({ workshopId: providerId }, {
                            $push: {
                                twoWheeler: serviceData,
                            },
                        }, { new: true, upsert: true });
                        return {
                            success: true,
                            message: " Two-wheeler service created successfully",
                        };
                        console.log("created provider", createdProvider);
                    }
                }
                else {
                    // four wheller
                    const provider = yield providerServiceSchema_1.default.findOne({
                        workshopId: providerId,
                        "fourWheeler.typeId": typeId
                    });
                    if (provider) {
                        const updateService = yield providerServiceSchema_1.default.findOneAndUpdate({ workshopId: providerId, "fourWheeler.typeId": typeId }, {
                            $push: { "fourWheeler.$": serviceData },
                        }, { new: true });
                        return {
                            success: true,
                            message: "Four wheeler service added successfully",
                        };
                    }
                    else {
                        const createProvider = yield providerServiceSchema_1.default.findOneAndUpdate({ workshopId: providerId }, {
                            $push: {
                                fourWheeler: serviceData,
                            },
                        }, { new: true, upsert: true });
                        return {
                            success: true,
                            message: "New four wheeler service created successfully",
                        };
                    }
                }
                return { success: true };
            }
            catch (error) {
                console.log("Error occured in addingGeneralOrRoadService: ", error);
                return { success: false, message: "Something went wrong in addGeneralOrRoadServiceRepo" };
            }
        });
    }
    getAllBrandsRepo(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const findadminBrand = yield brandSchema_1.default.find({});
                const provider = yield providerSchema_1.default.findOne({ _id: providerId }, { _id: 0, supportedBrands: 1 });
                const adminBrand = findadminBrand.map((brand) => ({
                    id: brand._id.toString(),
                    brand: brand.brand
                }));
                const providerBrand = ((_a = provider === null || provider === void 0 ? void 0 : provider.supportedBrands) === null || _a === void 0 ? void 0 : _a.length)
                    ? provider.supportedBrands.map((brand) => ({
                        brandId: brand.brandId,
                        brandName: brand.brandName
                    }))
                    : [];
                return {
                    success: true,
                    message: "successful",
                    adminBrand,
                    providerBrand
                };
            }
            catch (error) {
                console.error("Error in getAllBrandsRepo:", error);
                return {
                    success: false,
                    adminBrand: [],
                    providerBrand: [],
                    message: "An error occurred"
                };
            }
        });
    }
    addBrandRepo(brandData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { brandId, brandName, providerId } = brandData;
            try {
                if (!brandId || !brandName || !providerId) {
                    return { success: false, message: "please provide Id" };
                }
                const existingProvider = yield providerSchema_1.default.findOne({
                    _id: providerId,
                    "supportedBrands.brandId": brandId
                });
                // If the brandId exists, return false with a message
                if (existingProvider) {
                    return { success: false, message: "Brand already exists in supportedBrands" };
                }
                const response = yield providerSchema_1.default.findByIdAndUpdate(providerId, {
                    $push: { supportedBrands: { brandId, brandName } }
                }, { new: true });
                if (!response) {
                    return { success: false, message: "Failed to add Brand" };
                }
                return { success: true, message: "Brand added successfully!!" };
            }
            catch (error) {
                console.log("Error in addBrandRepo: ", error);
                return { success: false, message: "something went wrong in addBrandRepo" };
            }
        });
    }
    removeBrandRepo(brandData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { brandId, providerId } = brandData;
                if (!brandId || !providerId) {
                    return { success: false, message: "No avaliable information updation" };
                }
                const response = yield providerSchema_1.default.findByIdAndUpdate(providerId, {
                    $pull: { supportedBrands: { brandId } }
                }, { new: true });
                if (!response) {
                    return { success: false, message: "Failed to Remove" };
                }
                return { success: true, message: "Successfully removed!!" };
            }
            catch (error) {
                console.log("Error in removeBrandRepo: ", error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    addSubTypeRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, serviceId } = data;
                const { startingPrice, type, vehicleType } = data.newSubType;
                if (!providerId || !serviceId || !startingPrice || !type || !vehicleType) {
                    return { success: false, message: "Please Provide the id and datas!!" };
                }
                const newData = { type, startingPrice };
                console.log("This is adding: ////////////////////////////////////////////", newData);
                if (parseInt(vehicleType) === 2) {
                    const update = yield providerServiceSchema_1.default.findOneAndUpdate({ workshopId: providerId, "twoWheeler.typeId": serviceId }, { $push: { "twoWheeler.$.subType": newData } }, { new: true });
                    if (update) {
                        return {
                            success: true,
                            message: "Two wheeler subtype added successfully!!"
                        };
                    }
                }
                else {
                    const update = yield providerServiceSchema_1.default.findOneAndUpdate({ workshopId: providerId, "fourWheeler.typeId": serviceId }, { $push: { "fourWheeler.$.subType": newData } }, { new: true });
                    if (update) {
                        return {
                            success: true,
                            message: "Four wheeler subtype added successfully!!"
                        };
                    }
                }
                return { success: false, message: "Failed to update the service" };
            }
            catch (error) {
                console.log("Error in addSubType: ", error);
                return { success: false, message: "Something went to wrong in addSubService" };
            }
        });
    }
    removeSubTypeRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, serviceId, vehicleType, type } = data;
                const vehicleField = vehicleType === "2" ? "twoWheeler" : "fourWheeler";
                const removeSubType = yield providerServiceSchema_1.default.updateOne({
                    workshopId: providerId,
                    [`${vehicleField}.typeId`]: serviceId
                }, {
                    $pull: {
                        [`${vehicleField}.$.subType`]: { type: type }
                    }
                });
                if (removeSubType.modifiedCount > 0) {
                    return { success: true, message: "Successfully removed!" };
                }
                else {
                    return { success: false, message: "Failed to remove!" };
                }
            }
            catch (error) {
                console.error("Error in removeSubTypeRepo: ", error);
                return { success: false, message: "Something went wrong in removeSubTypeRepo" };
            }
        });
    }
    editSubTypeRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, serviceId, subType } = data;
                const update = parseInt(data.subType.vehicleType) === 4
                    ? yield providerServiceSchema_1.default.updateOne({
                        workshopId: providerId,
                        'fourWheeler.typeId': serviceId,
                        'fourWheeler.subType.type': subType.type,
                    }, {
                        $set: {
                            'fourWheeler.$[w].subType.$[s].startingPrice': subType.startingPrice,
                        },
                    }, {
                        arrayFilters: [
                            { "w.typeId": serviceId },
                            { "s.type": subType.type },
                        ],
                    })
                    : yield providerServiceSchema_1.default.updateOne({
                        workshopId: providerId,
                        'twoWheeler.typeId': serviceId,
                        'twoWheeler.subType.type': subType.type,
                    }, {
                        $set: {
                            'twoWheeler.$[w].subType.$[s].startingPrice': subType.startingPrice,
                        },
                    }, {
                        arrayFilters: [
                            { "w.typeId": serviceId },
                            { "s.type": subType.type },
                        ],
                    });
                if (update.modifiedCount > 0) {
                    return { success: true, message: "Successfully updated!!" };
                }
                else {
                    return { success: false, message: "Failed to update" };
                }
            }
            catch (error) {
                console.log("Error in editSubType: ", error);
                return { success: false, message: "Something went wrong in editSubTypeRepo" };
            }
        });
    }
    removeServiceRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, serviceId, vehicleType } = data;
                const vehicleTypeKey = vehicleType === '2' ? "twoWheeler" : "fourWheeler";
                const removeService = yield providerServiceSchema_1.default.updateOne({
                    workshopId: providerId
                }, {
                    $pull: {
                        [vehicleTypeKey]: { typeId: serviceId }
                    }
                });
                if (removeService.modifiedCount > 0) {
                    return { success: true, message: "Successfully removed" };
                }
                else {
                    return { success: false, message: "No matching service found to remove" };
                }
            }
            catch (error) {
                console.log("Error in removeService: ", error);
                return { success: false, message: 'Something went wrong in removeServiceRepo' };
            }
        });
    }
    addSlotRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, startingDate, endingDate, count } = data;
                const start = new Date(startingDate);
                const end = endingDate ? new Date(endingDate) : null;
                const createdSlots = [];
                const addDays = (date, days) => {
                    const newDate = new Date(date);
                    newDate.setDate(newDate.getDate() + days);
                    return newDate;
                };
                let currentDate = new Date(start);
                while (end ? currentDate <= end : currentDate <= start) {
                    const existingSlot = yield BookingSlotSchema_1.default.findOne({
                        providerId: new mongoose_1.default.Types.ObjectId(providerId),
                        date: currentDate,
                    });
                    if (!existingSlot) {
                        const createdSlot = yield BookingSlotSchema_1.default.create({
                            providerId: new mongoose_1.default.Types.ObjectId(providerId),
                            date: currentDate,
                            count,
                            reservedCount: 0,
                            bookedCount: 0,
                        });
                        const updatedSlot = {
                            _id: createdSlot._id + "",
                            date: createdSlot.date,
                            count: createdSlot.count,
                            bookedCount: createdSlot.bookedCount
                        };
                        createdSlots.push(updatedSlot);
                    }
                    currentDate = addDays(currentDate, 1);
                    if (!end)
                        break;
                }
                return {
                    success: true,
                    slotData: createdSlots,
                };
            }
            catch (error) {
                console.log("Error in addSlotRepo: ", error);
                if (error.code === 11000) {
                    return { success: false, message: "Slot for the given date already exists." };
                }
                return { success: false, message: "Something went wrong in addSlotRepo" };
            }
        });
    }
    getAllSlotRepo(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findAllSlot = yield BookingSlotSchema_1.default.find({ providerId: providerId }).sort({ date: 1 });
                const data = findAllSlot.map((slot) => ({
                    _id: slot._id + "",
                    date: slot.date,
                    count: slot.count,
                    bookedCount: slot.bookedCount
                }));
                console.log("This is the data: ", data);
                if (!findAllSlot) {
                    return { success: false, message: "Failed to findSlotData" };
                }
                return { success: true, slotData: data };
            }
            catch (error) {
                console.log("Error in getAllSlotRepo: ", error);
                return { success: false, message: "Something went wrong in getAllSlotRepo" };
            }
        });
    }
    updateSlotCountRepo(slotId, state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(slotId)) {
                    return { success: false, message: "Invalid slotId" };
                }
                if (typeof state !== "number") {
                    return { success: false, message: "Invalid state value" };
                }
                const updateSlot = yield BookingSlotSchema_1.default.findByIdAndUpdate(slotId, { $inc: { count: state } }, { new: true });
                if (!updateSlot) {
                    return { success: false, message: "Failed to update Slot" };
                }
                return { success: true, message: "Updated successfully!!" };
            }
            catch (error) {
                console.error("Error in updateSlotCountRepo: ", error);
                return {
                    success: false,
                    message: "Something went wrong in updateSlotCountRepo",
                };
            }
        });
    }
    removeSlotRepo(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(slotId)) {
                    return { success: false, message: "Invalid slotId" };
                }
                const deletedSlot = yield BookingSlotSchema_1.default.findByIdAndDelete(slotId);
                if (!deletedSlot) {
                    return { success: false, message: "Slot not found" };
                }
                return { success: true, message: "Slot removed successfully" };
            }
            catch (error) {
                console.error("Error in removeSlotRepo: ", error);
                return {
                    success: false,
                    message: "Something went wrong in removeSlotRepo",
                };
            }
        });
    }
    getProviderDetailsRepo(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchedProvider = yield providerSchema_1.default.findOne({ _id: providerId });
                if (!fetchedProvider) {
                    return { success: false, message: "Failed to fetch Provider" };
                }
                const data = {
                    _id: fetchedProvider._id + "",
                    workshopName: fetchedProvider.workshopName,
                    ownerName: fetchedProvider.ownerName,
                    mobile: fetchedProvider.mobile,
                    email: fetchedProvider.email,
                    workshopDetails: fetchedProvider.workshopDetails,
                    about: fetchedProvider.about,
                    logoUrl: fetchedProvider.logoUrl
                };
                return { success: true, providerData: data };
            }
            catch (error) {
                console.log("Error in getProviderDetailsRepo: ", error);
                return { success: false, message: "Something went wrong in getProviderDetailsRepo" };
            }
        });
    }
    editProfileRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, workshopName, ownerName, phone, about } = data;
                const updateProvider = yield providerSchema_1.default.findByIdAndUpdate(providerId, {
                    $set: {
                        workshopName: workshopName,
                        ownerName: ownerName,
                        mobile: phone,
                        about: about
                    }
                }, { new: true });
                if (!updateProvider) {
                    return { success: false, message: 'Failed to update Provider' };
                }
                return { success: true, message: "Successfully updated" };
            }
            catch (error) {
                console.log("Error in editProfileRepo: ", error);
                return { success: false, message: "Something went wrong" };
            }
        });
    }
    updateProfileImageRepo(providerId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prevData = yield providerSchema_1.default.findById(providerId).select('logoUrl');
                const updateImage = yield providerSchema_1.default.findByIdAndUpdate(providerId, {
                    $set: {
                        logoUrl: imageUrl
                    }
                }, { new: true });
                if (!updateImage) {
                    return { success: false, message: "Something went wrong in updateImage" };
                }
                return { success: true, message: "Successfully updated", newImgUrl: updateImage.logoUrl, prevImgUrl: prevData === null || prevData === void 0 ? void 0 : prevData.logoUrl };
            }
            catch (error) {
                console.log("Error occured in the updateProfileImage Repo: ", error);
                return { success: false, message: "Something went wrong in updateProfileImage Repo" };
            }
        });
    }
    getAllBookingRepo(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchBooking = yield BookingSchema_1.default.aggregate([
                    {
                        $match: {
                            providerId: new mongoose_1.default.Types.ObjectId(providerId),
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "userId",
                            foreignField: "_id",
                            as: "userData"
                        }
                    },
                    { $unwind: "$userData" },
                    {
                        $lookup: {
                            from: "services",
                            localField: "serviceId",
                            foreignField: "_id",
                            as: "serviceDetails",
                        },
                    },
                    {
                        $unwind: "$serviceDetails",
                    },
                    {
                        $lookup: {
                            from: "providers",
                            localField: "providerId",
                            foreignField: "_id",
                            as: "providerData"
                        }
                    },
                    {
                        $unwind: "$providerData"
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
                            paymentStatus: 1,
                            status: 1,
                            selectedSubServices: 1,
                            providerImage: "$providerData.logoUrl",
                            userData: {
                                _id: 1,
                                name: 1,
                                phone: 1,
                                email: 1,
                                imageUrl: 1,
                            },
                            serviceDetails: {
                                _id: 1,
                                category: 1,
                                serviceType: 1,
                                imageUrl: 1
                            }
                        }
                    }
                ]);
                console.log("This is the fucking data: ", fetchBooking);
                if (!fetchBooking) {
                    return { success: false, message: "Failed to fetchBooking" };
                }
                return { success: true, bookingData: fetchBooking };
            }
            catch (error) {
                console.log("Error in getAllBookingRepo", error);
                return { success: false, message: "Something went wrong in getAllBookingRepo" };
            }
        });
    }
    changeBookingStatusRepo(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield BookingSchema_1.default.updateOne({ _id: bookingId }, { $set: { status } });
                if (result.modifiedCount === 0) {
                    return { success: false, message: "No booking found with the given ID or status is already the same" };
                }
                return { success: true, message: "Booking status updated successfully" };
            }
            catch (error) {
                console.log("Error in changeBookingStatusRepo: ", error);
                return { success: false, message: "Something went wrong in changeBookingStatusRepo" };
            }
        });
    }
    resetPasswordRepo(providerId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield providerSchema_1.default.findById(providerId);
                if (!provider) {
                    return { success: false, message: 'Provider not found' };
                }
                const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, provider.password);
                if (!isPasswordValid) {
                    return { success: false, message: 'Current password is incorrect' };
                }
                const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
                provider.password = hashedNewPassword;
                yield provider.save();
                return { success: true, message: 'Password reset successfully' };
            }
            catch (error) {
                console.error('Error in resetPasswordRepo: ', error);
                return { success: false, message: 'Something went wrong in resetPasswordRepo' };
            }
        });
    }
    getSingleBookingRepo(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield BookingSchema_1.default.findById(bookingId).select("reviewAdded");
                let fetchedBookingData;
                !(booking === null || booking === void 0 ? void 0 : booking.reviewAdded) ?
                    // if review is not added there is no review data(otherwise there will a error occur)
                    fetchedBookingData = yield BookingSchema_1.default.aggregate([
                        { $match: { _id: new mongoose_1.default.Types.ObjectId(bookingId) }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "userData"
                            }
                        },
                        { $unwind: "$userData" },
                        {
                            $lookup: {
                                from: "services",
                                localField: "serviceId",
                                foreignField: "_id",
                                as: "serviceDetails",
                            },
                        },
                        {
                            $unwind: "$serviceDetails",
                        },
                        // {
                        //   $lookup:{
                        //     from:"ratingreviews", 
                        //     localField:"_id",
                        //     foreignField:"bookingId",
                        //     as:"rating"
                        //   }
                        // },
                        // {
                        //   $unwind:"$rating"
                        // },
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
                                paymentStatus: 1,
                                status: 1,
                                selectedSubServices: 1,
                                reviewAdded: 1,
                                providerDetails: {
                                    workshopName: 1,
                                    ownerName: 1,
                                    email: 1,
                                    mobile: 1,
                                    workshopDetails: 1,
                                    logoUrl: 1
                                },
                                providerImage: "$providerData.logoUrl",
                                userData: {
                                    _id: 1,
                                    name: 1,
                                    phone: 1,
                                    email: 1,
                                    imageUrl: 1,
                                },
                                serviceDetails: {
                                    _id: 1,
                                    category: 1,
                                    serviceType: 1,
                                    imageUrl: 1
                                }
                            }
                        }
                    ]) :
                    fetchedBookingData = yield BookingSchema_1.default.aggregate([
                        { $match: { _id: new mongoose_1.default.Types.ObjectId(bookingId) }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "userId",
                                foreignField: "_id",
                                as: "userData"
                            }
                        },
                        { $unwind: "$userData" },
                        {
                            $lookup: {
                                from: "services",
                                localField: "serviceId",
                                foreignField: "_id",
                                as: "serviceDetails",
                            },
                        },
                        {
                            $unwind: "$serviceDetails",
                        },
                        {
                            $lookup: {
                                from: "ratingreviews",
                                localField: "_id",
                                foreignField: "bookingId",
                                as: "rating"
                            }
                        },
                        {
                            $unwind: "$rating"
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
                                paymentStatus: 1,
                                status: 1,
                                selectedSubServices: 1,
                                reviewAdded: 1,
                                rating: {
                                    rating: 1,
                                    feedback: 1
                                },
                                providerDetails: {
                                    workshopName: 1,
                                    ownerName: 1,
                                    email: 1,
                                    mobile: 1,
                                    workshopDetails: 1,
                                    logoUrl: 1
                                },
                                providerImage: "$providerData.logoUrl",
                                userData: {
                                    _id: 1,
                                    name: 1,
                                    phone: 1,
                                    email: 1,
                                    imageUrl: 1,
                                },
                                serviceDetails: {
                                    _id: 1,
                                    category: 1,
                                    serviceType: 1,
                                    imageUrl: 1
                                }
                            }
                        }
                    ]);
                console.log("This is the fetchedBooking: ", fetchedBookingData);
                return { success: true, bookingData: fetchedBookingData[0] };
            }
            catch (error) {
                console.log("Error in getSingleBookingRepo: ", error);
                return { success: false, message: "something went wrong in getSingleBookingRepo" };
            }
        });
    }
    getDashboardDetailsRepo(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(("This is the providerId: ", providerId));
                const bookings = yield BookingSchema_1.default.find({ providerId });
                const uniqueUserId = new Set(bookings.map(booking => booking.userId));
                const totalDistinctUsers = uniqueUserId.size;
                const booking = yield BookingSchema_1.default.find({ providerId, status: "Delivered" });
                const totalRevenue = booking.reduce((sum, booking) => sum + booking.subTotal, 0);
                const pieData = yield BookingSchema_1.default.aggregate([
                    {
                        $match: {
                            providerId: new mongoose_1.default.Types.ObjectId(providerId)
                        },
                    },
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            name: "$_id",
                            count: 1
                        }
                    }
                ]);
                const lineData = yield BookingSchema_1.default.aggregate([
                    {
                        $match: {
                            providerId: new mongoose_1.default.Types.ObjectId(providerId),
                            status: "Delivered"
                        }
                    },
                    {
                        $group: {
                            _id: { month: { $month: "$bookingDate" } },
                            totalRevenue: { $sum: "$subTotal" },
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
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const newlineData = lineData.sort((a, b) => months.indexOf(a.name) - months.indexOf(b.name));
                console.log("This si the booking: ", booking);
                console.log("This si the totalNumber of users: ", totalDistinctUsers);
                console.log("This is the totalRevenue: ", totalRevenue);
                console.log("This is the pieChart: ", pieData);
                console.log("This is the lineData: ", lineData);
                const dashboardData = {
                    users: totalDistinctUsers,
                    totalRevenue: totalRevenue,
                    pieData,
                    lineData: newlineData
                };
                return { success: true, dashboardData };
            }
            catch (error) {
                console.log("Error in getDashboardDetails Repo: ", error);
                return { success: false, message: "Something went wrong in getDashboardDetails" };
            }
        });
    }
}
exports.default = ProviderRepository;

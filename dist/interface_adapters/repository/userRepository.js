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
const userSchema_1 = __importDefault(require("../../framework/mongoose/model/userSchema"));
const otpSchema_1 = __importDefault(require("../../framework/mongoose/model/otpSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const serviceSchema_1 = __importDefault(require("../../framework/mongoose/model/serviceSchema"));
const brandSchema_1 = __importDefault(require("../../framework/mongoose/model/brandSchema"));
const providerSchema_1 = __importDefault(require("../../framework/mongoose/model/providerSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const providerServiceSchema_1 = __importDefault(require("../../framework/mongoose/model/providerServiceSchema"));
const BookingSlotSchema_1 = __importDefault(require("../../framework/mongoose/model/BookingSlotSchema"));
const BookingSchema_1 = __importDefault(require("../../framework/mongoose/model/BookingSchema"));
const ratingSchema_1 = __importDefault(require("../../framework/mongoose/model/ratingSchema"));
const notificationSchema_1 = __importDefault(require("../../framework/mongoose/model/notificationSchema"));
const socketIO_1 = require("../../framework/config/socketIO");
class UserRepository {
    tempOTp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Entered in temp otp in userRepository");
            const newotp = yield otpSchema_1.default.create({
                email: email,
                otp: otp
            });
            if (newotp) {
                return { created: true };
            }
            return { created: false };
        });
    }
    userexist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield userSchema_1.default.findOne({ email: email });
            console.log(userExist);
            return !!userExist;
        });
    }
    phoneExist(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            const phoneExist = yield userSchema_1.default.findOne({ phone: phone });
            return !!phoneExist;
        });
    }
    otpVerification(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpverifed = yield otpSchema_1.default.findOne({ otp: otp, email: email });
            console.log("otpverfied", otpverifed);
            return otpverifed !== null;
        });
    }
    signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = 10;
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, saltRounds);
            const createUser = yield userSchema_1.default.create({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: hashedPassword,
                blocked: false
            });
            const user = {
                id: createUser._id.toString(),
                name: createUser.name,
                email: createUser.email,
                mobile: createUser.phone.toString(),
                blocked: createUser.blocked,
                image: createUser.imageUrl
            };
            if (createUser) {
                return { user: user, created: true };
            }
            else {
                return { user: user, created: false };
            }
        });
    }
    login(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userSchema_1.default.findOne({ email: userData.email });
            if (user === null || user === void 0 ? void 0 : user.blocked) {
                return { success: false, message: "You are blocked!!" };
            }
            if (!user) {
                return { success: false, message: "wrong email" };
            }
            const passwordMatch = yield bcrypt_1.default.compare(userData.password, user.password);
            if (!passwordMatch) {
                return { success: false, message: "wrong password" };
            }
            const userinfo = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                mobile: user.phone + "",
                blocked: user.blocked,
                image: user.imageUrl
            };
            return { user: userinfo, success: true };
        });
    }
    getAllServiceRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getAllservice = yield serviceSchema_1.default.find({});
                if (!getAllservice || getAllservice.length === 0) {
                    return { success: false, message: "Failed to find services" };
                }
                const data = getAllservice.map((service) => ({
                    id: service._id + "",
                    category: service.category,
                    serviceType: service.serviceType,
                    imageUrl: service.imageUrl,
                    isActive: service.isActive
                }));
                return { success: true, serviceData: data };
            }
            catch (error) {
                console.log("Error occurred in getAllServiceRepo: ", error);
                return { success: false, message: "An error occurred while fetching services" };
            }
        });
    }
    getAllBrandRepo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield brandSchema_1.default.find({});
                if (!response) {
                    return { success: false, message: "Failed to find!!" };
                }
                const data = response.map((brand) => ({
                    brandName: brand.brand,
                    id: brand._id + ""
                }));
                console.log("This is the resposne: ", response);
                return { success: true, brandData: data };
            }
            catch (error) {
                console.log("Error in getAllBrandRepo: ", error);
                return { success: false, message: "Something went wrong in getAllBrandRepo" };
            }
        });
    }
    findProvidersRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { serviceId, vehicleBrand, vehicleType, location } = data;
                const { id: brandId } = vehicleBrand;
                const { coordinates } = location;
                const response = yield providerSchema_1.default.aggregate([
                    {
                        $geoNear: {
                            near: { type: "Point", coordinates: coordinates },
                            distanceField: "distance",
                            maxDistance: 10000,
                            spherical: true
                        }
                    },
                    {
                        $match: {
                            "supportedBrands.brandId": brandId,
                            blocked: false
                        }
                    },
                    {
                        $lookup: {
                            from: "providerservices",
                            localField: "_id",
                            foreignField: "workshopId",
                            as: "services"
                        }
                    },
                    {
                        $match: {
                            [`services.${vehicleType}`]: {
                                $elemMatch: {
                                    "typeId": new mongoose_1.default.Types.ObjectId(serviceId.toString())
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            workshopName: 1,
                            ownerName: 1,
                            workshopDetails: 1,
                            email: 1,
                            mobile: 1,
                        }
                    }
                ]);
                if (!response) {
                    return { success: false, message: "Cannot find the Providers" };
                }
                const datas = response.map((service) => ({
                    id: service._id + "",
                    workshopName: service.workshopName,
                    ownerName: service.ownerName,
                    email: service.email,
                    mobile: service.mobile,
                    address: service.workshopDetails.address,
                    coordinates: service.workshopDetails.location.coordinates
                }));
                console.log("Thisis the datas: ", datas);
                return { success: true, providersData: datas };
            }
            catch (error) {
                console.log("Error in findProvidersRepo: ", error);
                return { success: false, message: "Something went wrong in findProvidersRepo" };
            }
        });
    }
    providerServiceViewRepo(providerId, vehicleType, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Enter in to provider ServiceVewRepo providerId and vehicleType: ", providerId, vehicleType, serviceId);
                const findedService = yield serviceSchema_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(serviceId) });
                const providerDetails = yield providerServiceSchema_1.default.aggregate([
                    {
                        $match: { workshopId: new mongoose_1.default.Types.ObjectId(providerId) }
                    },
                    {
                        $lookup: {
                            from: "providers",
                            localField: "workshopId",
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
                            workshopId: 1,
                            "providerDetails._id": 1,
                            "providerDetails.workshopName": 1,
                            "providerDetails.ownerName": 1,
                            "providerDetails.email": 1,
                            "providerDetails.mobile": 1,
                            "providerDetails.workshopDetails": 1,
                            "providerDetails.about": 1,
                            "providerDetails.logoUrl": 1,
                            services: vehicleType === "twoWheeler" ? "$twoWheeler" : "$fourWheeler",
                        }
                    },
                    {
                        $unwind: "$services"
                    },
                    {
                        $match: { "services.typeId": new mongoose_1.default.Types.ObjectId(serviceId) }
                    }
                ]);
                if (!providerDetails) {
                    return { success: false, message: "Can't find service of providers" };
                }
                return { success: true, providerData: providerDetails[0], serviceData: findedService };
            }
            catch (error) {
                console.log("Error in providerServiceViewRepo: ", error);
                return { success: false, message: "Something went wrong in providerServiceViewRepo" };
            }
        });
    }
    checkAvaliableSlotRepo(providerId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("This is the date: ", date);
                const selectedDate = new Date(date);
                console.log("This is selected date: ", selectedDate);
                const nextDate = new Date(selectedDate);
                nextDate.setDate(selectedDate.getDate() + 1);
                console.log("This is next date: ", nextDate);
                const slot = yield BookingSlotSchema_1.default.findOne({
                    providerId,
                    date: { $gt: selectedDate, $lte: nextDate },
                    count: { $gt: 0 },
                    $expr: { $gt: ["$count", "$bookedCount"] }
                });
                if (!slot) {
                    return { success: false, message: "No slot is avaliable" };
                }
                const avaliableSlot = slot.count - slot.bookedCount;
                return { success: true, message: `${avaliableSlot} is avaliable`, slotId: slot._id + "" };
            }
            catch (error) {
                console.log("Error in checkAvaliableSlot: ", error);
                return { success: false, message: "Something went wrong in checkAvaliableSlot" };
            }
        });
    }
    serviceBookingRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.log("This is the serviceBookingData in Repo:", data);
                /////////////////////////////////////////////////////////////
                const slotId = new mongoose_1.default.Types.ObjectId(data.slotId);
                // Query the BookingSlot collection
                const getSlot = yield BookingSlotSchema_1.default.findOne({ _id: slotId });
                if (!getSlot) {
                    console.log("No slot found for the given ID");
                }
                const bookingDate = (_a = getSlot === null || getSlot === void 0 ? void 0 : getSlot.date) !== null && _a !== void 0 ? _a : new Date();
                //console.log("This is the bookingDate: ", new Date(bookingDate));
                ////////////////////////////////////////////////////////////////
                const bookingData = {
                    serviceType: 'general',
                    userId: new mongoose_1.default.Types.ObjectId(data.userId),
                    providerId: new mongoose_1.default.Types.ObjectId(data.providerId),
                    slotId: new mongoose_1.default.Types.ObjectId(data.slotId),
                    serviceId: new mongoose_1.default.Types.ObjectId(data.vehicleDetails.serviceId),
                    vehicleDetails: {
                        number: data.vehicleDetails.vehicleNumber,
                        model: data.vehicleDetails.vehicleModel,
                        brand: data.vehicleDetails.vehicleBrand.brandName,
                        kilometersRun: data.vehicleDetails.kilometers,
                        fuelType: data.vehicleDetails.fuelType.toLowerCase() === 'petrol' ? 'petrol' : 'diesel',
                        vehicleType: data.vehicleDetails.vehicleType === 'twoWheeler' ? 'twoWheeler' : 'fourWheeler',
                    },
                    location: {
                        address: data.vehicleDetails.location.place_name,
                        coordinates: data.vehicleDetails.location.coordinates,
                    },
                    userPhone: data.userPhone,
                    bookingDate: bookingDate,
                    amount: data.totalPrice,
                    platformFee: data.platformFee,
                    subTotal: (data.totalPrice + data.platformFee),
                    paymentId: '',
                    reason: '',
                    status: 'pending',
                    selectedSubServices: data.selectedServices.map((service) => ({
                        type: service.type,
                        startingPrice: service.startingPrice,
                        _id: new mongoose_1.default.Types.ObjectId(service._id),
                        isAdded: service.isAdded,
                    })),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                const serviceBooking = yield BookingSchema_1.default.create(bookingData);
                if (!serviceBooking) {
                    return { success: false, message: "Failed to book service in repo" };
                }
                return { success: true, bookingDetails: serviceBooking };
            }
            catch (error) {
                console.error("Error in serviceBookingRepo:", error);
                return { success: false, message: "Something went wrong in serviceBookingRepo" };
            }
        });
    }
    updateBooking(paymentIntent, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateBooking = yield BookingSchema_1.default.findByIdAndUpdate(bookingId, {
                    paymentId: paymentIntent,
                    paymentStatus: "success"
                }, { new: true });
                if (!updateBooking) {
                    return { success: false, message: "Failed to updateBooking" };
                }
                const slotId = updateBooking.slotId;
                const providerId = updateBooking.providerId;
                const updateBookingSlot = yield BookingSlotSchema_1.default.findOneAndUpdate({ providerId: providerId, _id: slotId }, {
                    $inc: { bookedCount: 1 }
                }, { new: true });
                if (!updateBookingSlot) {
                    return { success: false, message: "Failed to update Booking slot" };
                }
                const service = yield serviceSchema_1.default.findById(updateBooking.serviceId);
                const user = yield userSchema_1.default.findById(updateBooking.userId);
                //console.log("This is that servcie:   ", service)
                const userNotificationContent = {
                    content: `Your ${service === null || service === void 0 ? void 0 : service.serviceType} booked successfully `,
                    type: "booking",
                    read: false,
                    bookingId: bookingId
                };
                const providerNotificationContent = {
                    content: `${user === null || user === void 0 ? void 0 : user.name} has booked a ${service === null || service === void 0 ? void 0 : service.serviceType}`,
                    type: "booking",
                    read: false,
                    bookingId: bookingId
                };
                const createUserNotification = yield notificationSchema_1.default.findOneAndUpdate({ receiverId: new mongoose_1.default.Types.ObjectId(updateBooking.userId) }, { $push: { notifications: userNotificationContent } }, { new: true, upsert: true });
                const createProviderNotification = yield notificationSchema_1.default.findOneAndUpdate({ receiverId: new mongoose_1.default.Types.ObjectId(updateBooking.providerId) }, { $push: { notifications: providerNotificationContent } }, { new: true, upsert: true });
                yield (0, socketIO_1.sendBookingNotification)(providerId.toString(), providerNotificationContent);
                if (!createUserNotification || !createProviderNotification) {
                    return { success: false, message: "Something went wrong in create Notification" };
                }
                return { success: true, message: "updated" };
            }
            catch (error) {
                console.log("Error in updateBooking: ", error);
                return { success: false, message: "something went wrong in updateBooking" };
            }
        });
    }
    getUserDetailsRepo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDetails = yield userSchema_1.default.findOne({ _id: userId });
                if (!userDetails) {
                    return { success: false, message: "Failed to fetch userDetails" };
                }
                const userData = {
                    _id: userDetails._id + "",
                    name: userDetails.name,
                    phone: userDetails.phone,
                    email: userDetails.email,
                    imageUrl: userDetails.imageUrl ? userDetails.imageUrl : ""
                };
                return { success: true, userData: userData };
            }
            catch (error) {
                console.log("Error in getUserDetails: ", error);
                return { success: true, message: "Something went wrong in getUserDetails" };
            }
        });
    }
    editUserProfileRepo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, phone, name } = data;
                const updateUser = yield userSchema_1.default.findByIdAndUpdate(userId, {
                    $set: {
                        name: name,
                        phone: phone,
                    }
                });
                if (!updateUser) {
                    return { success: false, message: "Failed to update profile data" };
                }
                return { success: true, };
            }
            catch (error) {
                console.log("Error in editUserProfile: ", error);
                return { success: false, message: "Something went wrong in editUserProfileRepo" };
            }
        });
    }
    updateProfileImageRepo(userId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oldImage = yield userSchema_1.default.findById(userId).select('imageUrl');
                const updateImage = yield userSchema_1.default.findByIdAndUpdate(userId, {
                    $set: {
                        imageUrl: imageUrl
                    }
                }, { new: true });
                if (!updateImage) {
                    return { success: false, message: "Failed to update image" };
                }
                return { success: true, newImgUrl: updateImage.imageUrl, prevImgUrl: oldImage === null || oldImage === void 0 ? void 0 : oldImage.imageUrl };
            }
            catch (error) {
                console.log("Error in updateProfileImageRepo: ", error);
                return { success: false, message: "Something went wrong updateProfileImageRepo" };
            }
        });
    }
    getAllBookingsRepo(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("This is userId: ", userId);
                const fetchedBookings = yield BookingSchema_1.default.aggregate([
                    {
                        $match: {
                            userId: new mongoose_1.default.Types.ObjectId(userId),
                            paymentStatus: "success",
                        },
                    },
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
                            as: "providerDetails"
                        }
                    },
                    {
                        $unwind: "$providerDetails"
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
                        $project: {
                            _id: 1,
                            serviceType: 1,
                            userId: 1,
                            providerId: 1,
                            slotId: 1,
                            serviceId: 1,
                            vehicleDetails: 1,
                            location: 1,
                            userPhone: 1,
                            bookingDate: 1,
                            amount: 1,
                            platformFee: 1,
                            subTotal: 1,
                            paymentId: 1,
                            reason: 1,
                            paymentStatus: 1,
                            status: 1,
                            selectedSubServices: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            __v: 1,
                            serviceName: "$serviceDetails.serviceType",
                            providerDetails: {
                                _id: 1,
                                workshopName: 1,
                                ownerName: 1,
                                workshopDetails: 1,
                                email: 1,
                                mobile: 1,
                                logoUrl: 1
                            },
                            userImage: "$userDetails.imageUrl"
                        },
                    },
                ]);
                console.log("This is the fetchedBookings: ", fetchedBookings);
                if (!fetchedBookings) {
                    return { success: false, message: "Failed to fetch all bookings" };
                }
                return { success: true, bookingData: fetchedBookings };
            }
            catch (error) {
                console.log("Error occured in getAllBookingsRepo: ", error);
                return { success: false, message: "Something went wrong in getAllBookingsRepo" };
            }
        });
    }
    resetPasswordRepo(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userSchema_1.default.findById(userId);
                if (!user) {
                    return { success: false, message: 'user is  not found' };
                }
                const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
                if (!isPasswordValid) {
                    return { success: false, message: 'Current password is incorrect' };
                }
                const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
                user.password = hashedNewPassword;
                yield user.save();
                return { success: true, message: 'Password reset successfully' };
            }
            catch (error) {
                console.error('Error in resetPasswordRepo: ', error);
                return { success: false, message: 'Something went wrong in resetPasswordRepo' };
            }
        });
    }
    getCancelledBookingRepo(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(bookingId);
                const booking = yield BookingSchema_1.default.aggregate([
                    {
                        $match: { _id: new mongoose_1.default.Types.ObjectId(bookingId) }
                    },
                    {
                        $lookup: {
                            from: "bookingslots",
                            localField: "slotId",
                            foreignField: "_id",
                            as: "slotDetails"
                        }
                    },
                    {
                        $unwind: "$slotDetails"
                    },
                    {
                        $project: {
                            paymentId: 1,
                            serviceDate: "$slotDetails.date",
                            amount: 1,
                            platformFee: 1,
                            subTotal: 1
                        }
                    }
                ]);
                // console.log("This si teh booking taken before cancell: ", booking)
                if (!booking) {
                    return { success: false, message: "Failed to fetch cancelled booking" };
                }
                return { success: true, message: "successfully fetched cancelled booking", bookingData: booking[0] };
            }
            catch (error) {
                console.log("Error occured in finding cancelled booking");
                return { success: false, message: "Something went wrong getCancelled bookingRepo" };
            }
        });
    }
    updateBookingAfterRefundRepo(bookingId, reason, refundAmount, refundStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateBooking = yield BookingSchema_1.default.findByIdAndUpdate(bookingId, { $set: {
                        "refund.amount": refundAmount,
                        "refund.status": refundStatus,
                        reason: reason,
                        status: "cancelled"
                    },
                }, { new: true });
                if (!updateBooking) {
                    return { success: false, message: "Failed to update booking after refund" };
                }
                const updateSlot = yield BookingSlotSchema_1.default.findByIdAndUpdate(updateBooking.slotId, { $inc: { bookedCount: -1 } }, { new: true });
                if (!updateSlot) {
                    return { success: false, message: "Failed to update slot count after cancellation" };
                }
                return { success: true, message: "Successfully updated booking after refund" };
            }
            catch (error) {
                console.log('Error in updateBookingAfterRefund: ', error);
                return { success: false, message: "Something went wrong in updateBookingAfterRefundRepo" };
            }
        });
    }
    addRatingRepo(ratingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId, feedback, providerId, rating, serviceId, userId } = ratingData;
                const data = {
                    bookingId,
                    userId,
                    providerId,
                    serviceId,
                    rating,
                    feedback
                };
                const newRating = yield ratingSchema_1.default.create(data);
                if (!newRating) {
                    return { success: false, message: 'Failed to add rating and review' };
                }
                const updateBooking = yield BookingSchema_1.default.findByIdAndUpdate(bookingId, {
                    $set: {
                        reviewAdded: true
                    }
                }, { new: true });
                if (!updateBooking) {
                    return { success: false, message: "Failed to update isReviewAdded status" };
                }
                return { success: true, message: 'Rating and review added successfully.' };
            }
            catch (error) {
                console.error('Error in AddRatingRepo: ', error);
                return { success: false, message: 'Something went wrong in addRatingRepo.' };
            }
        });
    }
    getNotificationRepo(receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetchNotification = yield notificationSchema_1.default.findOne({ receiverId });
                if (!fetchNotification) {
                    return { success: false, message: "Failed to fetch notification" };
                }
                return { success: true, notificationData: fetchNotification };
            }
            catch (error) {
                console.log("Error in getNotification userRepo");
                return { success: false, message: "Something went wrong in getNotificationRepo" };
            }
        });
    }
    seenNotificationRepo(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateSeen = yield notificationSchema_1.default.updateOne({ _id: notificationId }, {
                    $set: { "notifications.$[].read": true }
                });
                if (updateSeen.matchedCount === 0) {
                    return { success: false, message: 'Document not found' };
                }
                return { success: true, message: "seen status updated successfully!!" };
            }
            catch (error) {
                console.error("Error in seenNotificationRepo: ", error);
                return { success: false, message: 'Something went wrong in seenNotification' };
            }
        });
    }
    clearNotificationController(receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield notificationSchema_1.default.updateOne({ receiverId }, { $set: { notifications: [] } });
                console.log("result", result);
                if (result.modifiedCount > 0) {
                    return { success: true, message: "Notifications cleared successfully" };
                }
                else {
                    return { success: false, message: "No notifications found for the given receiverId" };
                }
            }
            catch (error) {
                console.error("Error in clearNotificationController:", error);
                return { success: false, message: "Something went wrong in clearNotification" };
            }
        });
    }
}
exports.default = UserRepository;

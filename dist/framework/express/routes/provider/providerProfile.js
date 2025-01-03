"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const providerRepository_1 = __importDefault(require("../../../../interface_adapters/repository/providerRepository"));
const profile_1 = __importDefault(require("../../../../usecases/provider/profile"));
const cloudinary_1 = __importDefault(require("../../../service/cloudinary"));
const providerProfile_1 = __importDefault(require("../../../../interface_adapters/controllers/provider/providerProfile"));
const multer_1 = require("../../../service/multer");
const providerProfileRoute = express_1.default.Router();
const repository = new providerRepository_1.default();
const cloudinary = new cloudinary_1.default();
const interactor = new profile_1.default(repository, cloudinary);
const controller = new providerProfile_1.default(interactor);
//=============== Route =======================//
providerProfileRoute.get('/get-provider-details', controller.getProviderDetails.bind(controller));
providerProfileRoute.put('/edit-profile', controller.editProfile.bind(controller));
providerProfileRoute.put('/reset-password', controller.resetPassword.bind(controller));
providerProfileRoute.post('/update-profile-pic', multer_1.upload.single('image'), controller.updateProfilePic.bind(controller));
exports.default = providerProfileRoute;

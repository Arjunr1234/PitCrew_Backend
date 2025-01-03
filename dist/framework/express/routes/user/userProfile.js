"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRepository_1 = __importDefault(require("../../../../interface_adapters/repository/userRepository"));
const profile_1 = __importDefault(require("../../../../usecases/user/profile"));
const userProfile_1 = __importDefault(require("../../../../interface_adapters/controllers/user/userProfile"));
const cloudinary_1 = __importDefault(require("../../../service/cloudinary"));
const multer_1 = require("../../../service/multer");
const jwtAuthentication_1 = __importDefault(require("../../middleware/jwtAuthentication"));
const constants_1 = require("../../../../entities/rules/constants");
const userProfileRoute = express_1.default.Router();
const repository = new userRepository_1.default();
const cloudinary = new cloudinary_1.default();
const interactor = new profile_1.default(repository, cloudinary);
const controller = new userProfile_1.default(interactor);
//=============== Routes =====================//
userProfileRoute.get('/get-user', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.getUserDetails.bind(controller));
userProfileRoute.patch('/edit-profile', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.editUserProfile.bind(controller));
userProfileRoute.put('/add-profile-pic', (0, jwtAuthentication_1.default)(constants_1.role.user), controller.updateImage.bind(controller));
userProfileRoute.put('/reset-password', controller.resetPassword.bind(controller));
userProfileRoute.post('/update-profile-img', (0, jwtAuthentication_1.default)(constants_1.role.user), multer_1.upload.single('image'), controller.updateProfileImage.bind(controller));
exports.default = userProfileRoute;

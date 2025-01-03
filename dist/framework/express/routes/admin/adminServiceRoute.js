"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../../../../interface_adapters/repository/adminRepository"));
const adminService_1 = __importDefault(require("../../../../usecases/admin/adminService"));
const adminService_2 = __importDefault(require("../../../../interface_adapters/controllers/admin/adminService"));
const cloudinary_1 = __importDefault(require("../../../service/cloudinary"));
const multer_1 = require("../../../service/multer");
const jwtAuthentication_1 = __importDefault(require("../../middleware/jwtAuthentication"));
const constants_1 = require("../../../../entities/rules/constants");
const adminServiceRoute = express_1.default.Router();
// Dependency Injection
const repository = new adminRepository_1.default();
const cloudinary = new cloudinary_1.default();
const interactor = new adminService_1.default(cloudinary, repository);
const controller = new adminService_2.default(interactor);
// Routes
adminServiceRoute.post('/add-service', (0, jwtAuthentication_1.default)(constants_1.role.admin), multer_1.upload.single('image'), controller.addServices.bind(controller));
adminServiceRoute.post('/add-brands', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.addBrands.bind(controller));
adminServiceRoute.post('/add-vehicle-type', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.addVehicleTypes.bind(controller));
adminServiceRoute.post('/add-subservice', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.addSubServices.bind(controller));
adminServiceRoute.get('/get-all-brands', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.getAllBrands.bind(controller));
adminServiceRoute.get('/get-all-general-service', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.getAllGeneralService.bind(controller));
adminServiceRoute.get('/get-all-road-service', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.getAllRoadServices.bind(controller));
adminServiceRoute.delete('/remove-service', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.deleteService.bind(controller));
adminServiceRoute.delete('/delete-brands', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.deleteBrand.bind(controller));
adminServiceRoute.delete('/remove-sub-service', (0, jwtAuthentication_1.default)(constants_1.role.admin), controller.removeSubService.bind(controller));
exports.default = adminServiceRoute;

import express from 'express';
import AdminRepository from '../../../../interface_adapters/repository/adminRepository';
import AdminServiceInteractor from '../../../../usecases/admin/adminService';
import AdminServiceController from '../../../../interface_adapters/controllers/admin/adminService';
import CloudinaryService from '../../../service/cloudinary';
import { upload } from '../../../service/multer';

const adminServiceRoute = express.Router();

// Dependency Injection

const repository = new AdminRepository();
const cloudinary = new CloudinaryService();
const interactor = new AdminServiceInteractor(cloudinary, repository);
const controller = new AdminServiceController(interactor);

// Routes

adminServiceRoute.post('/add-service', upload.single('image'), controller.addServices.bind(controller));
adminServiceRoute.post('/add-brands', controller.addBrands.bind(controller));
adminServiceRoute.post('/add-vehicle-type', controller.addVehicleTypes.bind(controller));
adminServiceRoute.post('/add-subservice', controller.addSubServices.bind(controller));

adminServiceRoute.get('/get-all-brands',controller.getAllBrands.bind(controller));
adminServiceRoute.get('/get-all-general-service', controller.getAllGeneralService.bind(controller));
adminServiceRoute.get('/get-all-road-service', controller.getAllRoadServices.bind(controller));

adminServiceRoute.delete('/remove-service', controller.deleteService.bind(controller));
adminServiceRoute.delete('/delete-brands', controller.deleteBrand.bind(controller));



export default adminServiceRoute;

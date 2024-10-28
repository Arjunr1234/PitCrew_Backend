import express from 'express';
import AdminRepository from '../../../../interface_adapters/repository/adminRepository';
import AdminServiceInteractor from '../../../../usecases/admin/adminService';
import AdminServiceController from '../../../../interface_adapters/controllers/admin/adminService';
import CloudinaryService from '../../../service/cloudinary';
import { upload } from '../../../service/multer';
import verification from '../../middleware/jwtAuthentication';

const adminServiceRoute = express.Router();

// Dependency Injection

const repository = new AdminRepository();
const cloudinary = new CloudinaryService();
const interactor = new AdminServiceInteractor(cloudinary, repository);
const controller = new AdminServiceController(interactor);

// Routes

adminServiceRoute.post('/add-service', verification('admin'), upload.single('image'), controller.addServices.bind(controller));
adminServiceRoute.post('/add-brands', verification('admin'), controller.addBrands.bind(controller));
adminServiceRoute.post('/add-vehicle-type', verification('admin'), controller.addVehicleTypes.bind(controller));
adminServiceRoute.post('/add-subservice', verification('admin'), controller.addSubServices.bind(controller));

adminServiceRoute.get('/get-all-brands', verification('admin'), controller.getAllBrands.bind(controller));
adminServiceRoute.get('/get-all-general-service', verification('admin'), controller.getAllGeneralService.bind(controller));
adminServiceRoute.get('/get-all-road-service', verification('admin'), controller.getAllRoadServices.bind(controller));

adminServiceRoute.delete('/remove-service', verification('admin'), controller.deleteService.bind(controller));
adminServiceRoute.delete('/delete-brands', verification('admin'), controller.deleteBrand.bind(controller));



export default adminServiceRoute;

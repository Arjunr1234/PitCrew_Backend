import express from 'express';
import AdminRepository from '../../../../interface_adapters/repository/adminRepository';
import AdminServiceInteractor from '../../../../usecases/admin/adminService';
import AdminServiceController from '../../../../interface_adapters/controllers/admin/adminService';
import CloudinaryService from '../../../service/cloudinary';
import { upload } from '../../../service/multer';
import verification from '../../middleware/jwtAuthentication';
import { role } from '../../../../entities/rules/constants';

const adminServiceRoute = express.Router();

// Dependency Injection

const repository = new AdminRepository();
const cloudinary = new CloudinaryService();
const interactor = new AdminServiceInteractor(cloudinary, repository);
const controller = new AdminServiceController(interactor);

// Routes

adminServiceRoute.post('/add-service', verification(role.admin), upload.single('image'), controller.addServices.bind(controller));
adminServiceRoute.post('/add-brands', verification(role.admin), controller.addBrands.bind(controller));
adminServiceRoute.post('/add-vehicle-type', verification(role.admin), controller.addVehicleTypes.bind(controller));
adminServiceRoute.post('/add-subservice', verification(role.admin), controller.addSubServices.bind(controller));

adminServiceRoute.get('/get-all-brands', verification(role.admin), controller.getAllBrands.bind(controller));
adminServiceRoute.get('/get-all-general-service', verification(role.admin), controller.getAllGeneralService.bind(controller));
adminServiceRoute.get('/get-all-road-service', verification(role.admin), controller.getAllRoadServices.bind(controller));

adminServiceRoute.delete('/remove-service', verification(role.admin), controller.deleteService.bind(controller));
adminServiceRoute.delete('/delete-brands', verification(role.admin), controller.deleteBrand.bind(controller));
adminServiceRoute.delete('/remove-sub-service',verification(role.admin), controller.removeSubService.bind(controller))



export default adminServiceRoute;

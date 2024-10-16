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


export default adminServiceRoute;

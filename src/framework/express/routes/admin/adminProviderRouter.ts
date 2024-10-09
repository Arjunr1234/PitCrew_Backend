import express from 'express';
import AdminRepository from '../../../../interface_adapters/repository/adminRepository';
import AdminProviderInteractor from '../../../../usecases/admin/adminProvider';
import AdminProviderController from '../../../../interface_adapters/controllers/admin/adminProvider';



const adminProviderRoute = express.Router();

const repository = new AdminRepository();
const interactor = new AdminProviderInteractor(repository);
const controller = new AdminProviderController(interactor);

//================routes===============================//

adminProviderRoute.get('/get-pending-providers',controller.getPendingProviders.bind(controller));
adminProviderRoute.get('/get-providers', controller.getProviders.bind(controller))



export default adminProviderRoute
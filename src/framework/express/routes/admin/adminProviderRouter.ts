import express from 'express';
import AdminRepository from '../../../../interface_adapters/repository/adminRepository';
import AdminProviderInteractor from '../../../../usecases/admin/adminProvider';
import AdminProviderController from '../../../../interface_adapters/controllers/admin/adminProvider';
import verification from '../../middleware/jwtAuthentication';
import Mailer from '../../../service/mailer';


const adminProviderRoute = express.Router();

const repository = new AdminRepository();
const mailer = new Mailer()
const interactor = new AdminProviderInteractor(repository, mailer);
const controller = new AdminProviderController(interactor);

//================routes===============================//

adminProviderRoute.get('/get-pending-providers',verification('admin'),controller.getPendingProviders.bind(controller));
adminProviderRoute.get('/get-providers',verification('admin'), controller.getProviders.bind(controller))
adminProviderRoute.patch('/provider-accept-reject',verification('admin'), controller.providerAcceptOrReject.bind(controller));
adminProviderRoute.patch('/provider-block-unblock',verification('admin'), controller.providerBlockAndUnblock.bind(controller))



export default adminProviderRoute
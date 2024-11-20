import express from 'express'
import ProviderRepository from '../../../../interface_adapters/repository/providerRepository';
import ProviderAddServiceInteractor from '../../../../usecases/provider/addService';
import ProviderAddServiceController from '../../../../interface_adapters/controllers/provider/providerAddService';
import verification from '../../middleware/jwtAuthentication';
import { role } from '../../../../entities/rules/constants';
const providerAddServiceRouter = express.Router();


//=================   Dependency Injection  ============//


const repository = new ProviderRepository();
const interactor = new ProviderAddServiceInteractor(repository);
const controller = new ProviderAddServiceController(interactor);


//================   Routes  ===================//



providerAddServiceRouter.get('/get-all-provider-service',verification(role.provider), controller.getAllProviderService.bind(controller));
providerAddServiceRouter.get('/get-all-brands',verification(role.provider), controller.getAllBrands.bind(controller));

providerAddServiceRouter.patch('/remove-brand',verification(role.provider),controller.removeBrand.bind(controller));
providerAddServiceRouter.patch('/edit-subtype',verification(role.provider),controller.editSubtype.bind(controller));

providerAddServiceRouter.delete('/remove-subtype',verification(role.provider), controller.removeSubType.bind(controller));
providerAddServiceRouter.delete('/remove-service',verification(role.provider),controller.removeService.bind(controller));

providerAddServiceRouter.post('/add-brand',verification(role.provider),controller.addBrand.bind(controller));
providerAddServiceRouter.post('/add-general-road-services',verification(role.provider), controller.addGeneralOrRoadService.bind(controller));
providerAddServiceRouter.post('/add-subtype',verification(role.provider), controller.addSubType.bind(controller));







export default providerAddServiceRouter
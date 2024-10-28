import express from 'express'
import ProviderRepository from '../../../../interface_adapters/repository/providerRepository';
import ProviderAddServiceInteractor from '../../../../usecases/provider/addService';
import ProviderAddServiceController from '../../../../interface_adapters/controllers/provider/providerAddService';

const providerAddServiceRouter = express.Router();


//=================   Dependency Injection  ============//


const repository = new ProviderRepository();
const interactor = new ProviderAddServiceInteractor(repository);
const controller = new ProviderAddServiceController(interactor);


//================   Routes  ===================//



providerAddServiceRouter.get('/get-all-provider-service', controller.getAllProviderService.bind(controller));
providerAddServiceRouter.get('/get-all-brands', controller.getAllBrands.bind(controller));

providerAddServiceRouter.patch('/remove-brand',controller.removeBrand.bind(controller))
providerAddServiceRouter.patch('/edit-subtype',controller.editSubtype.bind(controller))

providerAddServiceRouter.delete('/remove-subtype', controller.removeSubType.bind(controller));
providerAddServiceRouter.delete('/remove-service',controller.removeService.bind(controller))

providerAddServiceRouter.post('/add-brand',controller.addBrand.bind(controller));
providerAddServiceRouter.post('/add-general-road-services', controller.addGeneralOrRoadService.bind(controller));
providerAddServiceRouter.post('/add-subtype', controller.addSubType.bind(controller));







export default providerAddServiceRouter
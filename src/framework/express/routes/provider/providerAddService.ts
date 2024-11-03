import express from 'express'
import ProviderRepository from '../../../../interface_adapters/repository/providerRepository';
import ProviderAddServiceInteractor from '../../../../usecases/provider/addService';
import ProviderAddServiceController from '../../../../interface_adapters/controllers/provider/providerAddService';
import verification from '../../middleware/jwtAuthentication';
const providerAddServiceRouter = express.Router();


//=================   Dependency Injection  ============//


const repository = new ProviderRepository();
const interactor = new ProviderAddServiceInteractor(repository);
const controller = new ProviderAddServiceController(interactor);


//================   Routes  ===================//



providerAddServiceRouter.get('/get-all-provider-service',verification('provider'), controller.getAllProviderService.bind(controller));
providerAddServiceRouter.get('/get-all-brands',verification('provider'), controller.getAllBrands.bind(controller));

providerAddServiceRouter.patch('/remove-brand',verification('provider'),controller.removeBrand.bind(controller));
providerAddServiceRouter.patch('/edit-subtype',verification('provider'),controller.editSubtype.bind(controller));

providerAddServiceRouter.delete('/remove-subtype',verification('provider'), controller.removeSubType.bind(controller));
providerAddServiceRouter.delete('/remove-service',verification('provider'),controller.removeService.bind(controller));

providerAddServiceRouter.post('/add-brand',verification('provider'),controller.addBrand.bind(controller));
providerAddServiceRouter.post('/add-general-road-services',verification('provider'), controller.addGeneralOrRoadService.bind(controller));
providerAddServiceRouter.post('/add-subtype',verification('provider'), controller.addSubType.bind(controller));







export default providerAddServiceRouter
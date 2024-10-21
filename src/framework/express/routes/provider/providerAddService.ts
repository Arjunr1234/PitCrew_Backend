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


providerAddServiceRouter.get('/get-all-sevices', controller.getAllServices.bind(controller));
providerAddServiceRouter.get('/get-all-brands', controller.getAllBrands.bind(controller));



export default providerAddServiceRouter
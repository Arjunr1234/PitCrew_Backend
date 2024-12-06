import express from 'express';
import ProviderRepository from '../../../../interface_adapters/repository/providerRepository';
import ProviderDashboardInteractor from '../../../../usecases/provider/dashboard';
import ProviderDashoardController from '../../../../interface_adapters/controllers/provider/providerDashboard';
const providerDashBoardRoute = express.Router();


const respository = new ProviderRepository();
const interactor = new ProviderDashboardInteractor(respository);
const controller = new ProviderDashoardController(interactor);



export default providerDashBoardRoute
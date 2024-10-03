import express from 'express';
import Mailer from '../../../service/mailer';
import ProviderRepository from '../../../../interface_adapters/repository/providerRepository';
import ProviderAuthInteractor from '../../../../usecases/provider/auth';
import ProviderAuthController from '../../../../interface_adapters/controllers/provider/providerAuth';
import JwtServices from '../../../service/jwt';


const providerAuthRouter = express.Router();

const repository = new ProviderRepository();
const mailer = new Mailer();
const jwt = new JwtServices(process.env.ACCESS_TOKEN_KEY as string, process.env.REFRESH_TOKEN_KEY as string)
const providerAuthInteractor = new ProviderAuthInteractor(repository, mailer, jwt);
const controller = new ProviderAuthController(providerAuthInteractor);



//=============== routes ===========================//

providerAuthRouter.post('/otp-send', controller.sendOtp.bind(controller) );
providerAuthRouter.post('/verify-otp', controller.verifyOtp.bind(controller))
providerAuthRouter.post('/create-provider', controller.createProvider.bind(controller))
providerAuthRouter.post('/login', controller.login.bind(controller));


 






export default providerAuthRouter

import express from 'express'
import UserServiceController from '../../../../interface_adapters/controllers/user/userServices';
import UserServiceInteractor from '../../../../usecases/user/services';
import UserRepository from '../../../../interface_adapters/repository/userRepository';
import verification from '../../middleware/jwtAuthentication';
import { role } from '../../../../entities/rules/constants';
const userServiceRoute = express.Router();


const repository = new UserRepository()
const interactor = new UserServiceInteractor(repository);
const controller = new UserServiceController(interactor);


//=================  Routes  ==================//

userServiceRoute.get('/get-all-services',verification(role.user), controller.getAllServices.bind(controller));
userServiceRoute.get('/get-all-brands', verification(role.user), controller.getAllBrands.bind(controller));

userServiceRoute.post('/search-providers', verification(role.user), controller.findProviders.bind(controller));
userServiceRoute.post('/provider-serivce-view',verification(role.user), controller.providerServiceView.bind(controller));



export default userServiceRoute
import express from 'express'
import UserServiceController from '../../../../interface_adapters/controllers/user/userServices';
import UserServiceInteractor from '../../../../usecases/user/services';
import UserRepository from '../../../../interface_adapters/repository/userRepository';
import verification from '../../middleware/jwtAuthentication';
const userServiceRoute = express.Router();


const repository = new UserRepository()
const interactor = new UserServiceInteractor(repository);
const controller = new UserServiceController(interactor);


//=================  Routes  ==================//

userServiceRoute.get('/get-all-services',verification('user'), controller.getAllServices.bind(controller));
userServiceRoute.get('/get-all-brands',  controller.getAllBrands.bind(controller));

userServiceRoute.post('/search-providers', verification('user'), controller.findProviders.bind(controller))



export default userServiceRoute
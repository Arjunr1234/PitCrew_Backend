import express from 'express';
import AdminAuthController from '../../../../interface_adapters/controllers/admin/adminAuthController';
import AdminAuthInteactor from '../../../../usecases/admin/auth';
import JwtServices from '../../../service/jwt';
import AdminRepository from '../../../../interface_adapters/repository/adminRepository';
import verification from '../../middleware/jwtAuthentication';




const adminAuthRouter = express.Router();

const repository = new AdminRepository(); 
const jwt = new JwtServices(process.env.ACCESS_TOKEN_KEY as string, process.env.REFRESH_TOKEN_KEY as string);
const adminAuthInteractor = new AdminAuthInteactor(repository, jwt);
const controller = new AdminAuthController(adminAuthInteractor);


// =================== routes ========================= //

adminAuthRouter.post('/login', controller.login.bind(controller));
adminAuthRouter.get('/logout',controller.logout.bind(controller));
adminAuthRouter.get('/verify-token', controller.verifiedToken.bind(controller));
//adminAuthRouter.get('/verify-token', verification("admin"), controller.verifiedToken.bind(controller));


                              
export default adminAuthRouter
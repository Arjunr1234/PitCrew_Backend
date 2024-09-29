import express from 'express';
import UserRepository from '../../../../interface_adapters/repository/userRepository';
import Mailer from '../../../service/mailer';
import UserAuthInteractor from '../../../../usecases/user/auth';
import AuthController from '../../../../interface_adapters/controllers/user/auth';
import JwtServices from '../../../service/jwt';

const userAuthRouter = express.Router();

const repository = new UserRepository();
const mailer = new Mailer();
const jwt  = new JwtServices(process.env.ACCESS_TOKEN_KEY as string, process.env.REFRESH_TOKEN_KEY as string)
const userAuthInteractor = new UserAuthInteractor(repository, mailer, jwt);
const controller = new AuthController(userAuthInteractor);



userAuthRouter.post('/sendotp', controller.sendOtpController.bind(controller));
userAuthRouter.post('/signup/verify-otp', controller.otpVerificationAndSignup.bind(controller));
userAuthRouter.post('/login',controller.login.bind(controller));
userAuthRouter.get('/logout',controller.logout.bind(controller));



export default userAuthRouter;

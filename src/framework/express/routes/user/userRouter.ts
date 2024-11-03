import express from 'express';
import userAuthRouter from './authRouter';
import userServiceRoute from './userServices';

const userRoute = express.Router();


userRoute.use('/auth', userAuthRouter);
userRoute.use('/services', userServiceRoute);


export default userRoute;

import express from 'express';
import userAuthRouter from './authRouter';
//import userAuthRouter from './auth';

const userRoute = express.Router();


userRoute.use('/auth', userAuthRouter);


export default userRoute;

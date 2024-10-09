import express from 'express'
import adminAuthRouter from "./authRoute";
import adminUserRouter from './userRouter';
import adminProviderRoute from './adminProviderRouter';



const adminRouter = express.Router();


adminRouter.use('/auth', adminAuthRouter);
adminRouter.use('/user', adminUserRouter);
adminRouter.use('/providers', adminProviderRoute)



export default adminRouter
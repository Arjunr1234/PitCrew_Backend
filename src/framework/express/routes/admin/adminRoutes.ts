import express from 'express'
import adminAuthRouter from "./authRoute";
import adminUserRouter from './userRouter';
import adminProviderRoute from './adminProviderRouter';
import adminServiceRoute from './adminServiceRoute';
import adminBookingRoute from './adminBookingRoute';



const adminRouter = express.Router();


adminRouter.use('/auth', adminAuthRouter);
adminRouter.use('/user', adminUserRouter);
adminRouter.use('/providers', adminProviderRoute);
adminRouter.use('/services', adminServiceRoute);
adminRouter.use('/bookings',adminBookingRoute)



export default adminRouter
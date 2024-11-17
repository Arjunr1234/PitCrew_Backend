import express from 'express';
import userAuthRouter from './authRouter';
import userServiceRoute from './userServices';
import userBookingRoute from './userBooking';

const userRoute = express.Router();


userRoute.use('/auth', userAuthRouter);
userRoute.use('/services', userServiceRoute);
userRoute.use('/bookings', userBookingRoute)


export default userRoute;

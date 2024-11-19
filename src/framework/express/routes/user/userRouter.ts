import express from 'express';
import userAuthRouter from './authRouter';
import userServiceRoute from './userServices';
import userBookingRoute from './userBooking';
import userProfileRoute from './userProfile';

const userRoute = express.Router();


userRoute.use('/auth', userAuthRouter);
userRoute.use('/services', userServiceRoute);
userRoute.use('/bookings', userBookingRoute);
userRoute.use('/profile', userProfileRoute);


export default userRoute;

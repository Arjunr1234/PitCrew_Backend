import express from 'express';
import providerAuthRouter from './authRouter';
import providerAddServiceRouter from './providerAddService';
import providerBookingsRoute from './providerBookings';
import providerProfileRoute from './providerProfile';

const providerRouter = express.Router();


providerRouter.use('/auth', providerAuthRouter);
providerRouter.use('/add-service', providerAddServiceRouter);
providerRouter.use('/bookings', providerBookingsRoute);
providerRouter.use('/profile', providerProfileRoute)



export default providerRouter
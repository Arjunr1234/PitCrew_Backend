import express from 'express';
import providerAuthRouter from './authRouter';
import providerAddServiceRouter from './providerAddService';
import providerBookingsRoute from './providerBookings';

const providerRouter = express.Router();


providerRouter.use('/auth', providerAuthRouter);
providerRouter.use('/add-service', providerAddServiceRouter);
providerRouter.use('/bookings', providerBookingsRoute)



export default providerRouter
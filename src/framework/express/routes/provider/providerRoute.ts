import express from 'express';
import providerAuthRouter from './authRouter';
import providerAddServiceRouter from './providerAddService';

const providerRouter = express.Router();


providerRouter.use('/auth', providerAuthRouter);
providerRouter.use('/add-service', providerAddServiceRouter);



export default providerRouter
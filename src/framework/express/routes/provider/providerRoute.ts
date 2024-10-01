import express from 'express';
import providerAuthRouter from './authRouter';

const providerRouter = express.Router();


providerRouter.use('/auth', providerAuthRouter);




export default providerRouter
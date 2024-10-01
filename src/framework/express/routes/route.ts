import { Application } from "express";
import userRoute from "./user/userRouter";
import providerRouter from "./provider/providerRoute";

const   routes = (app: Application) => {
    
    app.use('/api/user', userRoute);
    app.use('/api/provider',providerRouter)
    
}

export default routes;

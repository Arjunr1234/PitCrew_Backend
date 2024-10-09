import { Application } from "express";
import userRoute from "./user/userRouter";
import providerRouter from "./provider/providerRoute";
import adminRouter from "./admin/adminRoutes";

const   routes = (app: Application) => {
    
    app.use('/api/user', userRoute);
    app.use('/api/provider',providerRouter)
    app.use('/api/admin', adminRouter)
    
}

export default routes;

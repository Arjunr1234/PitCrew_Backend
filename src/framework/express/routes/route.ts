import { Application } from "express";
import userRoute from "./user/userRouter";
import providerRouter from "./provider/providerRoute";
import adminRouter from "./admin/adminRoutes";
import chatRouter from "./chatRoute";

const   routes = (app: Application) => {
    
    app.use('/api/user',(req,res,next)=>{console.log("in the server header",req.headers.origin);next()}, userRoute);
    app.use('/api/provider',providerRouter)
    app.use('/api/admin', adminRouter)
    app.use('/api/chat', chatRouter)
    
}

export default routes;

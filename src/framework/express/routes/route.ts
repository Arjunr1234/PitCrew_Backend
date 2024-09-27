import { Application } from "express";
import userRoute from "./user/userRouter";

const   routes = (app: Application) => {
    
    app.use('/api/user', userRoute);
    
}

export default routes;

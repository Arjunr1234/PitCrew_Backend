import express from 'express';
import http from 'http';
import cors from 'cors';
import routes from './express/routes/route';
import dontenv, { config } from 'dotenv'
import cookieParser from 'cookie-parser';
import { configSocketIO } from './config/socketIO';

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configSocketIO(server);
app.use(cookieParser())
dontenv.config()



export const origin = "https://pitcrew.shop"

app.use((req,res,next)=>{
    console.log("in the server")
    next()
})

app.use(
    cors({
      origin: 'https://www.pitcrew.shop', // Allow requests from your production domain
      methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    //   allowedHeaders: 'Content-Type, Authorization',
      credentials: true, // Required for including cookies/auth headers
    })
  );


routes(app);

export default server;

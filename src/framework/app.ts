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




app.use(cors({
    origin: 'http://localhost:5173',  
    methods: 'GET,PUT,POST,PATCH,OPTIONS,DELETE',
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
}));


routes(app);

export default server;

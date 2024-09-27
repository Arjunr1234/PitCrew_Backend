import express from 'express';
import http from 'http';
import cors from 'cors';
import routes from './express/routes/route';
import dontenv from 'dotenv'

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dontenv.config()


app.use(cors({
    origin: 'http://localhost:5173',  
    methods: 'GET,PUT,POST,PATCH,OPTIONS,DELETE',
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
}));


routes(app);

export default server;

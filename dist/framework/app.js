"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.origin = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./express/routes/route"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socketIO_1 = require("./config/socketIO");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, socketIO_1.configSocketIO)(server);
app.use((0, cookie_parser_1.default)());
dotenv_1.default.config();
exports.origin = "http://localhost:5173";
//export const origin = "https://www.pitcrew.shop"
app.use((0, cors_1.default)({
    origin: exports.origin,
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    credentials: true,
}));
(0, route_1.default)(app);
exports.default = server;

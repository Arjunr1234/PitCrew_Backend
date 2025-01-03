"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./framework/app"));
const db_1 = __importDefault(require("./framework/config/db"));
(0, db_1.default)();
app_1.default.listen(3000, () => {
    console.log('arjun started on port 3000');
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const emailTemplate_1 = require("./emailTemplate");
dotenv_1.default.config();
const sendMail = (email, content, subject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            },
        });
        const mailOptions = {
            from: process.env.MAILER_USER,
            to: email,
            subject: subject ? subject : 'PitCrew',
            html: subject ? (0, emailTemplate_1.providerRejectionTemplate)(content) : (0, emailTemplate_1.otpTemplate)(content),
        };
        
        const info = yield transporter.sendMail(mailOptions);
        
        return { success: true };
    }
    catch (error) {
        console.error('Error sending email:', error);
        return { success: false };
    }
});
exports.default = sendMail;

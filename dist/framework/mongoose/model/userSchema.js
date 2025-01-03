"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    password: { type: String, required: true },
    blocked: { type: Boolean, default: false },
}, { timestamps: true });
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;

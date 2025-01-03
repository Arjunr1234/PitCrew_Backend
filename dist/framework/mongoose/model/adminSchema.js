"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    email: { type: String, require: true },
    password: { type: String, require: true }
});
const adminModel = (0, mongoose_1.model)('admin', adminSchema);
exports.default = adminModel;

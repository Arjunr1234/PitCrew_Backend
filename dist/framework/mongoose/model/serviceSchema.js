"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subTypeSchema = new mongoose_1.Schema({
    type: { type: String }
});
const serviceSchema = new mongoose_1.Schema({
    category: { type: String, required: true },
    serviceType: { type: String, required: true },
    imageUrl: { type: String, required: true },
    subTypes: [subTypeSchema],
    isActive: { type: Boolean, default: true }
});
const serviceModel = (0, mongoose_1.model)("services", serviceSchema);
exports.default = serviceModel;

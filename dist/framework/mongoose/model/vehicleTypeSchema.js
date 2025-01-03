"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const vehicleTypeSchema = new mongoose_1.Schema({
    vehicleType: { type: Number, required: true }
});
const vehicleTypeModel = (0, mongoose_1.model)('vehicleType', vehicleTypeSchema);
exports.default = vehicleTypeModel;

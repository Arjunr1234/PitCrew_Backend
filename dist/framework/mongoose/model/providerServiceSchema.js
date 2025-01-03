"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subTypeSchema = new mongoose_1.Schema({
    type: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    startingPrice: { type: String, required: true }
});
const serviceSchema = new mongoose_1.Schema({
    typeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "services", required: true },
    category: { type: String, required: true },
    subType: [subTypeSchema]
});
const providerServiceSchema = new mongoose_1.Schema({
    workshopId: { type: mongoose_1.Schema.Types.ObjectId, ref: "providers", required: true },
    twoWheeler: [serviceSchema],
    fourWheeler: [serviceSchema]
});
const providerServiceModel = (0, mongoose_1.model)('providerService', providerServiceSchema);
exports.default = providerServiceModel;

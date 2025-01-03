"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const supportedBrandsSchema = new mongoose_1.Schema({
    brandId: { type: String, required: true },
    brandName: { type: String, required: true },
}, { _id: true });
const providerSchema = new mongoose_1.Schema({
    workshopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    workshopDetails: {
        address: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    supportedBrands: { type: [supportedBrandsSchema], default: [] },
    blocked: { type: Boolean, required: true, default: false },
    requestAccept: { type: Boolean, required: true, default: false },
    logoUrl: { type: String, default: "" },
    about: { type: String, default: "" },
}, { timestamps: true });
providerSchema.index({ "workshopDetails.location": "2dsphere" });
const providerModel = (0, mongoose_1.model)("providers", providerSchema);
exports.default = providerModel;

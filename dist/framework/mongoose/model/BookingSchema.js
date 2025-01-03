"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Updated Schema
const BookingSchema = new mongoose_1.Schema({
    serviceType: {
        type: String,
        enum: ['general', 'road'],
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    providerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'providers',
        required: true,
    },
    slotId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'bookingSlot',
    },
    serviceId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'services',
        required: true,
    },
    vehicleDetails: {
        number: { type: String, required: true },
        model: { type: String, required: true },
        brand: { type: String, required: true },
        kilometersRun: { type: Number, required: true },
        fuelType: {
            type: String,
            enum: ['petrol', 'diesel'],
            required: true,
        },
        vehicleType: {
            type: String,
            enum: ['twoWheeler', 'fourWheeler'],
            required: true,
        },
    },
    location: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true },
    },
    userPhone: {
        type: String,
        required: true,
    },
    bookingDate: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    platformFee: {
        type: Number,
        required: true,
        min: 0,
    },
    subTotal: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentId: {
        type: String,
    },
    reason: {
        type: String,
    },
    reviewAdded: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'cancelled', 'completed', 'success', "refunded", "failed"],
        default: 'pending',
    },
    refund: {
        amount: {
            type: Number,
            default: null,
        },
        status: {
            type: String,
            enum: ['partial refund', 'full refund'],
            default: null,
        },
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', "accepted", "work progress", "ready for delivery", "delayed", "Delivered"],
        default: 'pending',
    },
    selectedSubServices: [
        {
            type: {
                type: String,
                required: true,
            },
            startingPrice: {
                type: String,
                required: true,
            },
            _id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                required: true,
            },
            isAdded: {
                type: Boolean,
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
BookingSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
const BookingModel = mongoose_1.default.model('Booking', BookingSchema);
exports.default = BookingModel;

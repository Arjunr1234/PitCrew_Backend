"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationContentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["message", "booking"],
        required: true,
    },
    bookingId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Booking",
        required: false,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const notificationSchema = new mongoose_1.default.Schema({
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    notifications: [notificationContentSchema],
}, { timestamps: true });
const notificationModel = mongoose_1.default.model("Notification", notificationSchema);
exports.default = notificationModel;

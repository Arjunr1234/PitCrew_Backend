import mongoose from "mongoose";

const notificationContentSchema = new mongoose.Schema(
  {
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false, 
    },
    read: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, 
    },
    notifications: [notificationContentSchema], 
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notification", notificationSchema); 
export default notificationModel;
 
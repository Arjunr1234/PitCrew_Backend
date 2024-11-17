import mongoose, { Schema, Document, Types } from "mongoose";

interface IBookingSlot extends Document {
  providerId: Types.ObjectId;
  date: Date;
  count: number; 
  reservedCount: number; 
  reservedUntil?: Date; 
  bookedCount:number
  createdAt: Date;
  updatedAt: Date;
}

const BookingSlotSchema = new Schema<IBookingSlot>(
  {
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "providers", required: true },
    date: { type: Date, required: true, unique: true },
    count: { type: Number, required: true }, 
    bookedCount:{type:Number, default:0},
    reservedCount: { type: Number, default: 0 }, 
    reservedUntil: { type: Date, default: null }, 
  },
  {
    timestamps: true,
  }
);

BookingSlotSchema.index({ providerId: 1, date: 1 }, { unique: true });

const BookingSlot = mongoose.model<IBookingSlot>("bookingSlot", BookingSlotSchema);

export default BookingSlot;

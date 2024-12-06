import mongoose, { Schema, Document } from 'mongoose';

interface VehicleDetails {
  number: string;
  model: string;
  brand: string;
  kilometersRun: number;
  fuelType: 'petrol' | 'diesel';
  vehicleType: 'twoWheeler' | 'fourWheeler';
}

interface LocationDetails {
  address: string;
  coordinates: [number, number];
}
interface RefundDetails {
  amount: number | null;
  status: string | null;
}

interface SubService {
  type: string;
  startingPrice: string;
  _id: mongoose.Types.ObjectId;
  isAdded: boolean;
}

export interface BookingDocument extends Document {
  userId: mongoose.Types.ObjectId;
  providerId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId; 
  vehicleDetails: VehicleDetails;
  location: LocationDetails;
  serviceType: 'general' | 'road';
  userPhone: string;
  bookingDate: Date;
  amount: number;
  platformFee:number;
  subTotal:number,
  paymentId: string;
  reason: string;
  reviewAdded:boolean;
  paymentStatus:"pending" | "completed" | "cancelled" | "success" | "refunded" | "failed"
  refund: RefundDetails;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'accepted' | 'work progress' | 'ready for delivery' | 'delayed' | 'Delivered' ;
  selectedSubServices: SubService[]; 
  createdAt: Date;
  updatedAt: Date;
}

// Updated Schema
const BookingSchema: Schema<BookingDocument> = new Schema<BookingDocument>({
  serviceType: {
    type: String,
    enum: ['general', 'road'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'providers',
    required: true,
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'bookingSlot',
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
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
  reviewAdded:{
    type:Boolean,
    default:false
  },
  paymentStatus: {
    type: String,
    enum: ['pending',  'cancelled', 'completed', 'success',"refunded", "failed"],
    default: 'pending',
  },
  refund: {
    amount: {
      type: Number,
      default: null, 
    },
    status: {
      type: String,
      enum:['partial refund', 'full refund'],
      default: null, 
    },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed',"accepted", "work progress", "ready for delivery", "delayed","Delivered"],
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
        type: mongoose.Schema.Types.ObjectId,
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

const BookingModel = mongoose.model<BookingDocument>('Booking', BookingSchema);

export default BookingModel;

import { Schema, model, Document } from 'mongoose';

interface IRatingReview extends Document {
  bookingId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  providerId: Schema.Types.ObjectId;
  serviceId: Schema.Types.ObjectId;
  rating: number;
  feedback: string;
  createdAt: Date;
}

const ratingReviewSchema = new Schema<IRatingReview>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Booking', 
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User', 
    },
    providerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'providers', 
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'services', 
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, 
    },
    feedback: {
      type: String,
      required: false,
      maxlength: 500, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

const RatingModel = model<IRatingReview>('RatingReview', ratingReviewSchema);

export default RatingModel;

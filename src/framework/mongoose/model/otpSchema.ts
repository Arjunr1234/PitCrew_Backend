import mongoose, { Document, Schema } from 'mongoose';

interface OTPDocument extends Document {
  
  email: string;
  otp: string;
  createdTime: Date;
}

const OTPSchema: Schema<OTPDocument> = new Schema({ 
  
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdTime: { type: Date, default: () => Date.now(), index: { expires: '1m' } }, 
});


const OtpModel = mongoose.model<OTPDocument>('Otp', OTPSchema);

export default OtpModel;

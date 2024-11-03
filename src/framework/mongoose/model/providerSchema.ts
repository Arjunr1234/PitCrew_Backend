import { Schema, model } from "mongoose";
import { ProviderModel, SupportedBrand } from "../../../entities/rules/provider";

const supportedBrandsSchema = new Schema<SupportedBrand>(
  {
    brandId: { type: String, required: true },
    brandName: { type: String, required: true },
  },
  { _id: true }
);

const providerSchema = new Schema<ProviderModel>({
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
  
},
{ timestamps: true } 
);


providerSchema.index({ "workshopDetails.location": "2dsphere" });

const providerModel = model<ProviderModel>("providers", providerSchema);

export default providerModel;

import { Schema , model} from "mongoose";
import { ProviderModel, SupportedBrand } from "../../../entities/rules/provider";

const supportedBrandsSchema = new Schema<SupportedBrand>({
    brandId: { type: String, required: true },
    brandName: { type: String, required: true },
  }, { _id: true });  
  

const providerSchema = new Schema<ProviderModel>({
    workshopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    workshopDetails: { type: Object, required: true },
    supportedBrands:{type:[supportedBrandsSchema]},
    blocked: { type: Boolean, required: true, default: false },
    requestAccept: { type: Boolean, required: true, default: false },

})

const providerModel = model("providers",providerSchema);

export default providerModel



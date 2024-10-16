import { Schema, model } from "mongoose";
import { IServiceSchema } from "../../../entities/rules/provider";

const serviceSchema = new Schema<IServiceSchema>({

  category:{type:String, required:true},
  serviceType:{type:String, required:true},
  imageUrl:{type:String, required:true},
  subTypes:{type:[String]}

})

const serviceModel = model<IServiceSchema>(
    "services",
    serviceSchema
);

export default serviceModel

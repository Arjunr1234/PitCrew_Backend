import { Schema, model } from "mongoose";
import { IServiceSchema } from "../../../entities/rules/provider";


const subTypeSchema = new Schema<IsubTypeSchemaModel>({
  type:{type:String}
})

interface IsubTypeSchemaModel {
   type:string
}

const serviceSchema = new Schema<IServiceSchema>({

  category:{type:String, required:true},
  serviceType:{type:String, required:true},
  imageUrl:{type:String, required:true},
  subTypes:[subTypeSchema],
  isActive:{type:Boolean, default:true}


})

const serviceModel = model<IServiceSchema>(
    "services",
    serviceSchema
);

export default serviceModel

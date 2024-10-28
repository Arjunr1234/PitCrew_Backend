import { Schema, model , Types} from "mongoose";
import { IProviderServiceSchema } from "../../../entities/rules/provider";

const subTypeSchema = new Schema({
   type:{type:Schema.Types.ObjectId, required:true},
   startingPrice:{type:String, required:true}
});

const serviceSchema = new Schema({
    typeId:{type:Schema.Types.ObjectId, ref:"services", required:true},
    category:{type:String, required:true},
    subType:[subTypeSchema]
});



const providerServiceSchema = new Schema<IProviderServiceSchema>({
   workshopId:{type:Schema.Types.ObjectId, ref:"providers", required:true},
   twoWheeler:[serviceSchema],
   fourWheeler:[serviceSchema]
   
});

const providerServiceModel = model('providerService', providerServiceSchema);

export default  providerServiceModel







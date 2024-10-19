import { Schema, model } from "mongoose";

interface IVehicleTypeSchema{
    vehicleType:number
}

const vehicleTypeSchema = new Schema<IVehicleTypeSchema>({
          vehicleType:{type:Number, required:true}
})

const vehicleTypeModel = model<IVehicleTypeSchema>('vehicleType', vehicleTypeSchema);

export default vehicleTypeModel
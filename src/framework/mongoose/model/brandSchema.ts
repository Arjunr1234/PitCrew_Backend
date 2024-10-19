import {  Schema, model } from "mongoose";


interface IBrandSchema{
   brand:string
}

const brandSchema = new Schema<IBrandSchema>({
    brand:{type:String, required:true}
})


const brandModel = model<IBrandSchema>('Brands', brandSchema);

export default brandModel
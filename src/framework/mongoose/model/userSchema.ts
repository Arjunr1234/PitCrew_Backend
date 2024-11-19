import { Schema, model } from "mongoose";


interface User {
  name: string;
  phone: string;
  email: string;
  imageUrl:string;
  password: string;
  blocked: boolean;
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    imageUrl:{type:String, default:""},
    password: { type: String, required: true },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true } 
);


const userModel = model<User>('User', userSchema);

export default userModel;

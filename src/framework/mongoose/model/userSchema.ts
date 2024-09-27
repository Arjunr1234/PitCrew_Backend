import { Schema, model } from "mongoose";

// Define the user interface
interface User {
  name: string;
  phone: string;
  email: string;
  password: string;
  blocked: boolean;
}

// Create the user schema
const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    blocked: { type: Boolean, default: false },
  },
  { timestamps: true } // Add timestamps
);

// Create the user model
const userModel = model<User>('User', userSchema);

export default userModel;

import { ObjectId } from "mongoose";

export interface IMessageDetails{
  senderId:string,
  receiverId:string,
  bookingId:string,
  name:string,
  message:string,
  sender:"user" | "provider"
}

export interface IChatData{
  _id: ObjectId|any;
  providerId: ObjectId| string;
  userId: ObjectId| string;
  __v?: number;
  createdAt?: Date;
  messages: Message[]|any;
  updatedAt?: Date;
}

interface Message {
  sender: 'provider' | 'user'; 
  message: string;
  type: any 
  delete: boolean;
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
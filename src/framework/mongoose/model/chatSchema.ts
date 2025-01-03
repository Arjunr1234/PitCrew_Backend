import mongoose, { Document, Schema, model } from "mongoose";


interface IMessage extends Document {
  sender: "user" | "provider";
  message: string;
  type: "text";
  delete: boolean;
  seen:boolean
}


interface IChat extends Document {
  providerId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  messages: IMessage[];
}


const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      enum: ["user", "provider"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text"],
      default: "text",
    },
    delete: {
      type: Boolean,
      default: false,
    },
    seen:{
      type:Boolean,
      default:true
    },
  },
  {
    timestamps: true,
  }
);


const chatSchema = new Schema<IChat>(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "providers", 
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);


const ChatModel = model<IChat>("Chat", chatSchema);

export default ChatModel;

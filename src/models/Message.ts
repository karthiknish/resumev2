import mongoose, { Schema, Document, Model } from "mongoose";

interface IMessage extends Document {
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  avatar: string;
}

const MessageSchema = new Schema<IMessage>({
  name: {
    type: String,
    default: "Anonymous",
  },
  email: {
    type: String,
    default: "anonymous@example.com",
  },
  message: {
    type: String,
    required: [true, "Message content is required"],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default: "/avatars/default.png",
  },
});

MessageSchema.index({ createdAt: -1 });
MessageSchema.index({ isRead: 1 });

const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;

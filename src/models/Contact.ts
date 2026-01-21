import mongoose, { Schema, Document, Model } from "mongoose";

interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const contactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

contactSchema.index({ createdAt: -1 });

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model<IContact>("Contact", contactSchema);

export default Contact;

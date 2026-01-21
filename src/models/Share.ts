import mongoose, { Schema, Document, Model } from "mongoose";

interface IShare extends Document {
  url: string;
  platform: "twitter" | "facebook" | "linkedin" | "whatsapp" | "email" | "reddit" | "pinterest" | "copy" | "native";
  title?: string;
  blogSlug?: string;
  userAgent?: string;
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShareSchema = new Schema<IShare>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["twitter", "facebook", "linkedin", "whatsapp", "email", "reddit", "pinterest", "copy", "native"],
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    blogSlug: {
      type: String,
      trim: true,
      index: true,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ShareSchema.index({ url: 1, createdAt: -1 });
ShareSchema.index({ platform: 1, createdAt: -1 });

const Share: Model<IShare> = mongoose.models.Share || mongoose.model<IShare>("Share", ShareSchema);

export default Share;

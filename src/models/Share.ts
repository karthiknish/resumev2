// Converted to TypeScript - migrated
import mongoose from "mongoose";

const ShareSchema = new mongoose.Schema(
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

// Index for querying shares by URL and date range
ShareSchema.index({ url: 1, createdAt: -1 });

// Index for analytics queries by platform and date
ShareSchema.index({ platform: 1, createdAt: -1 });

// Prevent model recompilation in Next.js dev environment
export default mongoose.models.Share || mongoose.model("Share", ShareSchema);


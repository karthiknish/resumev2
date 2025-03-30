import mongoose from "mongoose";

const ApiUsageSchema = new mongoose.Schema(
  {
    apiName: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index for faster lookups by name
    },
    date: {
      type: String, // Store date as YYYY-MM-DD string for easy querying
      required: true,
      index: true, // Index for faster lookups by date
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound index for efficient findOneAndUpdate
ApiUsageSchema.index({ apiName: 1, date: 1 }, { unique: true });

// Prevent model recompilation in Next.js dev environment
export default mongoose.models.ApiUsage ||
  mongoose.model("ApiUsage", ApiUsageSchema);

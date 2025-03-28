import mongoose from "mongoose";

const ByteSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      required: [true, "Headline is required."],
      trim: true,
      maxlength: [200, "Headline cannot be more than 200 characters"],
    },
    body: {
      type: String,
      required: [true, "Body content is required."],
      trim: true,
      maxlength: [500, "Body cannot be more than 500 characters"], // Keep it short
    },
    imageUrl: {
      // Optional image
      type: String,
      trim: true,
    },
    link: {
      // Optional external link
      type: String,
      trim: true,
    },
    // Add other fields if needed, e.g., category, tags
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Prevent model recompilation in Next.js dev environment
export default mongoose.models.Byte || mongoose.model("Byte", ByteSchema);

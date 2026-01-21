// Converted to TypeScript - migrated
import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true, // Ensure emails are unique
    lowercase: true, // Store emails in lowercase
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    trim: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    weeklyDigest: { type: Boolean, default: true },
    projectUpdates: { type: Boolean, default: true },
    careerTips: { type: Boolean, default: true },
    industryNews: { type: Boolean, default: true },
    productUpdates: { type: Boolean, default: true },
  },
  // Add other fields if needed, e.g., name, source
});

// Add index on email for faster lookups (especially for uniqueness check)
SubscriberSchema.index({ email: 1 });
// Add index for sorting by subscription date
SubscriberSchema.index({ subscribedAt: -1 });

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);


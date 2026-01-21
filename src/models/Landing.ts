// Converted to TypeScript - migrated
import mongoose from "mongoose";

const landingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  budget: {
    type: String,
    required: false,
  },
  timeline: {
    type: String,
    required: false,
  },
  project: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["new", "contacted", "in_progress", "completed", "declined"],
    default: "new",
  },
});

// Add indexes
landingSchema.index({ createdAt: -1 }); // For sorting
landingSchema.index({ status: 1 }); // For filtering by status
landingSchema.index({ email: 1 }); // For looking up by email

export default mongoose.models.Landing ||
  mongoose.model("Landing", landingSchema);


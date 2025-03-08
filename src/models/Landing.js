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

export default mongoose.models.Landing ||
  mongoose.model("Landing", landingSchema);

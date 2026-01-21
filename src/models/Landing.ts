import mongoose, { Schema, Document, Model } from "mongoose";

type LandingStatus = "new" | "contacted" | "in_progress" | "completed" | "declined";

interface ILanding extends Document {
  name: string;
  email: string;
  budget?: string;
  timeline?: string;
  project: string;
  createdAt: Date;
  status: LandingStatus;
}

const landingSchema = new Schema<ILanding>({
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

landingSchema.index({ createdAt: -1 });
landingSchema.index({ status: 1 });
landingSchema.index({ email: 1 });

const Landing: Model<ILanding> = mongoose.models.Landing || mongoose.model<ILanding>("Landing", landingSchema);

export default Landing;

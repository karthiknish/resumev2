import mongoose, { Schema, Document, Model } from "mongoose";

interface ISubscriberPreferences {
  weeklyDigest: boolean;
  projectUpdates: boolean;
  careerTips: boolean;
  industryNews: boolean;
  productUpdates: boolean;
}

interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
  preferences: ISubscriberPreferences;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
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
});

SubscriberSchema.index({ email: 1 });
SubscriberSchema.index({ subscribedAt: -1 });

const Subscriber: Model<ISubscriber> = mongoose.models.Subscriber || mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);

export default Subscriber;

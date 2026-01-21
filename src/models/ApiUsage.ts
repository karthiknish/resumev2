import mongoose, { Schema, Document, Model } from "mongoose";

interface IApiUsage extends Document {
  apiName: string;
  date: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

const ApiUsageSchema = new Schema<IApiUsage>(
  {
    apiName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ApiUsageSchema.index({ apiName: 1, date: 1 }, { unique: true });

const ApiUsage: Model<IApiUsage> = mongoose.models.ApiUsage || mongoose.model<IApiUsage>("ApiUsage", ApiUsageSchema);

export default ApiUsage;

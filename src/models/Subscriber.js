import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);

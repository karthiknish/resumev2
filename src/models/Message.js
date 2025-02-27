import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous",
  },
  email: {
    type: String,
    default: "anonymous@example.com",
  },
  message: {
    type: String,
    required: [true, "Message content is required"],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default: "/avatars/default.png",
  },
});

// Prevent overwriting the model if it exists
export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);

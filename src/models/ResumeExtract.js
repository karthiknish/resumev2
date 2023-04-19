import mongoose from "mongoose";

const ResumeExtract = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    unique: true,
  },
  extractedText: String,
});

export default mongoose.models.ResumeExtract ||
  mongoose.model("ResumeExtract", ResumeExtract);

import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    // New fields for AI-generated summary
    aiSummary: {
      type: String,
      default: null,
    },
    hasAudioSummary: {
      type: Boolean,
      default: false,
    },
    audioSummaryUrl: {
      type: String,
      default: null,
    },
    summaryGeneratedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Ensure unique slugs
BlogSchema.index({ slug: 1 }, { unique: true });

// Create slug from title
BlogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

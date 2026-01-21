// Converted to TypeScript - migrated
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    blogPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog", // Reference to the Blog model
      required: true,
      index: true, // Index for fetching comments by post
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: false, // Allow anonymous comments
      default: null,
    },
    // Store author's name and potentially image at time of comment
    // to avoid issues if user details change later
    authorName: {
      type: String,
      required: true, // Still require a name, default to "Anonymous" if needed
      default: "Anonymous",
    },
    authorImage: {
      type: String, // URL to avatar
      default: null,
    },
    text: {
      type: String,
      required: [true, "Comment text cannot be empty."],
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters."],
    },
    // Optional: Add replies as a sub-document array or separate collection later
    // replies: [ReplySchema]
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Index for fetching comments by post, sorted by creation date
CommentSchema.index({ blogPost: 1, createdAt: 1 });

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);


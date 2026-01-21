import mongoose, { Schema, Document, Model } from "mongoose";

interface IComment extends Document {
  blogPost: mongoose.Types.ObjectId;
  author?: mongoose.Types.ObjectId;
  authorName: string;
  authorImage?: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    blogPost: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    authorName: {
      type: String,
      required: true,
      default: "Anonymous",
    },
    authorImage: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      required: [true, "Comment text cannot be empty."],
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters."],
    },
  },
  { timestamps: true }
);

CommentSchema.index({ blogPost: 1, createdAt: 1 });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;

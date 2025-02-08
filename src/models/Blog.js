import mongoose from "mongoose";
const URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
BlogSchema.pre("save", function (next) {
  this.slug = this.title.split(" ").join("-");
  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

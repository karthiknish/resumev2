import mongoose from "mongoose";
const URLSlug = require("mongoose-slug-generator");
mongoose.plugin(URLSlug);
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide your title."],
      maxlength: [200, "Name cannot be more than 200 characters"],
    },
    slug: { type: String, slug: "title" },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required"],
    },
  },
  { timestamps: true }
);
BlogSchema.pre("save", function (next) {
  this.slug = this.title.split(" ").join("-");
  next();
});
BlogSchema.pre("findByIdAndUpdate", function (next) {
  console.log(this.title);
  const title = this.getUpdate().title;
  if (title) {
    this.findOneAndUpdate(
      {},
      { slug: title.split(" ").join("-") },
      { new: true }
    );
  }
  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

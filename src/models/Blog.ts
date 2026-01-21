import mongoose, { Schema, Document, Model } from "mongoose";

interface IBlogVersion {
  versionNumber: number;
  title: string;
  content: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  category?: string;
  author?: mongoose.Types.ObjectId;
  createdAt: Date;
  changeDescription: string;
}

interface IBlog extends Document {
  title: string;
  content: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  slug: string;
  author: mongoose.Types.ObjectId;
  isPublished: boolean;
  category: string;
  viewCount: number;
  likes: string[];
  scheduledPublishAt: Date | null;
  versions: IBlogVersion[];
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
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
      required: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    slug: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      trim: true,
      default: "Uncategorized",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likes: [{
      type: String,
      trim: true,
    }],
    scheduledPublishAt: {
      type: Date,
      default: null,
    },
    versions: [
      {
        versionNumber: {
          type: Number,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
        },
        tags: [{
          type: String,
          trim: true,
        }],
        category: {
          type: String,
        },
        author: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        changeDescription: {
          type: String,
          default: "",
        },
      },
    ],
    currentVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 }, { unique: true });
BlogSchema.index({ category: 1 });
BlogSchema.index({ isPublished: 1, createdAt: -1 });
BlogSchema.index({ tags: 1 });
BlogSchema.index({ author: 1 });
BlogSchema.index(
  { title: "text", content: "text", description: "text", tags: "text" },
  { name: "BlogTextIndex", weights: { title: 10, tags: 5, description: 3, content: 1 } }
);

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

BlogSchema.pre("save", function (next) {
  if (!this.isNew) {
    const contentFields = ["title", "content", "description", "imageUrl", "tags", "category"];
    const hasContentChanges = contentFields.some(field => this.isModified(field));

    if (hasContentChanges) {
      this.currentVersion = (this.currentVersion || 1) + 1;

      const previousVersion = {
        versionNumber: this.currentVersion - 1,
        title: this.get("title") as string,
        content: this.get("content") as string,
        description: this.get("description") as string,
        imageUrl: this.get("imageUrl") as string | undefined,
        tags: this.get("tags") ? [...(this.get("tags") as string[])] : [],
        category: this.get("category") as string | undefined,
        author: this.get("author") as mongoose.Types.ObjectId | undefined,
        createdAt: new Date((this.get("updatedAt") as Date) || Date.now()),
        changeDescription: "",
      };

      this.versions = this.versions || [];
      this.versions.push(previousVersion);
      if (this.versions.length > 20) {
        this.versions = this.versions.slice(-20);
      }
    }
  } else {
    this.currentVersion = 1;
    this.versions = [];
  }
  next();
});

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;

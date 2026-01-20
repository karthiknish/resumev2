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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    category: {
      // New category field
      type: String,
      trim: true,
      default: "Uncategorized", // Optional: Provide a default
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likes: [{
      type: String, // Can be user ID (authenticated) or session ID (anonymous)
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
          type: mongoose.Schema.Types.ObjectId,
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

// Define Indexes
BlogSchema.index({ slug: 1 }, { unique: true }); // Existing unique index on slug
BlogSchema.index({ category: 1 }); // Index on category (now this is the only definition)
BlogSchema.index({ isPublished: 1, createdAt: -1 }); // Compound index for published status and sorting by date (descending)
BlogSchema.index({ tags: 1 }); // Index for querying by tags
BlogSchema.index({ author: 1 }); // Index for querying by author
BlogSchema.index(
  { title: "text", content: "text", description: "text", tags: "text" },
  { name: "BlogTextIndex", weights: { title: 10, tags: 5, description: 3, content: 1 } }
); // Text index for searching, weighted towards title/tags

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

// Create version snapshot on content changes (skip for new documents)
BlogSchema.pre("save", function (next) {
  // Only create version for existing documents (not new ones)
  if (!this.isNew) {
    const contentFields = ["title", "content", "description", "imageUrl", "tags", "category"];
    const hasContentChanges = contentFields.some(field => this.isModified(field));

    if (hasContentChanges) {
      // Increment version number
      this.currentVersion = (this.currentVersion || 1) + 1;

      // Create version snapshot with the previous values
      const previousVersion = {
        versionNumber: this.currentVersion - 1,
        title: this._doc.title,
        content: this._doc.content,
        description: this._doc.description,
        imageUrl: this._doc.imageUrl,
        tags: this._doc.tags ? [...this._doc.tags] : [],
        category: this._doc.category,
        author: this._doc.author,
        createdAt: new Date(this._doc.updatedAt || Date.now()),
        changeDescription: "",
      };

      // Add to versions array, keep only last 20 versions
      this.versions = this.versions || [];
      this.versions.push(previousVersion);
      if (this.versions.length > 20) {
        this.versions = this.versions.slice(-20);
      }
    }
  } else {
    // For new documents, set initial version
    this.currentVersion = 1;
    this.versions = [];
  }
  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

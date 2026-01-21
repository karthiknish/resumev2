import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface ISlide {
  slideNumber: number;
  heading: string;
  body: string;
  hasNumber: boolean;
}

interface ISlideImage {
  slideNumber: number;
  imageData?: string;
  mimeType: string;
  error?: string;
}

interface ITemplateUsed {
  category?: string;
  templateId?: string;
}

interface IMetrics {
  characterCount?: number;
  wordCount?: number;
  slideCount?: number;
}

interface ILinkedInContent extends Document {
  author: Types.ObjectId;
  contentType: "post" | "carousel";
  topic: string;
  postContent?: string;
  postType?: "insight" | "story" | "tutorial" | "opinion" | "celebration";
  tone?: "professional" | "casual" | "thoughtful" | "inspiring" | "educational";
  length?: "short" | "medium" | "long";
  hashtags: string[];
  slides: ISlide[];
  slideImages: ISlideImage[];
  carouselStyle?: "dark_pro" | "light_pro" | "gradient";
  aspectRatio?: "portrait" | "square";
  status: "draft" | "generated" | "failed";
  errorMessage?: string;
  aiModel: string;
  templateUsed: ITemplateUsed;
  metrics: IMetrics;
  isExported: boolean;
  exportType: "copy" | "pdf" | "images" | "none";
  exportedAt?: Date;
  notes?: string;
  tags: string[];
  isFavorite: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  markAsExported(exportType: string): Promise<ILinkedInContent>;
  softDelete(): Promise<ILinkedInContent>;
  restore(): Promise<ILinkedInContent>;
  toggleFavorite(): Promise<ILinkedInContent>;
}

interface ILinkedInContentModel extends Model<ILinkedInContent> {
  findByUser(userId: string, options?: any): Promise<ILinkedInContent[]>;
  findFavorites(userId: string): Promise<ILinkedInContent[]>;
  searchContent(userId: string, searchTerm: string): Promise<ILinkedInContent[]>;
  getUserStats(userId: string): Promise<any>;
}

const LinkedInContentSchema = new Schema<ILinkedInContent>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["post", "carousel"],
      required: [true, "Content type is required"],
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      maxlength: [500, "Topic cannot be more than 500 characters"],
    },
    postContent: {
      type: String,
      required: function (this: ILinkedInContent) {
        return this.contentType === "post";
      },
    },
    postType: {
      type: String,
      enum: ["insight", "story", "tutorial", "opinion", "celebration"],
    },
    tone: {
      type: String,
      enum: ["professional", "casual", "thoughtful", "inspiring", "educational"],
    },
    length: {
      type: String,
      enum: ["short", "medium", "long"],
    },
    hashtags: [
      {
        type: String,
        trim: true,
      },
    ],
    slides: [
      {
        slideNumber: { type: Number, required: true },
        heading: { type: String, required: true },
        body: { type: String, required: true },
        hasNumber: { type: Boolean, default: false },
      },
    ],
    slideImages: [
      {
        slideNumber: { type: Number, required: true },
        imageData: { type: String },
        mimeType: { type: String, default: "image/png" },
        error: { type: String },
      },
    ],
    carouselStyle: {
      type: String,
      enum: ["dark_pro", "light_pro", "gradient"],
    },
    aspectRatio: {
      type: String,
      enum: ["portrait", "square"],
    },
    status: {
      type: String,
      enum: ["draft", "generated", "failed"],
      default: "generated",
    },
    errorMessage: {
      type: String,
    },
    aiModel: {
      type: String,
      default: "gemini-2.5-flash",
    },
    templateUsed: {
      category: { type: String },
      templateId: { type: String },
    },
    metrics: {
      characterCount: { type: Number },
      wordCount: { type: Number },
      slideCount: { type: Number },
    },
    isExported: {
      type: Boolean,
      default: false,
    },
    exportType: {
      type: String,
      enum: ["copy", "pdf", "images", "none"],
      default: "none",
    },
    exportedAt: {
      type: Date,
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot be more than 1000 characters"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

LinkedInContentSchema.index({ author: 1, contentType: 1, createdAt: -1 });
LinkedInContentSchema.index({ contentType: 1, createdAt: -1 });
LinkedInContentSchema.index({ author: 1, isFavorite: 1, createdAt: -1 });
LinkedInContentSchema.index({ isDeleted: 1, createdAt: -1 });
LinkedInContentSchema.index({ status: 1, createdAt: -1 });
LinkedInContentSchema.index({ tags: 1 });
LinkedInContentSchema.index(
  { topic: "text", postContent: "text", notes: "text" },
  { name: "LinkedInContentTextIndex", weights: { topic: 10, postContent: 5, notes: 3 } }
);
LinkedInContentSchema.index({ author: 1, isDeleted: 1, createdAt: -1 });

LinkedInContentSchema.virtual("isPost").get(function () {
  return this.contentType === "post";
});

LinkedInContentSchema.virtual("isCarousel").get(function () {
  return this.contentType === "carousel";
});

LinkedInContentSchema.virtual("totalSlides").get(function () {
  return this.slideImages?.length || 0;
});

LinkedInContentSchema.set("toJSON", { virtuals: true });
LinkedInContentSchema.set("toObject", { virtuals: true });

LinkedInContentSchema.methods.markAsExported = function (this: ILinkedInContent, exportType: string) {
  this.isExported = true;
  this.exportType = exportType as any;
  this.exportedAt = new Date();
  return this.save();
};

LinkedInContentSchema.methods.softDelete = function (this: ILinkedInContent) {
  this.isDeleted = true;
  return this.save();
};

LinkedInContentSchema.methods.restore = function (this: ILinkedInContent) {
  this.isDeleted = false;
  return this.save();
};

LinkedInContentSchema.methods.toggleFavorite = function (this: ILinkedInContent) {
  this.isFavorite = !this.isFavorite;
  return this.save();
};

LinkedInContentSchema.statics.findByUser = function (this: ILinkedInContentModel, userId: string, options: any = {}) {
  const {
    contentType,
    limit = 50,
    skip = 0,
    sort = { createdAt: -1 },
    includeDeleted = false,
  } = options;

  const query: any = {
    author: userId,
  };

  if (!includeDeleted) {
    query.isDeleted = false;
  }

  if (contentType) {
    query.contentType = contentType;
  }

  return this.find(query).sort(sort).limit(limit).skip(skip).populate("author", "name email");
};

LinkedInContentSchema.statics.findFavorites = function (this: ILinkedInContentModel, userId: string) {
  return this.find({
    author: userId,
    isFavorite: true,
    isDeleted: false,
  }).sort({ createdAt: -1 });
};

LinkedInContentSchema.statics.searchContent = function (this: ILinkedInContentModel, userId: string, searchTerm: string) {
  return this.find(
    {
      author: userId,
      isDeleted: false,
      $text: { $search: searchTerm },
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .populate("author", "name email");
};

LinkedInContentSchema.statics.getUserStats = async function (this: ILinkedInContentModel, userId: string) {
  const stats = await this.aggregate([
    {
      $match: { author: userId, isDeleted: false },
    },
    {
      $group: {
        _id: "$contentType",
        count: { $sum: 1 },
        exported: { $sum: { $cond: ["$isExported", 1, 0] } },
        favorites: { $sum: { $cond: ["$isFavorite", 1, 0] } },
      },
    },
  ]);

  const result = {
    total: 0,
    posts: 0,
    carousels: 0,
    exported: 0,
    favorites: 0,
  };

  stats.forEach((stat) => {
    result.total += stat.count;
    result.exported += stat.exported;
    result.favorites += stat.favorites;
    if (stat._id === "post") result.posts = stat.count;
    if (stat._id === "carousel") result.carousels = stat.count;
  });

  return result;
};

const LinkedInContent: ILinkedInContentModel = (mongoose.models.LinkedInContent as ILinkedInContentModel) || mongoose.model<ILinkedInContent, ILinkedInContentModel>("LinkedInContent", LinkedInContentSchema);

export default LinkedInContent;

// Converted to TypeScript - migrated to Firebase
export interface ILinkedInContent {
  _id?: string;
  id?: string;
  author: string;
  contentType: "post" | "carousel";
  topic: string;
  postContent?: string;
  postType?: "insight" | "story" | "tutorial" | "opinion" | "celebration";
  tone?: "professional" | "casual" | "thoughtful" | "inspiring" | "educational";
  length?: "short" | "medium" | "long";
  hashtags?: string[];
  slides?: {
    slideNumber: number;
    heading: string;
    body: string;
    hasNumber?: boolean;
  }[];
  slideImages?: {
    slideNumber: number;
    imageData?: string;
    mimeType?: string;
    error?: string;
  }[];
  carouselStyle?: "dark_pro" | "light_pro" | "gradient";
  aspectRatio?: "portrait" | "square";
  status: "draft" | "generated" | "failed";
  errorMessage?: string;
  model: string;
  templateUsed?: {
    category?: string;
    templateId?: string;
  };
  metrics?: {
    characterCount?: number;
    wordCount?: number;
    slideCount?: number;
  };
  isExported: boolean;
  exportType: "copy" | "pdf" | "images" | "none";
  exportedAt?: Date;
  notes?: string;
  tags?: string[];
  isFavorite: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type LinkedInContentType = ILinkedInContent;



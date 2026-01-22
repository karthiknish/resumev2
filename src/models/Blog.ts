// Converted to TypeScript - migrated to Firebase
export interface IBlogVersion {
  versionNumber: number;
  title: string;
  content: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  category?: string;
  author: string;
  createdAt: Date;
  changeDescription: string;
}

export interface IBlog {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  slug: string;
  author: string;
  isPublished: boolean;
  category: string;
  viewCount: number;
  likes: string[];
  scheduledPublishAt?: Date | null;
  versions: IBlogVersion[];
  currentVersion: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BlogType = IBlog;


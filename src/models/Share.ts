// Converted to TypeScript - migrated to Firebase
export interface IShare {
  _id?: string;
  id?: string;
  url: string;
  platform: "twitter" | "facebook" | "linkedin" | "whatsapp" | "email" | "reddit" | "pinterest" | "copy" | "native";
  title?: string;
  blogSlug?: string;
  userAgent?: string;
  referrer?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ShareType = IShare;

// Converted to TypeScript - migrated to Firebase
export interface IComment {
  _id?: string;
  id?: string;
  blogPost: string;
  author?: string | null;
  authorName: string;
  authorImage?: string | null;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CommentType = IComment;


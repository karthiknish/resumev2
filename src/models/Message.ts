// Converted to TypeScript - migrated to Firebase
export interface IMessage {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  avatar: string;
}

export type MessageType = IMessage;

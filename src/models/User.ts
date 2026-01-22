// Converted to TypeScript - migrated to Firebase
export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
}

export type UserType = IUser;


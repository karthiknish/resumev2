// Converted to TypeScript - migrated to Firebase
export interface ILanding {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  budget?: string;
  timeline?: string;
  project: string;
  createdAt: Date;
  status: "new" | "contacted" | "in_progress" | "completed" | "declined";
}

export type LandingType = ILanding;

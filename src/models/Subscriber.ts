// Converted to TypeScript - migrated to Firebase
export interface ISubscriber {
  _id?: string;
  id?: string;
  email: string;
  subscribedAt: Date;
  preferences: {
    weeklyDigest: boolean;
    projectUpdates: boolean;
    careerTips: boolean;
    industryNews: boolean;
    productUpdates: boolean;
  };
}

export type SubscriberType = ISubscriber;

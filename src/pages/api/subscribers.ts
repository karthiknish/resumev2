import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "@/lib/firebaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";

const COLLECTION = "subscribers";

interface ISubscriber {
  _id: string;
  email: string;
  subscribedAt: string | Date;
  preferences: Record<string, boolean>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const isAdmin = checkAdminStatus(session);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const db = getFirestore();
    const snapshot = await db.collection(COLLECTION)
      .orderBy("subscribedAt", "desc")
      .get();
    
    const subscribers = snapshot.docs.map(doc => ({
      _id: doc.id,
      ...doc.data()
    })) as unknown as ISubscriber[];

    return res.status(200).json({
      success: true,
      data: subscribers,
      count: subscribers.length,
    });
  } catch (error: unknown) {
    console.error("Subscribers API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscribers",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}


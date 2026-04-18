import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "@/lib/firebaseAdmin";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";

const COLLECTION = "subscribers";

interface ISubscriber {
  _id: string;
  email: string;
  subscribedAt: string | null;
  preferences: Record<string, boolean>;
}

function serializeSubscribedAt(value: unknown): string | null {
  if (value == null) return null;
  if (typeof (value as { toDate?: () => Date }).toDate === "function") {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return null;
    }
  }
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString();
  }
  return null;
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
    const snapshot = await db.collection(COLLECTION).get();

    const subscribers: ISubscriber[] = snapshot.docs.map((doc) => {
      const raw = doc.data() as Record<string, unknown>;
      const prefsRaw = raw.preferences;
      const preferences =
        prefsRaw &&
        typeof prefsRaw === "object" &&
        !Array.isArray(prefsRaw) &&
        prefsRaw !== null
          ? (prefsRaw as Record<string, boolean>)
          : {};

      return {
        _id: doc.id,
        email: String(raw.email ?? ""),
        subscribedAt: serializeSubscribedAt(raw.subscribedAt),
        preferences,
      };
    });

    subscribers.sort((a, b) => {
      const ta = a.subscribedAt ? new Date(a.subscribedAt).getTime() : 0;
      const tb = b.subscribedAt ? new Date(b.subscribedAt).getTime() : 0;
      return tb - ta;
    });

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


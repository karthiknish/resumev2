import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "@/lib/firebaseAdmin";
import { IShare } from "@/models/Share";

const COLLECTION = "shares";

interface ShareRequestBody {
  url: string;
  platform: IShare["platform"];
  title?: string;
  blogSlug?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { url, platform, title, blogSlug } = req.body as ShareRequestBody;

    if (!url || !platform) {
      return res.status(400).json({ error: "url and platform are required" });
    }

    const validPlatforms: IShare["platform"][] = [
      "twitter",
      "facebook",
      "linkedin",
      "whatsapp",
      "email",
      "reddit",
      "pinterest",
      "copy",
      "native",
    ];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: `Invalid platform. Must be one of: ${validPlatforms.join(", ")}` });
    }

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const db = getFirestore();

    const userAgent = req.headers["user-agent"]?.toString() || "";
    const referrer = req.headers.referer?.toString() || req.headers.referrer?.toString() || "";

    const newShare: Omit<IShare, 'id'> = {
      url,
      platform,
      title: title || "",
      blogSlug: blogSlug || "",
      userAgent,
      referrer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection(COLLECTION).add(newShare);

    return res.status(200).json({
      success: true,
      id: docRef.id,
    });
  } catch (error: unknown) {
    console.error("Error tracking share:", error);
    return res.status(500).json({ error: "Failed to track share event" });
  }
}

export async function getShareAnalytics(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { blogSlug, platform, startDate, endDate, limit = 100 } = req.query;

    const db = getFirestore();
    let query: FirebaseFirestore.Query = db.collection(COLLECTION);

    if (blogSlug) {
      query = query.where("blogSlug", "==", blogSlug);
    }
    if (platform) {
      query = query.where("platform", "==", platform);
    }
    if (startDate) {
      query = query.where("createdAt", ">=", new Date(startDate as string));
    }
    if (endDate) {
      query = query.where("createdAt", "<=", new Date(endDate as string));
    }

    const snapshot = await query
      .orderBy("createdAt", "desc")
      .limit(parseInt(limit as string, 10))
      .get();

    const shares = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Manual aggregation as Firestore doesn't support $group easily
    // Note: This fetch all records for aggregation which might be slow
    // For production, consider a separate collection for stats
    const allDocs = await query.get();
    const stats: Record<string, number> = {};
    allDocs.forEach(doc => {
      const p = (doc.data() as IShare).platform;
      stats[p] = (stats[p] || 0) + 1;
    });

    const byPlatform = stats;

    return res.status(200).json({
      shares,
      total,
      byPlatform,
    });
  } catch (error: unknown) {
    console.error("Error fetching share analytics:", error);
    return res.status(500).json({ error: "Failed to fetch share analytics" });
  }
}

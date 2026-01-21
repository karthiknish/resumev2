import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Share from "@/models/Share";

interface ShareRequestBody {
  url: string;
  platform: string;
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

    const validPlatforms = ["twitter", "facebook", "linkedin", "whatsapp", "email", "reddit", "pinterest", "copy", "native"];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: `Invalid platform. Must be one of: ${validPlatforms.join(", ")}` });
    }

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    await dbConnect();

    const userAgent = req.headers["user-agent"]?.toString() || "";
    const referrer = req.headers.referer?.toString() || req.headers.referrer?.toString() || "";

    const share = await Share.create({
      url,
      platform,
      title: title || "",
      blogSlug: blogSlug || "",
      userAgent,
      referrer,
    });

    return res.status(200).json({
      success: true,
      id: share._id,
    });
  } catch (error) {
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

    await dbConnect();

    const query: any = {};
    if (blogSlug) {
      query.blogSlug = blogSlug;
    }
    if (platform) {
      query.platform = platform;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate as string);
      }
    }

    const shares = await Share.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string, 10))
      .lean();

    const total = await Share.countDocuments(query);

    const platformStats = await Share.aggregate([
      { $match: query },
      { $group: { _id: "$platform", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byPlatform = platformStats.reduce((acc: Record<string, number>, stat: any) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return res.status(200).json({
      shares,
      total,
      byPlatform,
    });
  } catch (error) {
    console.error("Error fetching share analytics:", error);
    return res.status(500).json({ error: "Failed to fetch share analytics" });
  }
}

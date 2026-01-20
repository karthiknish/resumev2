import dbConnect from "@/lib/dbConnect";
import Share from "@/models/Share";

/**
 * POST /api/analytics/share
 * Track share events for analytics
 *
 * Request body:
 * - url: string (required) - The URL that was shared
 * - platform: string (required) - The platform used for sharing
 * - title: string (optional) - The title of the content
 * - blogSlug: string (optional) - The blog post slug if applicable
 *
 * Response:
 * - 200: { success: true, id: string }
 * - 400: { error: string }
 * - 405: { message: 'Method not allowed' }
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { url, platform, title, blogSlug } = req.body;

    // Validate required fields
    if (!url || !platform) {
      return res.status(400).json({ error: "url and platform are required" });
    }

    // Validate platform
    const validPlatforms = ["twitter", "facebook", "linkedin", "whatsapp", "email", "reddit", "pinterest", "copy", "native"];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: `Invalid platform. Must be one of: ${validPlatforms.join(", ")}` });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // Connect to database
    await dbConnect();

    // Extract user agent and referrer for analytics
    const userAgent = req.headers["user-agent"] || "";
    const referrer = req.headers.referer || req.headers.referrer || "";

    // Create share record
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

/**
 * GET /api/analytics/share
 * Retrieve share analytics (admin only)
 *
 * Query parameters:
 * - blogSlug: string (optional) - Filter by blog post slug
 * - platform: string (optional) - Filter by platform
 * - startDate: string (optional) - ISO date string to filter from
 * - endDate: string (optional) - ISO date string to filter to
 * - limit: number (optional) - Maximum number of results (default: 100)
 *
 * Response:
 * - 200: { shares: array, total: number, byPlatform: object }
 * - 405: { message: 'Method not allowed' }
 */
export async function getShareAnalytics(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { blogSlug, platform, startDate, endDate, limit = 100 } = req.query;

    await dbConnect();

    // Build query
    const query = {};
    if (blogSlug) {
      query.blogSlug = blogSlug;
    }
    if (platform) {
      query.platform = platform;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const shares = await Share.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .lean();

    const total = await Share.countDocuments(query);

    // Aggregate shares by platform
    const platformStats = await Share.aggregate([
      { $match: query },
      { $group: { _id: "$platform", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byPlatform = platformStats.reduce((acc, stat) => {
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

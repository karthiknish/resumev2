import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios";
import dbConnect from "@/lib/dbConnect"; // Import dbConnect
import ApiUsage from "@/models/ApiUsage"; // Import the new model

// Helper function to check admin status
async function isAdminUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  return (
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    console.error("GNEWS_API_KEY is not defined in environment variables.");
    return res
      .status(500)
      .json({ success: false, message: "News API configuration error." });
  }

  await dbConnect(); // Connect to DB

  const today = getTodayDateString();
  const apiName = "gnews";
  const dailyLimit = 100;

  try {
    // --- Check Usage Limit ---
    const usage = await ApiUsage.findOne({ apiName, date: today });
    const currentCount = usage ? usage.count : 0;

    if (currentCount >= dailyLimit) {
      console.warn(
        `GNews API limit reached for today (${today}). Count: ${currentCount}`
      );
      return res
        .status(429)
        .json({
          success: false,
          message: `Daily API limit (${dailyLimit}) reached for GNews.`,
        });
    }
    // --- End Usage Limit Check ---

    // GNews API parameters
    const query =
      '("web development" OR technology OR software OR AI OR cloud OR programming)';
    const lang = "en";
    const country = "gb";
    const max = 5;
    const sortBy = "publishedAt";
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      query
    )}&lang=${lang}&country=${country}&max=${max}&sortby=${sortBy}&apikey=${apiKey}`;

    const response = await axios.get(url);

    if (response.status !== 200 || !response.data || !response.data.articles) {
      console.error("GNews API Error Response:", response.data);
      throw new Error(
        response.data?.errors?.join(", ") || "Failed to fetch news from GNews"
      );
    }

    // --- Increment Usage Count ---
    await ApiUsage.findOneAndUpdate(
      { apiName, date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true } // Create if doesn't exist, return new doc (optional)
    );
    console.log(
      `GNews API count incremented for ${today}. New count approx: ${
        currentCount + 1
      }`
    );
    // --- End Increment Usage Count ---

    // Map GNews articles to the desired format
    const newsItems = response.data.articles.map((article) => ({
      headline: article.title,
      summary: article.description,
      url: article.url,
    }));

    return res.status(200).json({
      success: true,
      news: newsItems,
    });
  } catch (error) {
    console.error(
      "Error fetching trending news from GNews:",
      error.response?.data || error.message
    );
    const errorMessage =
      error.response?.data?.errors?.join(", ") ||
      error.message ||
      "Error fetching trending news";
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}

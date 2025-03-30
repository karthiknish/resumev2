import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios"; // Import axios

// Helper function to check admin status
async function isAdminUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  return (
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

export default async function handler(req, res) {
  // Check if user is authenticated and is an admin
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

  // Allow GET requests for fetching news
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

  // GNews API parameters
  const query =
    '("web development" OR technology OR software OR AI OR cloud OR programming)'; // Broad tech query
  const lang = "en";
  const country = "gb"; // Focus on UK news primarily
  const max = 5; // Number of articles
  const sortBy = "publishedAt"; // Get the latest

  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
    query
  )}&lang=${lang}&country=${country}&max=${max}&sortby=${sortBy}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.status !== 200 || !response.data || !response.data.articles) {
      console.error("GNews API Error Response:", response.data);
      throw new Error(
        response.data?.errors?.join(", ") || "Failed to fetch news from GNews"
      );
    }

    // Map GNews articles to the desired format
    const newsItems = response.data.articles.map((article) => ({
      headline: article.title,
      summary: article.description, // Use description as summary
      url: article.url, // Include the source URL
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
    // Check for specific GNews error messages if available
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

import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios";
import { getDocument, createDocument, updateDocument, runQuery, fieldFilter } from "@/lib/firebase";
import logger from "@/utils/logger";

async function isAdminUser(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  return (
    (session as any)?.user?.role === "admin" ||
    (session as any)?.user?.isAdmin === true ||
    (session as any)?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) {
    console.error("GNEWS_API_KEY is not defined in environment variables.");
    return res.status(500).json({ success: false, message: "News API configuration error." });
  }

  const today = getTodayDateString();
  const apiName = "gnews";
  const dailyLimit = 100;

  try {
    const usageResults = await runQuery("apiUsage", [
      fieldFilter("apiName", "EQUAL", apiName),
      fieldFilter("date", "EQUAL", today),
    ]);

    const usage = usageResults.length > 0 ? usageResults[0] : null;
    const currentCount = usage ? (usage.count || 0) : 0;

    if (currentCount >= dailyLimit) {
      console.warn(`GNews API limit reached for ${today}. Count: ${currentCount}`);
      return res.status(429).json({
        success: false,
        message: `Daily API limit (${dailyLimit}) reached for GNews.`,
      });
    }

    const query = '("web development" OR technology OR software OR AI OR cloud OR programming)';
    const lang = "en";
    const country = "gb";
    const max = 5;
    const sortBy = "publishedAt";
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&country=${country}&max=${max}&sortby=${sortBy}&apikey=${apiKey}`;

    const response = await axios.get(url);

    const docId = `${apiName}_${today}`;
    if (usage) {
      await updateDocument("apiUsage", usage._id, { count: currentCount + 1 });
    } else {
      await createDocument("apiUsage", docId, { apiName, date: today, count: 1 });
    }
    console.log(`GNews API count incremented for ${today}. New count: ${currentCount + 1}`);

    if (response.status !== 200 || !response.data || !response.data.articles) {
      console.error("GNews API Error Response:", response.data);
      throw new Error("GNews API did not return any relevant articles.");
    }

    const newsItems = response.data.articles.map((article: any) => ({
      headline: article.title,
      summary: article.description,
      url: article.url,
    }));

    return res.status(200).json({ success: true, news: newsItems });
  } catch (error) {
    console.error("Error fetching trending news from GNews:", (error as Error).response?.data || (error as Error).message);
    const errorMessage = `Failed to fetch news: GNews - ${((error as Error).response?.data?.errors?.join(", ") || (error as Error).message)}`;
    return res.status(500).json({ success: false, message: errorMessage, details: (error as Error).message });
  }
}

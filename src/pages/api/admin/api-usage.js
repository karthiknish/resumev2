import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import ApiUsage from "@/models/ApiUsage";

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
  const month = String(today.getMonth() + 1).padStart(2, "0");
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

  await dbConnect();

  const { apiName } = req.query; // Allow filtering by apiName if needed, e.g., ?apiName=gnews
  const today = getTodayDateString();

  try {
    let usageData;
    if (apiName) {
      // Fetch usage for a specific API today
      usageData = await ApiUsage.findOne({
        apiName: apiName,
        date: today,
      }).lean();
      if (!usageData) {
        // If no record exists for today, return 0 count
        usageData = { apiName: apiName, date: today, count: 0 };
      }
    } else {
      // Fetch all usage for today (could be multiple APIs)
      usageData = await ApiUsage.find({ date: today }).lean();
    }

    res.status(200).json({ success: true, data: usageData });
  } catch (error) {
    console.error("Error fetching API usage:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch API usage data." });
  }
}

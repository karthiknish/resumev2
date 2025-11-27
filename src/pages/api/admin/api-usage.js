import dbConnect from "@/lib/dbConnect";
import ApiUsage from "@/models/ApiUsage";
import {
  ApiResponse,
  requireAdmin,
  handleApiError,
} from "@/lib/apiUtils";

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== "GET") {
    return ApiResponse.methodNotAllowed(res, ["GET"]);
  }

  // Check admin authorization
  const { authorized, response } = await requireAdmin(req, res);
  if (!authorized) return response();

  try {
    await dbConnect();
  } catch (error) {
    console.error("[API Usage] Database connection error:", error);
    return ApiResponse.serverError(res, "Database connection failed");
  }

  const { apiName } = req.query;
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

    return ApiResponse.success(res, usageData, "API usage data retrieved");
  } catch (error) {
    return handleApiError(res, error, "API Usage");
  }
}

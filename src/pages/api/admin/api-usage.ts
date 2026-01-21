import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, runQuery, fieldFilter } from "@/lib/firebase";
import { ApiResponse, requireAdmin, handleApiError } from "@/lib/apiUtils";

function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "GET") {
    return ApiResponse.methodNotAllowed(res, ["GET"]);
  }

  const { authorized, response } = await requireAdmin(req, res);
  if (!authorized) return (response as void)();

  const { apiName } = req.query;
  const today = getTodayDateString();

  try {
    let usageData;

    if (apiName) {
      const results = await runQuery(
        "apiUsage",
        [
          fieldFilter("apiName", "EQUAL", apiName),
          fieldFilter("date", "EQUAL", today),
        ]
      );

      if (results.length > 0) {
        usageData = results[0];
      } else {
        usageData = { apiName, date: today, count: 0 };
      }
    } else {
      const results = await runQuery(
        "apiUsage",
        [fieldFilter("date", "EQUAL", today)]
      );
      usageData = results;
    }

    return ApiResponse.success(res, usageData, "API usage data retrieved");
  } catch (error) {
    return handleApiError(res, error, "API Usage");
  }
}

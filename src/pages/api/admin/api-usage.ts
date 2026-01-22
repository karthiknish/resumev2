import { NextApiRequest, NextApiResponse } from "next";
import { getFirestore } from "@/lib/firebaseAdmin";
import { ApiResponse, requireAdmin, handleApiError } from "@/lib/apiUtils";

function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const COLLECTION = "apiUsage";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "GET") {
    return ApiResponse.methodNotAllowed(res, ["GET"]);
  }

  const { authorized, response } = await requireAdmin(req, res);
  if (!authorized && response) return response();

  const { apiName } = req.query;
  const today = getTodayDateString();

  try {
    const db = getFirestore();
    let usageData: unknown;

    if (apiName) {
      const snapshot = await db.collection(COLLECTION)
        .where("apiName", "==", apiName)
        .where("date", "==", today)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        usageData = { _id: doc.id, ...doc.data() };
      } else {
        usageData = { apiName, date: today, count: 0 };
      }
    } else {
      const snapshot = await db.collection(COLLECTION)
        .where("date", "==", today)
        .get();
      usageData = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    }

    return ApiResponse.success(res, usageData, "API usage data retrieved");
  } catch (error: unknown) {
    return handleApiError(res, error, "API Usage");
  }
}

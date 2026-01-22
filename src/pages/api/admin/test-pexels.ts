// Converted to TypeScript - migrated
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    // Use POST to trigger the test
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!PEXELS_API_KEY) {
    console.error("Pexels API key is not configured.");
    return res.status(200).json({
      // Return success=false but 200 OK for the frontend check
      success: false,
      service: "Pexels",
      status: "error",
      error: "API Key Not Configured",
    });
  }

  try {
    console.log("Testing Pexels API connection...");
    // Make a simple request, e.g., search for 'test' with 1 result
    const pexelsUrl = `https://api.pexels.com/v1/search`;
    const response = await axios.get(pexelsUrl, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: "test",
        per_page: 1,
        page: 1,
      },
      // Add a timeout
      timeout: 10000, // 10 seconds
    });

    // Check for successful response (status 2xx)
    if (response.status >= 200 && response.status < 300) {
      console.log("Pexels API test successful.");
      return res
        .status(200)
        .json({ success: true, service: "Pexels", status: "success" });
    } else {
      // This case might not be reached if axios throws for non-2xx status
      console.error(`Pexels API test failed with status: ${response.status}`);
      return res.status(200).json({
        success: false,
        service: "Pexels",
        status: "error",
        error: `API returned status ${response.status}`,
      });
    }
  } catch (error: unknown) {
    let errorMessage = "Failed to connect";
    
    if (axios.isAxiosError(error)) {
      console.error(
        "Pexels API test error:",
        error.response?.data || error.message
      );
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out";
      } else if (error.response) {
        errorMessage = `API Error (${error.response.status}): ${
          error.response.data?.error || error.response.statusText
        }`;
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(200).json({
      // Return 200 OK but indicate failure in the body
      success: false,
      service: "Pexels",
      status: "error",
      error: errorMessage,
    });
  }
}


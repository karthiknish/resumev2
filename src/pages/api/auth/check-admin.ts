import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Get the session
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated
    if (!session) {
      return res.status(401).json({ isAdmin: false, message: "Unauthorized" });
    }

    // Use the utility function for the check
    const isAdmin = checkAdminStatus(session);

    if (isAdmin) {
      return res.status(200).json({ isAdmin: true });
    } else {
      return res
        .status(403)
        .json({
          isAdmin: false,
          message: "Forbidden: Admin privileges required",
        });
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}


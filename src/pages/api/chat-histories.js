import dbConnect from "@/lib/dbConnect";
import ChatHistory from "@/models/ChatHistory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  // Use the utility function for the check
  const isAdmin = checkAdminStatus(session);

  if (!session || !isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin privileges required" });
  }

  if (req.method === "GET") {
    try {
      const histories = await ChatHistory.find({})
        .sort({ createdAt: -1 })
        .limit(50); // Example limit
      res.status(200).json({ success: true, data: histories });
    } catch (error) {
      console.error("Error fetching chat histories:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

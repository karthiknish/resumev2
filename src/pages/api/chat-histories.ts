// Converted to TypeScript - migrated
import { getCollection } from "@/lib/firebase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  const isAdmin = checkAdminStatus(session);

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin privileges required" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const result = await getCollection("chatHistory");
    let histories = result.documents || [];
    
    // Sort by createdAt descending and limit to 50
    histories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    histories = histories.slice(0, 50);

    return res.status(200).json({ success: true, data: histories });
  } catch (error) {
    console.error("Error fetching chat histories:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}


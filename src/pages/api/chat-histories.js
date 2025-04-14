import dbConnect from "@/lib/dbConnect";
import ChatHistory from "@/models/ChatHistory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";

export default async function handler(req, res) {
  await dbConnect();
  const session = await getServerSession(req, res, authOptions);

  // --- Add Logging ---
  console.log(
    "[/api/chat-histories] Session object:",
    JSON.stringify(session, null, 2)
  );
  console.log(
    "[/api/chat-histories] NEXT_PUBLIC_ADMIN_EMAIL:",
    process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
  // --- End Logging ---

  // Use the utility function for the check
  const isAdmin = checkAdminStatus(session);
  console.log("[/api/chat-histories] Admin check result:", isAdmin); // Log check result

  if (!session || !isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin privileges required" });
  }

  if (req.method === "GET") {
    try {
      console.log("[/api/chat-histories] Attempting to find chat histories..."); // Log before find
      const histories = await ChatHistory.find({})
        .sort({ createdAt: -1 })
        .limit(50); // Example limit
      console.log(
        `[/api/chat-histories] Found ${histories?.length ?? 0} histories.`
      ); // Log count found
      // console.log("[/api/chat-histories] Histories data:", JSON.stringify(histories, null, 2)); // Optional: Log full data if needed
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

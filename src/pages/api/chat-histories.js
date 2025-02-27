import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";
import { CHAT_COLLECTION } from "@/models/ChatHistory";

export default async function handler(req, res) {
  // Check if user is authenticated and is an admin
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  // Check for admin role
  const isAdmin =
    session.user.role === "admin" ||
    session.user.isAdmin === true ||
    session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  // Connect to the database
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "resume-chatbot");
    const collection = db.collection(CHAT_COLLECTION);

    // Handle GET method to retrieve chat histories
    if (req.method === "GET") {
      // Get chat histories from MongoDB
      const chatHistories = await collection
        .find({})
        .sort({ lastUpdated: -1 }) // Sort by most recent first
        .limit(20) // Limit to most recent 20 chat histories
        .toArray();

      return res.status(200).json({
        success: true,
        chatHistories,
      });
    }

    // If the method is not supported
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching chat histories",
      error: error.message,
    });
  }
}

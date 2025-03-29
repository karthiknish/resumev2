import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check if user is authenticated and is an admin
  const session = await getServerSession(req, res, authOptions);
  console.log("[API /api/messages] Session:", session); // Log session

  if (!session) {
    console.log("[API /api/messages] Not authenticated");
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  // Check for admin role
  const isAdmin =
    session.user.role === "admin" ||
    session.user.isAdmin === true ||
    session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  console.log("[API /api/messages] Is Admin:", isAdmin); // Log admin status

  if (!isAdmin) {
    console.log("[API /api/messages] Not authorized (not admin)");
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  // Connect to the database
  await dbConnect();
  console.log("[API /api/messages] DB Connected"); // Log DB connection
  // Use ES module import for the Mongoose model
  const Message = (await import("@/models/Message")).default;

  // Handle GET method to retrieve messages
  if (req.method === "GET") {
    console.log("[API /api/messages] Handling GET request");
    try {
      // Get messages from MongoDB using Mongoose
      console.log("[API /api/messages] Attempting to find messages...");
      const messages = await Message.find({})
        .sort({ createdAt: -1 }) // Sort by most recent first
        .limit(100) // Limit to most recent 100 messages
        .lean(); // Convert Mongoose documents to plain JavaScript objects

      console.log(
        `[API /api/messages] Found ${messages?.length || 0} messages.`
      ); // Log count

      return res.status(200).json({
        success: true,
        messages, // Return the fetched messages
      });
    } catch (error) {
      console.error("[API /api/messages] Database error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching messages",
      });
    }
  }

  // Handle POST method to create a new message (for testing purposes)
  if (req.method === "POST") {
    console.log("[API /api/messages] Handling POST request");
     try {
       const { name, email, message } = req.body;

       if (!message) {
         return res.status(400).json({
           success: false,
           message: "Message content is required",
         });
       }

       // Create new message using Mongoose
       const newMessage = new Message({
         name: name || "Anonymous",
         email: email || "anonymous@example.com",
         message,
         isRead: false,
         createdAt: new Date(),
       });

       const result = await newMessage.save();
       console.log("[API /api/messages] Message created:", result._id);

       return res.status(201).json({
         success: true,
         message: "Message created",
         data: result.toObject(),
       });
     } catch (error) {
       console.error("[API /api/messages] Database error on POST:", error);
       return res.status(500).json({
         success: false,
         message: "Error creating message",
       });
     }
  }

  // If the method is not supported
  console.log(`[API /api/messages] Method ${req.method} not allowed`);
  return res.status(405).json({
    success: false,
    message: "Method not allowed",
  });
}

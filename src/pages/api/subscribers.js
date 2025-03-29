import dbConnect from "@/lib/dbConnect";
import Subscriber from "@/models/Subscriber";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // Adjust path if needed

// Helper function to check admin status
async function isAdminUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  return (
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  // Admin check for all methods on this route
  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Admin access required" });
  }

  switch (method) {
    case "GET":
      try {
        // Fetch all subscribers, sorted by subscription date descending
        const subscribers = await Subscriber.find({})
          .sort({ subscribedAt: -1 })
          .lean();
        res.status(200).json({ success: true, data: subscribers });
      } catch (error) {
        console.error("API Subscribers GET Error:", error);
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch subscribers" });
      }
      break;

    // Add DELETE later if needed
    // case "DELETE":
    //   try {
    //     const { id } = req.query;
    //     if (!id) {
    //       return res.status(400).json({ success: false, message: "Subscriber ID is required for deletion." });
    //     }
    //     const deletedSubscriber = await Subscriber.findByIdAndDelete(id);
    //     if (!deletedSubscriber) {
    //       return res.status(404).json({ success: false, message: "Subscriber not found." });
    //     }
    //     res.status(200).json({ success: true, message: "Subscriber deleted successfully." });
    //   } catch (error) {
    //     console.error("API Subscribers DELETE Error:", error);
    //     res.status(500).json({ success: false, message: "Failed to delete subscriber." });
    //   }
    //   break;

    default:
      res.setHeader("Allow", ["GET"]); // Add 'DELETE' later if implemented
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

import dbConnect from "@/lib/dbConnect";
import Byte from "@/models/Byte";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  // Check for admin session for POST requests
  if (method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    const isAdmin =
      session?.user?.role === "admin" ||
      session?.user?.isAdmin === true ||
      session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Admin access required" });
    }
  }

  switch (method) {
    case "GET":
      try {
        // Fetch all bytes, sorted by creation date descending
        const bytes = await Byte.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bytes });
      } catch (error) {
        console.error("API Bytes GET Error:", error);
        res
          .status(400)
          .json({ success: false, message: "Failed to fetch bytes" });
      }
      break;

    case "POST":
      try {
        const byte = await Byte.create(req.body); // Create a new byte
        res.status(201).json({ success: true, data: byte });
      } catch (error) {
        console.error("API Bytes POST Error:", error);
        // Provide more specific error messages if possible (e.g., validation errors)
        res
          .status(400)
          .json({
            success: false,
            message: error.message || "Failed to create byte",
          });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

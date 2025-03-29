import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // Adjust path if needed

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
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  // Admin check
  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Admin access required" });
  }

  try {
    await dbConnect(); // Attempt connection

    // Check connection state
    const connectionState = mongoose.connection.readyState;
    // States: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (connectionState === 1) {
      // Optionally run a simple command like ping to be extra sure
      await mongoose.connection.db.admin().ping();
      res
        .status(200)
        .json({
          success: true,
          message: "MongoDB connection successful.",
          state: connectionState,
        });
    } else {
      throw new Error(`MongoDB connection state is: ${connectionState}`);
    }
  } catch (error) {
    console.error("MongoDB Connection Test Error:", error);
    res.status(500).json({
      success: false,
      message: "MongoDB connection failed.",
      error: error.message,
      state: mongoose.connection.readyState, // Include state even on error
    });
  }
}

import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // Adjust path if needed
import { getAllBytes, createByte } from "@/lib/byteService"; // Import service functions

// Helper function to check admin status (can be moved to a shared util if used elsewhere)
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

  try {
    switch (method) {
      case "GET":
        // Fetch all bytes
        const bytes = await getAllBytes();
        res.status(200).json({ success: true, data: bytes });
        break;

      case "POST":
        // Check for admin privileges before creating
        const isAdmin = await isAdminUser(req, res);
        if (!isAdmin) {
          return res
            .status(403)
            .json({
              success: false,
              message: "Forbidden: Admin access required",
            });
        }

        // Create a new byte using the service function (validation happens inside)
        const newByte = await createByte(req.body);
        res.status(201).json({ success: true, data: newByte });
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    console.error(`API Bytes ${method} Error:`, error);
    // Handle specific errors from the service
    if (error.message.includes("required")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    // Handle potential validation errors if added later in service
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: error.message, errors: error.errors });
    }
    // Generic error
    res
      .status(500)
      .json({
        success: false,
        message: `Failed to ${method === "POST" ? "create" : "fetch"} byte(s).`,
      });
  }
}

import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { updateByte } from "@/lib/byteService"; // Import updateByte
import Byte from "@/models/Byte"; // Keep Byte model for GET/DELETE

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
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  // Check for admin privileges for write/delete operations
  if (method === "PUT" || method === "DELETE") {
    const isAdmin = await isAdminUser(req, res);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Admin access required" });
    }
  }

  switch (method) {
    case "GET":
      try {
        const byte = await Byte.findById(id); // Use model directly for simple find
        if (!byte) {
          return res
            .status(404)
            .json({ success: false, message: "Byte not found" });
        }
        res.status(200).json({ success: true, data: byte });
      } catch (error) {
        console.error(`API Bytes GET /${id} Error:`, error);
        res
          .status(400)
          .json({ success: false, message: "Error fetching byte" });
      }
      break;

    case "PUT":
      try {
        // Use the service function for updating
        const updatedByte = await updateByte(id, req.body);
        console.log(
          `[API /api/bytes PUT] Updated byte ${id}:`,
          JSON.stringify(updatedByte, null, 2)
        );
        res.status(200).json({ success: true, data: updatedByte });
      } catch (error) {
        console.error(`API Bytes PUT /${id} Error:`, error);
        // Service function throws specific errors, catch them here
        if (
          error.message.includes("required") ||
          error.message.includes("not found")
        ) {
          return res
            .status(400)
            .json({ success: false, message: error.message });
        }
        if (error.name === "ValidationError") {
          return res
            .status(400)
            .json({
              success: false,
              message: error.message,
              errors: error.errors,
            });
        }
        res
          .status(500)
          .json({ success: false, message: "Error updating byte" });
      }
      break;

    case "DELETE":
      try {
        const deletedByte = await Byte.findByIdAndDelete(id); // Use model directly
        if (!deletedByte) {
          return res
            .status(404)
            .json({ success: false, message: "Byte not found for deletion" });
        }
        console.log(`[API /api/bytes DELETE] Deleted byte ${id}`);
        res
          .status(200)
          .json({ success: true, message: "Byte deleted successfully" });
      } catch (error) {
        console.error(`API Bytes DELETE /${id} Error:`, error);
        res
          .status(400)
          .json({ success: false, message: "Error deleting byte" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}

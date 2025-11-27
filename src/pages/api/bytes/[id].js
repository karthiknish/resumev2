import dbConnect from "@/lib/dbConnect";
import {
  ApiResponse,
  requireAdmin,
  handleApiError,
  isValidObjectId,
} from "@/lib/apiUtils";
import { updateByte } from "@/lib/byteService";
import Byte from "@/models/Byte";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  // Validate allowed methods
  const allowedMethods = ["GET", "PUT", "DELETE"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  // Validate ID format
  if (!id || !isValidObjectId(id)) {
    return ApiResponse.badRequest(res, "Invalid byte ID format");
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("[Bytes API] Database connection error:", error);
    return ApiResponse.serverError(res, "Database connection failed");
  }

  // Check for admin privileges for write/delete operations
  if (method === "PUT" || method === "DELETE") {
    const { authorized, response } = await requireAdmin(req, res);
    if (!authorized) return response();
  }

  try {
    switch (method) {
      case "GET":
        const byte = await Byte.findById(id).lean();
        if (!byte) {
          return ApiResponse.notFound(res, "Byte not found");
        }
        return ApiResponse.success(res, byte, "Byte retrieved successfully");

      case "PUT":
        const updatedByte = await updateByte(id, req.body);
        if (process.env.NODE_ENV === "development") {
          console.log(`[API /api/bytes PUT] Updated byte ${id}:`, JSON.stringify(updatedByte, null, 2));
        }
        return ApiResponse.success(res, updatedByte, "Byte updated successfully");

      case "DELETE":
        const deletedByte = await Byte.findByIdAndDelete(id);
        if (!deletedByte) {
          return ApiResponse.notFound(res, "Byte not found for deletion");
        }
        if (process.env.NODE_ENV === "development") {
          console.log(`[API /api/bytes DELETE] Deleted byte ${id}`);
        }
        return ApiResponse.success(res, null, "Byte deleted successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    return handleApiError(res, error, `Bytes API [${method}]`);
  }
}

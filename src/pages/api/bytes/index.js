import dbConnect from "@/lib/dbConnect";
import {
  ApiResponse,
  requireAdmin,
  handleApiError,
  parsePagination,
  createPaginationMeta,
} from "@/lib/apiUtils";
import { getAllBytes, createByte } from "@/lib/byteService";

export default async function handler(req, res) {
  const { method } = req;

  // Validate allowed methods
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("[Bytes API] Database connection error:", error);
    return ApiResponse.serverError(res, "Database connection failed");
  }

  try {
    switch (method) {
      case "GET":
        const bytes = await getAllBytes();
        return ApiResponse.success(res, bytes, "Bytes retrieved successfully");

      case "POST":
        // Check for admin privileges before creating
        const { authorized, response } = await requireAdmin(req, res);
        if (!authorized) return response();

        // Log the received body data (for debugging)
        if (process.env.NODE_ENV === "development") {
          console.log("[API /api/bytes POST] Received body:", JSON.stringify(req.body, null, 2));
        }

        // Validate required fields
        if (!req.body.headline || !req.body.body) {
          return ApiResponse.badRequest(res, "Headline and body are required");
        }

        // Create a new byte using the service function
        const newByte = await createByte(req.body);

        if (process.env.NODE_ENV === "development") {
          console.log("[API /api/bytes POST] Byte created:", JSON.stringify(newByte, null, 2));
        }

        return ApiResponse.created(res, newByte, "Byte created successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    return handleApiError(res, error, "Bytes API");
  }
}

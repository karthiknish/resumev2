import {
  getDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/firebase";
import {
  ApiResponse,
  requireAdmin,
  handleApiError,
} from "@/lib/apiUtils";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  const allowedMethods = ["GET", "PUT", "DELETE"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  // Validate ID
  if (!id) {
    return ApiResponse.badRequest(res, "Byte ID is required");
  }

  // Check for admin privileges for write/delete operations
  if (method === "PUT" || method === "DELETE") {
    const { authorized, response } = await requireAdmin(req, res);
    if (!authorized) return response();
  }

  try {
    switch (method) {
      case "GET":
        const byte = await getDocument("bytes", id);
        if (!byte) {
          return ApiResponse.notFound(res, "Byte not found");
        }
        return ApiResponse.success(res, byte, "Byte retrieved successfully");

      case "PUT":
        const existingByte = await getDocument("bytes", id);
        if (!existingByte) {
          return ApiResponse.notFound(res, "Byte not found");
        }

        const updateData = {
          ...req.body,
          updatedAt: new Date(),
        };
        // Remove id from update data if present
        delete updateData.id;
        delete updateData._id;

        const updatedByte = await updateDocument("bytes", id, updateData);
        return ApiResponse.success(res, updatedByte, "Byte updated successfully");

      case "DELETE":
        const byteToDelete = await getDocument("bytes", id);
        if (!byteToDelete) {
          return ApiResponse.notFound(res, "Byte not found for deletion");
        }

        await deleteDocument("bytes", id);
        return ApiResponse.success(res, null, "Byte deleted successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    return handleApiError(res, error, `Bytes API [${method}]`);
  }
}

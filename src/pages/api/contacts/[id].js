import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import {
  ApiResponse,
  requireAdmin,
  handleApiError,
  isValidObjectId,
} from "@/lib/apiUtils";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  // Validate allowed methods
  const allowedMethods = ["GET", "DELETE", "PATCH"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  // Validate ID format
  if (!id || !isValidObjectId(id)) {
    return ApiResponse.badRequest(res, "Invalid contact ID format");
  }

  // Check admin authorization
  const { authorized, response } = await requireAdmin(req, res);
  if (!authorized) return response();

  try {
    await dbConnect();
  } catch (error) {
    console.error("[Contacts API] Database connection error:", error);
    return ApiResponse.serverError(res, "Database connection failed");
  }

  try {
    switch (method) {
      case "GET":
        const contact = await Contact.findById(id).lean();
        if (!contact) {
          return ApiResponse.notFound(res, "Contact not found");
        }
        return ApiResponse.success(res, contact, "Contact retrieved successfully");

      case "PATCH":
        // Update contact (e.g., mark as read)
        const updates = {};
        if (typeof req.body.isRead === "boolean") {
          updates.isRead = req.body.isRead;
        }

        if (Object.keys(updates).length === 0) {
          return ApiResponse.badRequest(res, "No valid fields to update");
        }

        const updatedContact = await Contact.findByIdAndUpdate(
          id,
          { $set: updates },
          { new: true, runValidators: true }
        ).lean();

        if (!updatedContact) {
          return ApiResponse.notFound(res, "Contact not found");
        }

        return ApiResponse.success(res, updatedContact, "Contact updated successfully");

      case "DELETE":
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
          return ApiResponse.notFound(res, "Contact not found");
        }
        return ApiResponse.success(res, null, "Contact deleted successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    return handleApiError(res, error, `Contacts API [${method}]`);
  }
}

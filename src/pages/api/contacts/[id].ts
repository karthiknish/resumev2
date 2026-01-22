// Converted to TypeScript - migrated
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

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  const allowedMethods = ["GET", "DELETE", "PATCH"];
  if (!method || !allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  if (typeof id !== "string") {
    return ApiResponse.badRequest(res, "Contact ID is required and must be a string");
  }

  // Check admin authorization
  const { authorized, response } = await requireAdmin(req, res);
  if (!authorized && response) return response();

  try {
    switch (method) {
      case "GET":
        const contact = await getDocument("contacts", id);
        if (!contact) {
          return ApiResponse.notFound(res, "Contact not found");
        }
        return ApiResponse.success(res, contact, "Contact retrieved successfully");

      case "PATCH":
        const existingContact = await getDocument("contacts", id);
        if (!existingContact) {
          return ApiResponse.notFound(res, "Contact not found");
        }

        const updates: { isRead?: boolean } = {};
        if (typeof req.body.isRead === "boolean") {
          updates.isRead = req.body.isRead;
        }

        if (Object.keys(updates).length === 0) {
          return ApiResponse.badRequest(res, "No valid fields to update");
        }

        const updatedContact = await updateDocument("contacts", id, updates);
        return ApiResponse.success(res, updatedContact, "Contact updated successfully");

      case "DELETE":
        const contactToDelete = await getDocument("contacts", id);
        if (!contactToDelete) {
          return ApiResponse.notFound(res, "Contact not found");
        }

        await deleteDocument("contacts", id);
        return ApiResponse.success(res, null, "Contact deleted successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error: unknown) {
    return handleApiError(res, error, `Contacts API [${method}]`);
  }
}


// Converted to TypeScript - migrated
import {
  getCollection,
  getDocument,
  createDocument,
  updateDocument,
  runQuery,
  fieldFilter,
} from "@/lib/firebase";
import {
  ApiResponse,
  requireAdmin,
  validateBody,
} from "@/lib/apiUtils";

import { NextApiRequest, NextApiResponse } from "next";

interface IContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string | Date;
  isRead: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  const allowedMethods = ["GET", "POST", "PUT"];
  if (!method || !allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  // Admin check for GET and PUT
  if (method === "GET" || method === "PUT") {
    const { authorized, response } = await requireAdmin(req, res);
    if (!authorized && response) return response();
  }

  try {
    switch (method) {
      case "GET":
        // Check for countOnly
        if (req.query.countOnly === "true") {
          let contactCount = 0;
          if (req.query.isRead === "false") {
            const results = (await runQuery(
              "contacts",
              [fieldFilter("isRead", "EQUAL", false)]
            )) as unknown as IContactSubmission[];
            contactCount = results.length;
          } else {
            const result = await getCollection("contacts");
            contactCount = (result.documents || []).length;
          }
          return ApiResponse.success(res, { count: contactCount }, "Contact count retrieved");
        }

        // Fetch all contacts
        const result = await getCollection("contacts");
        let allContacts = (result.documents || []) as unknown as IContactSubmission[];

        // Filter by isRead if specified
        if (req.query.isRead === "true") {
          allContacts = allContacts.filter(c => c.isRead === true);
        } else if (req.query.isRead === "false") {
          allContacts = allContacts.filter(c => c.isRead !== true);
        }

        // Sort by createdAt descending
        allContacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Pagination
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 50;
        const startIndex = (page - 1) * limit;
        const paginatedContacts = allContacts.slice(startIndex, startIndex + limit);

        return ApiResponse.success(
          res,
          {
            contacts: paginatedContacts,
            pagination: {
              page,
              limit,
              total: allContacts.length,
              totalPages: Math.ceil(allContacts.length / limit),
            },
          },
          "Contacts retrieved successfully"
        );

      case "POST":
        // Create new contact submission
        const validation = validateBody(req.body, {
          name: {
            required: true,
            type: "string",
            minLength: 2,
            maxLength: 100,
            sanitize: true,
            message: "Name must be between 2 and 100 characters",
          },
          email: {
            required: true,
            type: "string",
            email: true,
            maxLength: 255,
            message: "Valid email address is required",
          },
          message: {
            required: true,
            type: "string",
            minLength: 10,
            maxLength: 5000,
            sanitize: true,
            message: "Message must be between 10 and 5000 characters",
          },
        });

        if (!validation.isValid) {
          return ApiResponse.badRequest(res, "Validation failed", validation.errors);
        }

        const { name, email, message } = validation.data;
        const docId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

        const newContact = await createDocument("contacts", docId, {
          name,
          email,
          message,
          createdAt: new Date(),
          isRead: false,
        });

        return ApiResponse.created(
          res,
          newContact,
          "Contact submission received. We'll get back to you soon!"
        );

      case "PUT":
        // Update contact (mark as read, etc.)
        const { id: updateId, ...updateFields } = req.body;
        if (!updateId) {
          return ApiResponse.badRequest(res, "Contact ID is required for update");
        }

        const contactToUpdate = await getDocument("contacts", updateId) as unknown as IContactSubmission | null;
        if (!contactToUpdate) {
          return res.status(404).json({ success: false, message: "Contact not found" });
        }

        const updatedContact = await updateDocument("contacts", updateId, updateFields) as unknown as IContactSubmission;
        return ApiResponse.success(res, updatedContact, "Contact updated successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error: unknown) {
    console.error("[Contacts API] Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}


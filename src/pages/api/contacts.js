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

export default async function handler(req, res) {
  const { method } = req;

  const allowedMethods = ["GET", "POST", "PUT"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  // Admin check for GET and PUT
  if (method === "GET" || method === "PUT") {
    const { authorized, response } = await requireAdmin(req, res);
    if (!authorized) return response();
  }

  try {
    switch (method) {
      case "GET":
        // Check for countOnly
        if (req.query.countOnly === "true") {
          let contacts = [];
          if (req.query.isRead === "false") {
            contacts = await runQuery(
              "contacts",
              [fieldFilter("isRead", "EQUAL", false)]
            );
          } else {
            const result = await getCollection("contacts");
            contacts = result.documents || [];
          }
          return ApiResponse.success(res, { count: contacts.length }, "Contact count retrieved");
        }

        // Fetch all contacts
        const result = await getCollection("contacts");
        let contacts = result.documents || [];

        // Filter by isRead if specified
        if (req.query.isRead === "true") {
          contacts = contacts.filter(c => c.isRead === true);
        } else if (req.query.isRead === "false") {
          contacts = contacts.filter(c => c.isRead !== true);
        }

        // Sort by createdAt descending
        contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 50;
        const startIndex = (page - 1) * limit;
        const paginatedContacts = contacts.slice(startIndex, startIndex + limit);

        return ApiResponse.success(
          res,
          {
            contacts: paginatedContacts,
            pagination: {
              page,
              limit,
              total: contacts.length,
              totalPages: Math.ceil(contacts.length / limit),
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
        const docId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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

        const contactToUpdate = await getDocument("contacts", updateId);
        if (!contactToUpdate) {
          return res.status(404).json({ success: false, message: "Contact not found" });
        }

        const updatedContact = await updateDocument("contacts", updateId, updateFields);
        return ApiResponse.success(res, updatedContact, "Contact updated successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    console.error("[Contacts API] Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      error: error.message,
    });
  }
}

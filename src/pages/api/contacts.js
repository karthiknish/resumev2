import dbConnect from "@/lib/dbConnect";
import Contact from "@/models/Contact";
import {
  ApiResponse,
  requireAdmin,
  validateBody,
  parsePagination,
  createPaginationMeta,
  handleApiError,
  isValidEmail,
  isValidObjectId,
} from "@/lib/apiUtils";

export default async function handler(req, res) {
  const { method } = req;

  // Validate allowed methods early
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("[Contacts API] Database connection error:", error);
    return ApiResponse.serverError(res, "Database connection failed");
  }

  // Admin check required for GET (listing)
  if (method === "GET") {
    const { authorized, response } = await requireAdmin(req, res);
    if (!authorized) return response();
  }

  try {
    switch (method) {
      case "GET":
        // Check for countOnly query parameter
        if (req.query.countOnly === "true") {
          const filter =
            req.query.isRead === "false" ? { isRead: { $ne: true } } : {};
          const count = await Contact.countDocuments(filter);
          return ApiResponse.success(res, { count }, "Contact count retrieved");
        }

        // Support pagination
        const { page, limit, skip } = parsePagination(req.query, { page: 1, limit: 50, maxLimit: 200 });
        
        // Build filter
        const filter = {};
        if (req.query.isRead === "true") filter.isRead = true;
        if (req.query.isRead === "false") filter.isRead = { $ne: true };

        // Execute query with pagination
        const [contacts, total] = await Promise.all([
          Contact.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          Contact.countDocuments(filter),
        ]);

        return ApiResponse.success(
          res,
          { contacts, pagination: createPaginationMeta(total, page, limit) },
          "Contacts retrieved successfully"
        );


      case "POST":
        // Validate request body
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
          return ApiResponse.badRequest(
            res,
            "Validation failed",
            validation.errors
          );
        }

        const { name, email, message } = validation.data;

        // Create contact submission
        const newContact = await Contact.create({
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

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    return handleApiError(res, error, "Contacts API");
  }
}

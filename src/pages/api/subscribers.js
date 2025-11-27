import dbConnect from "@/lib/dbConnect";
import Subscriber from "@/models/Subscriber";
import {
  ApiResponse,
  requireAdmin,
  parsePagination,
  createPaginationMeta,
  handleApiError,
  isValidObjectId,
} from "@/lib/apiUtils";

export default async function handler(req, res) {
  const { method } = req;

  // Validate allowed methods
  const allowedMethods = ["GET", "DELETE"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("[Subscribers API] Database connection error:", error);
    return ApiResponse.serverError(res, "Database connection failed");
  }

  // Admin check for all methods on this route
  const { authorized, response } = await requireAdmin(req, res);
  if (!authorized) return response();

  try {
    switch (method) {
      case "GET":
        // Support pagination
        const { page, limit, skip } = parsePagination(req.query, { page: 1, limit: 50, maxLimit: 200 });

        // Execute query with pagination
        const [subscribers, total] = await Promise.all([
          Subscriber.find({})
            .sort({ subscribedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
          Subscriber.countDocuments({}),
        ]);

        return ApiResponse.success(
          res,
          { subscribers, pagination: createPaginationMeta(total, page, limit) },
          "Subscribers retrieved successfully"
        );

      case "DELETE":
        const { id } = req.query;
        
        if (!id) {
          return ApiResponse.badRequest(res, "Subscriber ID is required for deletion");
        }
        
        if (!isValidObjectId(id)) {
          return ApiResponse.badRequest(res, "Invalid subscriber ID format");
        }

        const deletedSubscriber = await Subscriber.findByIdAndDelete(id);
        
        if (!deletedSubscriber) {
          return ApiResponse.notFound(res, "Subscriber not found");
        }

        return ApiResponse.success(res, null, "Subscriber deleted successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    return handleApiError(res, error, "Subscribers API");
  }
}

import {
  getCollection,
  createDocument,
} from "@/lib/firebase";
import {
  ApiResponse,
  requireAdmin,
  handleApiError,
} from "@/lib/apiUtils";

export default async function handler(req, res) {
  const { method } = req;

  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  try {
    switch (method) {
      case "GET":
        const result = await getCollection("bytes");
        let bytes = result.documents || [];
        
        // Sort by createdAt descending
        bytes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return ApiResponse.success(res, bytes, "Bytes retrieved successfully");

      case "POST":
        // Check for admin privileges
        const { authorized, response } = await requireAdmin(req, res);
        if (!authorized) return response();

        // Validate required fields
        if (!req.body.headline || !req.body.body) {
          return ApiResponse.badRequest(res, "Headline and body are required");
        }

        const docId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newByte = await createDocument("bytes", docId, {
          headline: req.body.headline,
          body: req.body.body,
          imageUrl: req.body.imageUrl || "",
          link: req.body.link || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return ApiResponse.created(res, newByte, "Byte created successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    return handleApiError(res, error, "Bytes API");
  }
}

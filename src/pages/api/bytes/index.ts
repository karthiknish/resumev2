import { NextApiRequest, NextApiResponse } from "next";
import {
  getCollection,
  createDocument,
} from "@/lib/firebase";
import {
  ApiResponse,
  requireAdmin,
  handleApiError,
} from "@/lib/apiUtils";

interface ByteData {
  headline: string;
  body: string;
  imageUrl?: string;
  link?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { method } = req;

  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  try {
    switch (method) {
      case "GET":
        const limit = req.query.limit ? parseInt(req.query.limit as string) : null;
        const pageToken = req.query.pageToken ? req.query.pageToken as string : null;

        const result = await getCollection("bytes", {
          pageSize: limit,
          pageToken,
          orderBy: "createdAt desc"
        });

        const bytes = result.documents || [];

        return ApiResponse.success(res, {
          bytes,
          nextPageToken: result.nextPageToken || null
        }, "Bytes retrieved successfully");

      case "POST":
        const { authorized, response } = await requireAdmin(req, res);
        if (!authorized) return (response as void)();

        const body = req.body as ByteData;
        if (!body.headline || !body.body) {
          return ApiResponse.badRequest(res, "Headline and body are required");
        }

        const docId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        const newByte = await createDocument("bytes", docId, {
          headline: body.headline,
          body: body.body,
          imageUrl: body.imageUrl || "",
          link: body.link || "",
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

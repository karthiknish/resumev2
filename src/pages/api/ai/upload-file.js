// src/pages/api/ai/upload-file.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  parseFileFromBase64,
  getFileType,
  isSupportedFileType,
} from "@/lib/fileParser";

/**
 * API endpoint for uploading and parsing files for Agent Mode
 * Supports PDF, DOCX, and TXT files
 *
 * POST /api/ai/upload-file
 *
 * Request body:
 * {
 *   file: string (base64 encoded file),
 *   fileName: string,
 *   mimeType: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     content: string (extracted text content),
 *     fileName: string,
 *     fileType: string
 *   }
 * }
 */
export default async function handler(req, res) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Basic admin check
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { file, fileName, mimeType } = req.body;

    // Validate required fields
    if (!file || !fileName || !mimeType) {
      return res.status(400).json({
        message: "Missing required fields: file, fileName, and mimeType are required",
      });
    }

    // Check if the file type is supported
    if (!isSupportedFileType(mimeType)) {
      return res.status(400).json({
        message: `Unsupported file type: ${mimeType}. Please upload PDF, DOCX, or TXT files.`,
      });
    }

    console.log(`[File Upload] Processing file: ${fileName} (${mimeType})`);

    // Parse the file and extract content
    const content = await parseFileFromBase64(file, mimeType);
    const fileType = getFileType(mimeType);

    console.log(`[File Upload] Successfully extracted ${content.length} characters from ${fileName}`);

    return res.status(200).json({
      success: true,
      data: {
        content,
        fileName,
        fileType,
        contentLength: content.length,
      },
    });
  } catch (error) {
    console.error("[File Upload] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error processing file",
    });
  }
}

// Configure Next.js to handle file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

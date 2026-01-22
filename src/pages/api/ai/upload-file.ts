import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  parseFileFromBase64,
  getFileType,
  isSupportedFileType,
} from "@/lib/fileParser";

interface UploadFileRequestBody {
  file: string;
  fileName: string;
  mimeType: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin =
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { file, fileName, mimeType } = req.body as UploadFileRequestBody;

    if (!file || !fileName || !mimeType) {
      return res.status(400).json({
        message: "Missing required fields: file, fileName, and mimeType are required",
      });
    }

    if (!isSupportedFileType(mimeType)) {
      return res.status(400).json({
        message: `Unsupported file type: ${mimeType}. Please upload PDF, DOCX, or TXT files.`,
      });
    }

    console.log(`[File Upload] Processing file: ${fileName} (${mimeType})`);

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
  } catch (error: unknown) {
    console.error("[File Upload] Error:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error processing file",
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

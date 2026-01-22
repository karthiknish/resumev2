import { NextApiRequest, NextApiResponse } from "next";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import formidable from "formidable";

interface FormidableFile {
  filepath: string;
  newFilename: string;
  originalFilename: string;
  size: number;
  mimetype: string;
}

interface FormidableFiles {
  file: FormidableFile | FormidableFile[];
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "blog");

const ensureUploadDir = async (): Promise<void> => {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await ensureUploadDir();

    const form = formidable({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
      filter: ({ mimetype }: { mimetype?: string }) => {
        return mimetype && mimetype.startsWith("image/");
      },
      filename: (name: string, ext: string) => {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${randomString}${ext}`;
      },
    });

    const [fields, files] = await form.parse(req);

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    if (uploadedFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "File size exceeds 10MB limit" });
    }

    const fileName = uploadedFile.newFilename || uploadedFile.originalFilename;
    const publicUrl = `/uploads/blog/${fileName}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename: fileName,
      size: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to upload file",
    });
  }
}

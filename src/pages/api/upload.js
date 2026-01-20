import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import formidable from "formidable";

// Disable body parser for this route to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const UPLOAD_DIR = join(process.cwd(), "public", "uploads", "blog");

// Ensure upload directory exists
const ensureUploadDir = async () => {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
};

/**
 * POST /api/upload
 * Uploads an image file and returns the public URL
 *
 * Request: multipart/form-data with a "file" field
 * Response: { success: true, url: string } or { success: false, message: string }
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await ensureUploadDir();

    // Parse the incoming form data
    const form = formidable({
      uploadDir: UPLOAD_DIR,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: ({ mimetype }) => {
        // Only allow image files
        return mimetype && mimetype.startsWith("image/");
      },
      filename: (name, ext, part) => {
        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        return `${timestamp}-${randomString}${ext}`;
      },
    });

    const [fields, files] = await form.parse(req);

    // Get the uploaded file
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Check file size
    if (uploadedFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "File size exceeds 10MB limit" });
    }

    // Get the file path and extract filename
    const filePath = uploadedFile.filepath;
    const fileName = uploadedFile.newFilename || uploadedFile.name;

    // Construct the public URL
    const publicUrl = `/uploads/blog/${fileName}`;

    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename: fileName,
      size: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload file",
    });
  }
}

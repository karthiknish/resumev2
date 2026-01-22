import { getDocument, deleteDocument } from "@/lib/firebase";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { email } = req.body as { email: string };

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address provided." });
  }

  try {
    const emailLower = email.toLowerCase();
    
    // Check if subscriber exists
    const subscriber = await getDocument("subscribers", emailLower);
    
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Email not found in our records." });
    }

    // Delete the subscriber
    await deleteDocument("subscribers", emailLower);

    return res.status(200).json({ success: true, message: "Successfully unsubscribed." });
  } catch (error: unknown) {
    console.error("Unsubscribe API Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

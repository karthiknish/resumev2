import { getDocument, updateDocument } from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const { email, preferences } = req.body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email address provided." });
  }

  try {
    const emailLower = email.toLowerCase();
    
    // Check if subscriber exists
    const subscriber = await getDocument("subscribers", emailLower);
    
    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found." });
    }

    // Update preferences
    await updateDocument("subscribers", emailLower, { preferences });

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully.",
      data: preferences,
    });
  } catch (error) {
    console.error("Update Preferences API Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
}
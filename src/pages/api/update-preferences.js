import dbConnect from "@/lib/dbConnect";
import Subscriber from "@/models/Subscriber";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { email, preferences } = req.body;

  // Basic validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address provided." });
  }

  try {
    await dbConnect();

    // Find and update the subscriber's preferences
    const updatedSubscriber = await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { preferences },
      { new: true, runValidators: true }
    );

    if (!updatedSubscriber) {
      return res
        .status(404)
        .json({ success: false, message: "Subscriber not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully.",
      data: updatedSubscriber.preferences,
    });
  } catch (error) {
    console.error("Update Preferences API Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
}
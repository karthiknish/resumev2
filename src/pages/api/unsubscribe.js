import dbConnect from "@/lib/dbConnect";
import Subscriber from "@/models/Subscriber";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { email } = req.body;

  // Basic validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address provided." });
  }

  try {
    await dbConnect();

    // Find and delete the subscriber
    const deletedSubscriber = await Subscriber.findOneAndDelete({
      email: email.toLowerCase(),
    });

    if (!deletedSubscriber) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found in our records." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Successfully unsubscribed." });
  } catch (error) {
    console.error("Unsubscribe API Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
}
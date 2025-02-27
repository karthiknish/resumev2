import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  // This is a test endpoint and should be removed in production
  try {
    // Connect to the database
    await dbConnect();

    // Create a test message
    const testMessage = new Message({
      name: "Read Test User",
      email: "read-test@example.com",
      message:
        "This is a test message for the read functionality at " +
        new Date().toISOString(),
      isRead: false,
      createdAt: new Date(),
      avatar: "/avatars/default.png",
    });

    // Save the test message
    await testMessage.save();

    // Verify it's unread
    const unreadMessage = await Message.findById(testMessage._id);

    if (unreadMessage.isRead) {
      throw new Error("Test failed: Message should be unread initially");
    }

    // Mark it as read
    const updated = await Message.findByIdAndUpdate(
      testMessage._id,
      { isRead: true },
      { new: true }
    );

    // Verify it's now read
    if (!updated.isRead) {
      throw new Error("Test failed: Message should be marked as read");
    }

    // Return the results
    return res.status(200).json({
      success: true,
      message: "Read status test completed successfully",
      databaseConnected: true,
      original: unreadMessage.toObject(),
      updated: updated.toObject(),
      markingAsReadWorks: updated.isRead === true,
    });
  } catch (error) {
    console.error("Mark as read test error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during mark as read test",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}

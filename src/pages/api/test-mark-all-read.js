import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  // This is a test endpoint and should be removed in production
  try {
    // Connect to the database
    await dbConnect();

    // Create a few test messages that are unread
    const testMessages = [];

    for (let i = 0; i < 3; i++) {
      const testMessage = new Message({
        name: `Bulk Test User ${i + 1}`,
        email: `bulk-test-${i + 1}@example.com`,
        message: `This is test message #${
          i + 1
        } for bulk mark as read at ${new Date().toISOString()}`,
        isRead: false,
        createdAt: new Date(),
        avatar: "/avatars/default.png",
      });

      await testMessage.save();
      testMessages.push(testMessage);
    }

    // Verify they're all unread
    const ids = testMessages.map((msg) => msg._id);
    const unreadMessages = await Message.find({ _id: { $in: ids } });

    const allUnread = unreadMessages.every((msg) => !msg.isRead);
    if (!allUnread) {
      throw new Error("Test failed: Some messages were already marked as read");
    }

    // Mark all as read
    const updateResult = await Message.updateMany(
      { _id: { $in: ids } },
      { $set: { isRead: true } }
    );

    // Verify they're all read now
    const readMessages = await Message.find({ _id: { $in: ids } });
    const allRead = readMessages.every((msg) => msg.isRead);

    if (!allRead) {
      throw new Error("Test failed: Not all messages were marked as read");
    }

    // Return the results
    return res.status(200).json({
      success: true,
      message: "Bulk mark as read test completed successfully",
      databaseConnected: true,
      testCount: testMessages.length,
      modifiedCount: updateResult.modifiedCount,
      allUnreadBefore: allUnread,
      allReadAfter: allRead,
      markAllAsReadWorks: allRead,
    });
  } catch (error) {
    console.error("Mark all as read test error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during mark all as read test",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}

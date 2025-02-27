import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export default async function handler(req, res) {
  // This is a test endpoint and should be removed in production
  try {
    // Connect to the database
    await dbConnect();

    // Create a test message
    const testMessage = new Message({
      name: "API Test User",
      email: "test@example.com",
      message:
        "This is a test message from the API test route at " +
        new Date().toISOString(),
      isRead: false,
      createdAt: new Date(),
      avatar: "/avatars/default.png",
    });

    // Save the test message
    await testMessage.save();

    // Retrieve the message we just created
    const retrievedMessage = await Message.findById(testMessage._id);

    // Get total count of messages
    const totalMessages = await Message.countDocuments({});

    // Get a few recent messages
    const recentMessages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Return the results
    return res.status(200).json({
      success: true,
      message: "Test message created and retrieved successfully",
      databaseConnected: true,
      testMessage: retrievedMessage.toObject(),
      totalMessages,
      recentMessages,
      collectionName: Message.collection.name,
    });
  } catch (error) {
    console.error("Chat API test error:", error);
    return res.status(500).json({
      success: false,
      message: "Error during chat API test",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}

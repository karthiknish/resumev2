// src/pages/api/save-chat.js
// This endpoint saves chat sessions to MongoDB
import dbConnect from "@/lib/dbConnect";
import ChatHistory, { createChatRecord } from "@/models/ChatHistory";
// Import mongoose for findOneAndUpdate options
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, messages } = req.body;
    console.log(
      `[/api/save-chat] Received request: email=${email}, messages count=${messages?.length}`
    ); // Log input

    if (!email || !messages || !Array.isArray(messages)) {
      console.log("[/api/save-chat] Invalid input: Missing email or messages."); // Log validation fail
      return res
        .status(400)
        .json({ error: "Email and messages array are required" });
    }

    // Create a chat record data object
    const chatRecordData = createChatRecord(email, messages, req);
    console.log(
      "[/api/save-chat] Prepared chatRecord data:",
      JSON.stringify(chatRecordData, null, 2)
    );

    // Connect using dbConnect which initializes Mongoose connection
    await dbConnect();
    console.log(
      `[/api/save-chat] Mongoose connected. ReadyState: ${mongoose.connection.readyState}`
    );

    // Log DB name from Mongoose connection
    const dbName = mongoose.connection.db.databaseName;
    console.log(`[/api/save-chat] Using database: ${dbName}`);
    console.log(
      `[/api/save-chat] Using collection: ${ChatHistory.collection.name}`
    );

    // Try to find an existing chat record using Mongoose
    console.log(
      `[/api/save-chat] Finding existing chat for email: ${email} using Mongoose`
    );
    const existingChat = await ChatHistory.findOne({ email }).lean(); // Use lean if only reading
    console.log(
      "[/api/save-chat] Result of ChatHistory.findOne:",
      JSON.stringify(existingChat, null, 2)
    );

    if (existingChat) {
      console.log(
        `[/api/save-chat] Updating existing chat for email: ${email} using Mongoose`
      );
      const updateData = { messages, lastUpdated: new Date() };
      // Declare updateResult variable here to avoid redeclaration error
      let updatedDoc = null;
      try {
        updatedDoc = await ChatHistory.findOneAndUpdate(
          { email }, // Filter
          { $set: updateData }, // Update
          { new: true, upsert: false } // Options: return updated doc, don't create if not found
        );
      } catch (dbError) {
        console.error(
          "[/api/save-chat] Error during findOneAndUpdate:",
          dbError
        );
        throw new Error("Database error during chat history update.");
      }
      console.log(
        "[/api/save-chat] Result of findOneAndUpdate:",
        JSON.stringify(updatedDoc?._id, null, 2)
      ); // Log ID of updated doc
      if (!updatedDoc) {
        console.error(
          "[/api/save-chat] Failed to update document, findOneAndUpdate returned null"
        );
        throw new Error("Failed to update chat history.");
      }
    } else {
      console.log(
        `[/api/save-chat] Inserting new chat for email: ${email} using Mongoose`
      );
      // Use the data prepared by createChatRecord
      let newChat = null;
      try {
        newChat = await ChatHistory.create(chatRecordData);
      } catch (dbError) {
        console.error(
          "[/api/save-chat] Error during ChatHistory.create:",
          dbError
        );
        throw new Error("Database error during new chat history save.");
      }
      console.log(
        "[/api/save-chat] Result of ChatHistory.create (new doc ID):",
        JSON.stringify(newChat?._id, null, 2)
      ); // Log ID of new doc
      if (!newChat) {
        console.error(
          "[/api/save-chat] Failed to create document, ChatHistory.create returned null/falsy"
        );
        throw new Error("Failed to save new chat history.");
      }
    }

    console.log(
      "[/api/save-chat] Save operation completed via Mongoose, sending 200 OK."
    );
    // Return success message
    return res.status(200).json({
      success: true,
      message: "Chat history saved successfully to MongoDB",
    });
  } catch (error) {
    console.error("Error saving chat history to MongoDB:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}

// src/lib/byteService.js
import mongoose from "mongoose";
import Byte from "@/models/Byte"; // Adjust path if needed
import { isHTML, htmlToMarkdown, generateSlug } from "./blogUtils"; // Import helpers

// --- Read Operations ---

export async function getAllBytes() {
  // Fetch all bytes, sorted by creation date descending
  const bytes = await Byte.find({}).sort({ createdAt: -1 }).lean(); // Use lean for performance
  return bytes;
}

/**
 * Creates a new byte.
 * @param {object} byteData - Data for the new byte (headline, body, etc.).
 * @returns {Promise<object>} - A promise that resolves to the created byte.
 */
export async function createByte(byteData) {
  // Basic validation
  if (!byteData.headline || !byteData.body) {
    throw new Error("Headline and body are required to create a byte.");
  }

  // Explicitly construct the object to be saved
  const newByteData = {
    headline: byteData.headline,
    body: byteData.body,
  };

  // Conditionally add optional fields if they have a value
  if (byteData.imageUrl) {
    newByteData.imageUrl = byteData.imageUrl;
  }
  if (byteData.link) {
    newByteData.link = byteData.link;
  }

  console.log(
    "[byteService createByte] Data passed to Byte.create:",
    JSON.stringify(newByteData, null, 2)
  );

  const byte = await Byte.create(newByteData);

  console.log(
    "[byteService createByte] Result from Byte.create:",
    JSON.stringify(byte, null, 2)
  );

  return byte;
}

/**
 * Updates an existing byte.
 * @param {string} id - The ID of the byte to update.
 * @param {object} updateData - The data to update the byte with.
 * @returns {Promise<object>} - A promise that resolves to the updated byte.
 */
export async function updateByte(id, updateData) {
   if (!id) {
     throw new Error("Byte ID is required for update.");
   }
   // Basic validation for required fields during update
   if (updateData.headline === '' || updateData.body === '') {
     throw new Error("Headline and body cannot be empty during update.");
   }

   // Log data being used for update
   console.log(`[byteService updateByte] Updating byte ${id} with data:`, JSON.stringify(updateData, null, 2));

   // Find by ID and update
   // Using findByIdAndUpdate ensures atomicity and runs validators by default if 'runValidators: true'
   const updatedByte = await Byte.findByIdAndUpdate(id, updateData, {
     new: true, // Return the modified document rather than the original
     runValidators: true, // Ensure schema validations are run
   });

   if (!updatedByte) {
     throw new Error(`Byte with ID ${id} not found for update.`);
   }

   console.log(`[byteService updateByte] Result for byte ${id}:`, JSON.stringify(updatedByte, null, 2));
   return updatedByte;
}


// Potential future functions: getByteById, deleteByte (already handled in API)

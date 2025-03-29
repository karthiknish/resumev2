// src/lib/byteService.js
import Byte from "@/models/Byte"; // Adjust path if needed

/**
 * Fetches all bytes, sorted by creation date descending.
 * @returns {Promise<Array>} - A promise that resolves to an array of bytes.
 */
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
  // Basic validation (can be enhanced)
  if (!byteData.headline || !byteData.body) {
    throw new Error("Headline and body are required to create a byte.");
  }
  // Add more validation as needed for other fields like imageUrl, link format etc.

  const byte = await Byte.create(byteData);
  return byte;
}

// Potential future functions: getByteById, updateByte, deleteByte

// src/lib/contactService.js
import Contact from "@/models/Contact"; // Adjust path if needed

/**
 * Creates a new contact submission.
 * @param {object} contactData - Data for the new contact.
 * @param {string} contactData.name - Submitter's name.
 * @param {string} contactData.email - Submitter's email.
 * @param {string} contactData.message - Submission message.
 * @returns {Promise<object>} - A promise that resolves to the created contact document.
 */
export async function createContactSubmission(contactData) {
  // Basic validation
  if (!contactData.name || !contactData.email || !contactData.message) {
    throw new Error("Name, email, and message are required.");
  }
  if (!/\S+@\S+\.\S+/.test(contactData.email)) {
    throw new Error("Invalid email address provided.");
  }
  // Add length checks if necessary

  const contact = await Contact.create({
    name: contactData.name,
    email: contactData.email,
    message: contactData.message,
    // createdAt is handled by default in the schema
  });
  return contact;
}

// Potential future functions: getContacts, getContactById, deleteContact

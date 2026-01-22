// Converted to TypeScript - migrated to Firebase
import { getFirestore } from "./firebaseAdmin";
import { IContact } from "@/models/Contact";

const COLLECTION = "contacts";

/**
 * Creates a new contact submission.
 */
export async function createContactSubmission(contactData: Partial<IContact>) {
  if (!contactData.name || !contactData.email || !contactData.message) {
    throw new Error("Name, email, and message are required.");
  }
  if (!/\S+@\S+\.\S+/.test(contactData.email)) {
    throw new Error("Invalid email address provided.");
  }

  const db = getFirestore();
  const newContact = {
    name: contactData.name,
    email: contactData.email,
    message: contactData.message,
    createdAt: new Date(),
  };

  const docRef = await db.collection(COLLECTION).add(newContact);
  return { id: docRef.id, ...newContact };
}


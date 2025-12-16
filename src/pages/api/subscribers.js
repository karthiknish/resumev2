// Fetch subscribers from Firebase Firestore

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// Parse Firestore value to JS value
function parseFirestoreValue(value) {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return parseInt(value.integerValue);
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return new Date(value.timestampValue);
  if (value.nullValue !== undefined) return null;
  if (value.mapValue !== undefined) {
    const result = {};
    for (const [k, v] of Object.entries(value.mapValue.fields || {})) {
      result[k] = parseFirestoreValue(v);
    }
    return result;
  }
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values || []).map(parseFirestoreValue);
  }
  return null;
}

// Parse Firestore document to JS object
function parseDocument(doc) {
  const result = { _id: doc.name.split("/").pop() };
  for (const [key, value] of Object.entries(doc.fields || {})) {
    result[key] = parseFirestoreValue(value);
  }
  return result;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    // Fetch all subscribers from Firebase
    const url = `${FIRESTORE_URL}/subscribers?key=${FIREBASE_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to fetch subscribers");
    }
    
    const data = await response.json();
    const documents = data.documents || [];
    
    // Parse documents to subscriber objects
    const subscribers = documents.map(parseDocument).sort((a, b) => {
      const dateA = a.subscribedAt || new Date(0);
      const dateB = b.subscribedAt || new Date(0);
      return dateB - dateA; // Sort by most recent first
    });

    return res.status(200).json({
      success: true,
      data: subscribers,
      count: subscribers.length,
    });
  } catch (error) {
    console.error("Subscribers API Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscribers",
      error: error.message,
    });
  }
}

/**
 * Migration Script: Bytes from MongoDB to Firebase
 * 
 * Usage: node scripts/migrate-bytes.mjs
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!MONGODB_URI || !FIREBASE_PROJECT_ID || !FIREBASE_API_KEY) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// Byte Schema
const ByteSchema = new mongoose.Schema({
  headline: String,
  body: String,
  imageUrl: String,
  link: String,
}, { timestamps: true });

// Convert JS object to Firestore document format
function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (typeof value === "string") return { stringValue: value };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (value instanceof mongoose.Types.ObjectId) return { stringValue: value.toString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  if (typeof value === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      if (k !== "_id" && k !== "__v") fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

async function createDocument(collection, docId, data) {
  const url = `${FIRESTORE_URL}/${collection}?documentId=${encodeURIComponent(docId)}&key=${FIREBASE_API_KEY}`;
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (key !== "_id" && key !== "__v") fields[key] = toFirestoreValue(value);
  }
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to create document");
  }
  return response.json();
}

async function documentExists(collection, docId) {
  const url = `${FIRESTORE_URL}/${collection}/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
  const response = await fetch(url);
  return response.ok;
}

async function migrate() {
  console.log("🚀 Starting Bytes migration...\n");

  try {
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected\n");

    const Byte = mongoose.models.Byte || mongoose.model("Byte", ByteSchema);
    const bytes = await Byte.find({}).lean();
    console.log(`📱 Found ${bytes.length} bytes in MongoDB`);

    let migrated = 0, skipped = 0, errors = 0;

    for (const byte of bytes) {
      try {
        const docId = byte._id.toString();
        if (await documentExists("bytes", docId)) {
          console.log(`   ⏭️ Skipping "${byte.headline?.substring(0, 40)}..." (exists)`);
          skipped++;
          continue;
        }

        await createDocument("bytes", docId, {
          headline: byte.headline || "",
          body: byte.body || "",
          imageUrl: byte.imageUrl || "",
          link: byte.link || "",
          createdAt: byte.createdAt || new Date(),
          updatedAt: byte.updatedAt || new Date(),
          migratedFrom: "mongodb",
        });

        console.log(`   ✅ Migrated "${byte.headline?.substring(0, 50)}..."`);
        migrated++;
      } catch (err) {
        console.error(`   ❌ Failed: ${err.message}`);
        errors++;
      }
    }

    await mongoose.disconnect();
    
    console.log("\n🎉 Migration complete!");
    console.log(`📊 Summary: ${migrated} migrated, ${skipped} skipped, ${errors} errors (${bytes.length} total)`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

migrate();

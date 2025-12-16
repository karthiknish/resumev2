/**
 * Migration Script: MongoDB to Firebase (using REST API)
 * 
 * This script exports subscribers from MongoDB and imports them to Firebase Firestore
 * using the Firebase REST API to avoid Node.js 25 compatibility issues with firebase-admin.
 * 
 * Usage: node scripts/migrate-to-firebase.mjs
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment");
  process.exit(1);
}

if (!FIREBASE_PROJECT_ID || !FIREBASE_API_KEY) {
  console.error("❌ Firebase config not found in environment");
  process.exit(1);
}

// Firestore REST API base URL
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// Define the Subscriber schema
const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    weeklyDigest: { type: Boolean, default: true },
    projectUpdates: { type: Boolean, default: true },
    careerTips: { type: Boolean, default: true },
    industryNews: { type: Boolean, default: true },
    productUpdates: { type: Boolean, default: true },
  },
});

// Convert JS object to Firestore document format
function toFirestoreValue(value) {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === "boolean") {
    return { booleanValue: value };
  }
  if (typeof value === "number") {
    return { integerValue: String(value) };
  }
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

// Check if document exists
async function documentExists(email) {
  const docId = encodeURIComponent(email);
  const url = `${FIRESTORE_URL}/subscribers/${docId}?key=${FIREBASE_API_KEY}`;
  
  const response = await fetch(url);
  return response.ok;
}

// Create a document in Firestore
async function createDocument(email, data) {
  const docId = encodeURIComponent(email);
  const url = `${FIRESTORE_URL}/subscribers?documentId=${docId}&key=${FIREBASE_API_KEY}`;
  
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
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

async function migrate() {
  console.log("🚀 Starting MongoDB to Firebase migration...\n");

  try {
    // 1. Connect to MongoDB
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // 2. Get the Subscriber model
    const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);

    // 3. Fetch all subscribers from MongoDB
    console.log("📥 Fetching subscribers from MongoDB...");
    const subscribers = await Subscriber.find({}).lean();
    console.log(`✅ Found ${subscribers.length} subscribers\n`);

    if (subscribers.length === 0) {
      console.log("ℹ️ No subscribers to migrate. Exiting.");
      await mongoose.disconnect();
      process.exit(0);
    }

    // 4. Migrate each subscriber to Firebase
    console.log("📤 Migrating to Firebase Firestore...");
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const subscriber of subscribers) {
      try {
        // Check if already exists
        const exists = await documentExists(subscriber.email);
        
        if (exists) {
          console.log(`  ⏭️ Skipping ${subscriber.email} (already exists)`);
          skippedCount++;
          continue;
        }

        // Create document
        await createDocument(subscriber.email, {
          email: subscriber.email,
          subscribedAt: subscriber.subscribedAt || new Date(),
          preferences: subscriber.preferences || {
            weeklyDigest: true,
            projectUpdates: true,
            careerTips: true,
            industryNews: true,
            productUpdates: true,
          },
          migratedFrom: "mongodb",
          migratedAt: new Date(),
        });
        
        console.log(`  ✅ Migrated ${subscriber.email}`);
        migratedCount++;
      } catch (err) {
        console.error(`  ❌ Failed to migrate ${subscriber.email}:`, err.message);
        errorCount++;
      }
    }

    // 5. Disconnect from MongoDB
    await mongoose.disconnect();
    
    // Summary
    console.log("\n🎉 Migration complete!\n");
    console.log("📊 Summary:");
    console.log(`   - Total in MongoDB: ${subscribers.length}`);
    console.log(`   - Migrated: ${migratedCount}`);
    console.log(`   - Skipped (already in Firebase): ${skippedCount}`);
    console.log(`   - Errors: ${errorCount}`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the migration
migrate();

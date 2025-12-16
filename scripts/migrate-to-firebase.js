/**
 * Migration Script: MongoDB to Firebase
 * 
 * This script exports subscribers from MongoDB and imports them to Firebase Firestore.
 * 
 * Usage: node scripts/migrate-to-firebase.js
 */

const mongoose = require("mongoose");
const admin = require("firebase-admin");

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://karthiknish:Proficiweb@karthik.dinsncw.mongodb.net/?retryWrites=true&w=majority";

// Firebase project ID
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "karthiknish-6d10a";

// Define the Subscriber schema (same as in models/Subscriber.js)
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

async function migrate() {
  console.log("🚀 Starting MongoDB to Firebase migration...\n");

  try {
    // 1. Connect to MongoDB
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // 2. Initialize Firebase Admin
    console.log("🔥 Initializing Firebase Admin...");
    if (admin.apps.length === 0) {
      admin.initializeApp({
        projectId: FIREBASE_PROJECT_ID,
      });
    }
    const db = admin.firestore();
    console.log("✅ Firebase initialized\n");

    // 3. Get the Subscriber model
    const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);

    // 4. Fetch all subscribers from MongoDB
    console.log("📥 Fetching subscribers from MongoDB...");
    const subscribers = await Subscriber.find({}).lean();
    console.log(`✅ Found ${subscribers.length} subscribers\n`);

    if (subscribers.length === 0) {
      console.log("ℹ️ No subscribers to migrate. Exiting.");
      await mongoose.disconnect();
      return;
    }

    // 5. Migrate each subscriber to Firebase
    console.log("📤 Migrating to Firebase Firestore...");
    const batch = db.batch();
    let migratedCount = 0;
    let skippedCount = 0;

    for (const subscriber of subscribers) {
      const docRef = db.collection("subscribers").doc(subscriber.email);
      
      // Check if already exists
      const existingDoc = await docRef.get();
      if (existingDoc.exists) {
        console.log(`  ⏭️ Skipping ${subscriber.email} (already exists)`);
        skippedCount++;
        continue;
      }

      batch.set(docRef, {
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
      
      console.log(`  ✅ Queued ${subscriber.email}`);
      migratedCount++;
    }

    // Commit the batch
    if (migratedCount > 0) {
      await batch.commit();
      console.log(`\n✅ Successfully migrated ${migratedCount} subscribers`);
    }
    
    if (skippedCount > 0) {
      console.log(`ℹ️ Skipped ${skippedCount} existing subscribers`);
    }

    // 6. Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("\n🎉 Migration complete!");

    // Summary
    console.log("\n📊 Summary:");
    console.log(`   - Total in MongoDB: ${subscribers.length}`);
    console.log(`   - Migrated: ${migratedCount}`);
    console.log(`   - Skipped (already in Firebase): ${skippedCount}`);

  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the migration
migrate();

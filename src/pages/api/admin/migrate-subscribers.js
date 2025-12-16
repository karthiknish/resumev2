import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import Subscriber from "@/models/Subscriber";

// Use dynamic import for firebase-admin to avoid build issues
let adminDb = null;

async function getFirestoreDb() {
  if (adminDb) return adminDb;
  
  const admin = (await import("firebase-admin")).default;
  
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
  
  adminDb = admin.firestore();
  return adminDb;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  // Check authentication - only admin can run migration
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    // Also check for localhost bypass
    const isLocalhost = req.headers.host?.includes("localhost");
    if (!isLocalhost) {
      return res.status(403).json({ success: false, message: "Unauthorized - Admin access required" });
    }
  }

  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Fetch all subscribers from MongoDB
    const subscribers = await Subscriber.find({}).lean();
    
    if (subscribers.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No subscribers to migrate",
        totalInMongoDB: 0,
        migrated: 0,
        skipped: 0,
      });
    }

    // Initialize Firebase
    const db = await getFirestoreDb();
    
    let migratedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // Migrate each subscriber
    for (const subscriber of subscribers) {
      try {
        const docRef = db.collection("subscribers").doc(subscriber.email);
        const existingDoc = await docRef.get();
        
        if (existingDoc.exists) {
          skippedCount++;
          continue;
        }

        await docRef.set({
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
        
        migratedCount++;
      } catch (error) {
        errors.push({ email: subscriber.email, error: error.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Migration complete: ${migratedCount} migrated, ${skippedCount} skipped`,
      totalInMongoDB: subscribers.length,
      migrated: migratedCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return res.status(500).json({
      success: false,
      message: "Migration failed",
      error: error.message,
    });
  }
}

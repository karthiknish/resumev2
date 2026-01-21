// Converted to TypeScript - migrated
/**
 * Firebase Admin SDK Initialization
 * For server-side operations with Firebase
 */

import admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    // For local development, use the project ID from env
    // In production, you would use a service account JSON file
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    
    if (!projectId) {
      throw new Error("Firebase Project ID not configured in environment variables");
    }

    admin.initializeApp({
      projectId,
      // For full admin access, you would use a service account:
      // credential: admin.credential.cert(serviceAccount),
    });
  }
  
  return admin;
}

// Get Firestore instance
export function getFirestore() {
  const adminInstance = getFirebaseAdmin();
  return adminInstance.firestore();
}

// Get Auth instance
export function getAuth() {
  const adminInstance = getFirebaseAdmin();
  return adminInstance.auth();
}

export default getFirebaseAdmin;


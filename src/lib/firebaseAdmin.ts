// Converted to TypeScript - migrated
/**
 * Firebase Admin SDK Initialization
 * For server-side operations with Firebase
 *
 * Dev: use `npm run dev` (Webpack). `firebase-admin` breaks under Turbopack (`npm run dev:turbo`).
 */

import admin from "firebase-admin";

function getFirebaseAdmin() {
  if (admin.apps.length === 0) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!projectId) {
      throw new Error("Firebase Project ID not configured in environment variables");
    }

    admin.initializeApp({
      projectId,
      // For full admin access, use service account:
      // credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin;
}

export function getFirestore() {
  return getFirebaseAdmin().firestore();
}

export function getAuth() {
  return getFirebaseAdmin().auth();
}

export default getFirebaseAdmin;

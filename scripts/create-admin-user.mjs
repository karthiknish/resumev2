import 'dotenv/config';
import bcrypt from 'bcryptjs';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

async function createAdminUser() {
  const email = "karthik.nishanth06@gmail.com";
  const docId = email.toLowerCase().replace(/[^a-z0-9]/g, "_");
  
  // Create a temporary password - you'll need to reset this or use your actual password
  const password = process.argv[2] || "TempAdmin123!";
  const hashedPassword = await bcrypt.hash(password, 12);

  const userData = {
    fields: {
      name: { stringValue: "Karthik Nishanth" },
      email: { stringValue: email.toLowerCase() },
      password: { stringValue: hashedPassword },
      role: { stringValue: "admin" },
      createdAt: { timestampValue: new Date().toISOString() },
    }
  };

  const url = `${FIRESTORE_URL}/users?documentId=${docId}&key=${FIREBASE_API_KEY}`;
  console.log("Creating admin user in Firestore...");
  console.log("Email:", email);
  console.log("Doc ID:", docId);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const result = await response.json();
  
  if (response.ok) {
    console.log("✓ Admin user created successfully!");
    console.log("You can now login with:", email);
  } else {
    console.log("Error:", response.status);
    console.log(JSON.stringify(result, null, 2));
  }
}

createAdminUser();

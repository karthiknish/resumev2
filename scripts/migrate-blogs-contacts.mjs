/**
 * Migration Script: Blogs and Contacts from MongoDB to Firebase
 * 
 * Usage: node scripts/migrate-blogs-contacts.mjs
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configuration
const MONGODB_URI = process.env.MONGODB_URI;
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!MONGODB_URI || !FIREBASE_PROJECT_ID || !FIREBASE_API_KEY) {
  console.error("❌ Missing required environment variables");
  process.exit(1);
}

// Firestore REST API base URL
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// Blog Schema
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  description: String,
  imageUrl: String,
  tags: [String],
  slug: String,
  author: mongoose.Schema.Types.ObjectId,
  isPublished: Boolean,
  category: String,
  viewCount: Number,
  likes: [String],
  scheduledPublishAt: Date,
}, { timestamps: true });

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
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
    if (Number.isInteger(value)) {
      return { integerValue: String(value) };
    }
    return { doubleValue: value };
  }
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }
  if (value instanceof mongoose.Types.ObjectId) {
    return { stringValue: value.toString() };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      if (k !== "_id" && k !== "__v") {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

// Create a document in Firestore
async function createDocument(collection, docId, data) {
  const url = `${FIRESTORE_URL}/${collection}?documentId=${encodeURIComponent(docId)}&key=${FIREBASE_API_KEY}`;
  
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (key !== "_id" && key !== "__v") {
      fields[key] = toFirestoreValue(value);
    }
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

// Check if document exists
async function documentExists(collection, docId) {
  const url = `${FIRESTORE_URL}/${collection}/${encodeURIComponent(docId)}?key=${FIREBASE_API_KEY}`;
  const response = await fetch(url);
  return response.ok;
}

async function migrateBlogs() {
  console.log("\n📚 Migrating Blogs...");
  
  const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
  const blogs = await Blog.find({}).lean();
  
  console.log(`   Found ${blogs.length} blogs in MongoDB`);
  
  let migrated = 0, skipped = 0, errors = 0;
  
  for (const blog of blogs) {
    try {
      const docId = blog.slug || blog._id.toString();
      
      if (await documentExists("blogs", docId)) {
        console.log(`   ⏭️ Skipping "${blog.title}" (exists)`);
        skipped++;
        continue;
      }
      
      await createDocument("blogs", docId, {
        title: blog.title,
        content: blog.content,
        description: blog.description,
        imageUrl: blog.imageUrl || "",
        tags: blog.tags || [],
        slug: blog.slug,
        authorId: blog.author?.toString() || "",
        isPublished: blog.isPublished || false,
        category: blog.category || "Uncategorized",
        viewCount: blog.viewCount || 0,
        likes: blog.likes || [],
        scheduledPublishAt: blog.scheduledPublishAt,
        createdAt: blog.createdAt || new Date(),
        updatedAt: blog.updatedAt || new Date(),
        migratedFrom: "mongodb",
      });
      
      console.log(`   ✅ Migrated "${blog.title}"`);
      migrated++;
    } catch (err) {
      console.error(`   ❌ Failed "${blog.title}": ${err.message}`);
      errors++;
    }
  }
  
  return { total: blogs.length, migrated, skipped, errors };
}

async function migrateContacts() {
  console.log("\n📧 Migrating Contacts...");
  
  const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
  const contacts = await Contact.find({}).lean();
  
  console.log(`   Found ${contacts.length} contacts in MongoDB`);
  
  let migrated = 0, skipped = 0, errors = 0;
  
  for (const contact of contacts) {
    try {
      const docId = contact._id.toString();
      
      if (await documentExists("contacts", docId)) {
        console.log(`   ⏭️ Skipping ${contact.email} (exists)`);
        skipped++;
        continue;
      }
      
      await createDocument("contacts", docId, {
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt || new Date(),
        isRead: contact.isRead || false,
        migratedFrom: "mongodb",
      });
      
      console.log(`   ✅ Migrated contact from ${contact.email}`);
      migrated++;
    } catch (err) {
      console.error(`   ❌ Failed ${contact.email}: ${err.message}`);
      errors++;
    }
  }
  
  return { total: contacts.length, migrated, skipped, errors };
}

async function migrate() {
  console.log("🚀 Starting MongoDB to Firebase migration (Blogs & Contacts)...\n");

  try {
    // Connect to MongoDB
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Migrate Blogs
    const blogResults = await migrateBlogs();
    
    // Migrate Contacts
    const contactResults = await migrateContacts();

    // Disconnect
    await mongoose.disconnect();
    
    // Summary
    console.log("\n🎉 Migration complete!\n");
    console.log("📊 Summary:");
    console.log(`   Blogs: ${blogResults.migrated} migrated, ${blogResults.skipped} skipped, ${blogResults.errors} errors (${blogResults.total} total)`);
    console.log(`   Contacts: ${contactResults.migrated} migrated, ${contactResults.skipped} skipped, ${contactResults.errors} errors (${contactResults.total} total)`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    process.exit(1);
  }
}

migrate();

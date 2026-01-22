// Converted to TypeScript - migrated to Firebase
import { getFirestore } from "./firebaseAdmin";
import { IBlog } from "@/models/Blog";
import { isHTML, htmlToMarkdown, generateSlug } from "./blogUtils";

const COLLECTION = "blogs";

interface BlogAuthor {
  _id: string;
  id: string;
  name?: string;
  image?: string;
}

interface EnrichedBlog extends Omit<IBlog, "author"> {
  author?: string | BlogAuthor;
}

// --- Read Operations ---

export async function getBlogBySlug(slug: string): Promise<EnrichedBlog | null> {
  if (!slug) throw new Error("Slug is required to fetch blog post.");
  
  const db = getFirestore();
  const snapshot = await db.collection(COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  const blog = { id: doc.id, ...doc.data() } as EnrichedBlog;
  
  // Manual population of author if needed
  if (blog.author && typeof blog.author === "string") {
    const userDoc = await db.collection("users").doc(blog.author).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      blog.author = {
        _id: userDoc.id,
        id: userDoc.id,
        name: userData?.name,
        image: userData?.image
      };
    }
  }

  return blog;
}

export async function getBlogById(id: string): Promise<EnrichedBlog | null> {
  if (!id) throw new Error("Valid Blog ID is required.");
  
  const db = getFirestore();
  const doc = await db.collection(COLLECTION).doc(id).get();
  
  if (!doc.exists) return null;
  
  const blog = { id: doc.id, ...doc.data() } as EnrichedBlog;

  // Manual population
  if (blog.author && typeof blog.author === "string") {
    const userDoc = await db.collection("users").doc(blog.author).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      blog.author = {
        _id: userDoc.id,
        id: userDoc.id,
        name: userData?.name,
        image: userData?.image
      };
    }
  }
  
  return blog;
}

export async function getPaginatedBlogs(page = 1, limit = 10, filter: Record<string, unknown> = {}): Promise<{ blogs: EnrichedBlog[], pagination: { page: number, limit: number, totalPages: number, total: number } }> {
  const db = getFirestore();
  let query: FirebaseFirestore.Query = db.collection(COLLECTION);
  
  // Apply filters
  for (const [key, value] of Object.entries(filter)) {
    query = query.where(key, "==", value);
  }
  
  // Get total count
  const countSnapshot = await query.count().get();
  const total = countSnapshot.data().count;
  
  // Apply sorting and pagination
  const snapshot = await query
    .orderBy("createdAt", "desc")
    .offset((page - 1) * limit)
    .limit(limit)
    .get();

  const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnrichedBlog));

  const totalPages = Math.ceil(total / limit);
  return { blogs, pagination: { page, limit, totalPages, total } };
}

// --- Write Operations ---

export async function createBlog(blogData: Partial<IBlog>) {
  if (!blogData.title || !blogData.content || !blogData.description || !blogData.author) {
    throw new Error("Missing required fields for blog creation.");
  }

  if (blogData.content && isHTML(blogData.content)) {
    blogData.content = htmlToMarkdown(blogData.content);
  }
  blogData.slug = generateSlug(blogData.title!);

  const db = getFirestore();
  
  // Check for duplicate slug
  const existing = await db.collection(COLLECTION)
    .where("slug", "==", blogData.slug)
    .limit(1)
    .get();
    
  if (!existing.empty) {
    throw new Error(`Blog post with slug "${blogData.slug}" already exists.`);
  }

  const now = new Date();
  const newBlog = {
    ...blogData,
    createdAt: now,
    updatedAt: now,
    viewCount: 0,
    likes: [],
    isPublished: blogData.isPublished || false,
    currentVersion: 1,
    versions: []
  };

  const docRef = await db.collection(COLLECTION).add(newBlog);
  return { id: docRef.id, ...newBlog };
}

export async function updateBlog(id: string, updateData: Partial<IBlog>) {
  if (!id) throw new Error("Valid Blog ID is required for update.");

  if (updateData.content && isHTML(updateData.content)) {
    updateData.content = htmlToMarkdown(updateData.content);
  }
  
  if (updateData.title) {
    updateData.slug = generateSlug(updateData.title);
    
    const db = getFirestore();
    const existing = await db.collection(COLLECTION)
      .where("slug", "==", updateData.slug)
      .limit(1)
      .get();
      
    if (!existing.empty && existing.docs[0].id !== id) {
      throw new Error(`Another blog post with the slug "${updateData.slug}" already exists.`);
    }
  }

  const db = getFirestore();
  const blogRef = db.collection(COLLECTION).doc(id);
  
  const doc = await blogRef.get();
  if (!doc.exists) {
    throw new Error("Blog not found during update");
  }

  const now = new Date();
  const finalUpdate = {
    ...updateData,
    updatedAt: now
  };

  await blogRef.update(finalUpdate);
  return { id, ...doc.data(), ...finalUpdate };
}

export async function deleteBlog(id: string) {
  if (!id) throw new Error("Valid Blog ID is required for deletion.");
  
  const db = getFirestore();
  const blogRef = db.collection(COLLECTION).doc(id);
  
  const doc = await blogRef.get();
  if (!doc.exists) {
    throw new Error("Blog not found for deletion");
  }
  
  const deletedData = { id: doc.id, ...doc.data() };
  await blogRef.delete();
  
  return deletedData;
}


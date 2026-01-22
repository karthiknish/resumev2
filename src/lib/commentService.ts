// Converted to TypeScript - migrated to Firebase
import { getFirestore } from "./firebaseAdmin";
import { IComment } from "@/models/Comment";
import { AppSession } from "./apiUtils";

const COLLECTION = "comments";

interface CommentAuthor {
  _id: string;
  id: string;
  name?: string;
  image?: string;
}

interface EnrichedComment extends Omit<IComment, "author"> {
  author?: string | CommentAuthor | null;
}

/**
 * Fetches comments for a specific blog post.
 */
export async function getCommentsByPostId(blogPostId: string) {
  if (!blogPostId) {
    throw new Error("Valid Blog Post ID is required.");
  }

  const db = getFirestore();
  const snapshot = await db.collection(COLLECTION)
    .where("blogPost", "==", blogPostId)
    .orderBy("createdAt", "asc")
    .get();

  const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EnrichedComment[];

  // Manual population of authors
  for (const comment of comments) {
    if (comment.author && typeof comment.author === "string") {
      const userDoc = await db.collection("users").doc(comment.author).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        comment.author = {
          _id: userDoc.id,
          id: userDoc.id,
          name: userData?.name,
          image: userData?.image
        };
      }
    }
  }

  return comments;
}

/**
 * Creates a new comment for a blog post.
 */
export async function createComment({
  blogPostId,
  text,
  sessionUser,
  anonymousName,
}: {
  blogPostId: string;
  text: string;
  sessionUser?: AppSession["user"];
  anonymousName?: string;
}) {
  if (!blogPostId) {
    throw new Error("Valid Blog Post ID is required.");
  }
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Comment text cannot be empty.");
  }
  if (text.length > 2000) {
    throw new Error("Comment exceeds maximum length of 2000 characters.");
  }

  const db = getFirestore();
  const blogPostDoc = await db.collection("blogs").doc(blogPostId).get();
  if (!blogPostDoc.exists) {
    throw new Error("Blog post not found.");
  }

  const dataToCreate: Omit<IComment, "_id" | "id"> = {
    blogPost: blogPostId,
    text: text.trim(),
    author: null,
    authorName: "Anonymous",
    authorImage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (sessionUser) {
    dataToCreate.author = sessionUser.id || sessionUser._id || null;
    dataToCreate.authorName = sessionUser.name || "User";
    dataToCreate.authorImage = (sessionUser.image as string) || null;
  } else if (anonymousName?.trim()) {
    dataToCreate.authorName = anonymousName.trim().substring(0, 50);
  }

  const docRef = await db.collection(COLLECTION).add(dataToCreate);
  const newDoc = await docRef.get();
  
  const createdComment = { id: docRef.id, ...newDoc.data() } as EnrichedComment;

  // Manual population if author exists
  if (createdComment.author && typeof createdComment.author === "string") {
    const userDoc = await db.collection("users").doc(createdComment.author).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      createdComment.author = {
        _id: userDoc.id,
        id: userDoc.id,
        name: userData?.name,
        image: userData?.image
      };
    }
  }

  return createdComment;
}


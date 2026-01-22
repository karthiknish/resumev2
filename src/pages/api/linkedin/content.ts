import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getFirestore } from "@/lib/firebaseAdmin";
import { ILinkedInContent } from "@/models/LinkedInContent";

const COLLECTION = "linkedin_content";

interface LinkedInPostData {
  contentType: "post" | "carousel";
  topic: string;
  postContent?: string;
  postType?: "insight" | "story" | "tutorial" | "opinion" | "celebration";
  tone?: "professional" | "casual" | "thoughtful" | "inspiring" | "educational";
  length?: "short" | "medium" | "long";
  hashtags?: string[];
  slides?: {
    slideNumber: number;
    heading: string;
    body: string;
    hasNumber?: boolean;
  }[];
  slideImages?: {
    slideNumber: number;
    imageData?: string;
    mimeType?: string;
    error?: string;
  }[];
  carouselStyle?: "dark_pro" | "light_pro" | "gradient";
  aspectRatio?: "portrait" | "square";
  templateUsed?: {
    category?: string;
    templateId?: string;
  };
  metrics?: Record<string, unknown>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getSession({ req });

  const isLocalhost =
    req.headers.host?.includes("localhost") || req.headers.host?.includes("127.0.0.1");

  if (!session && !isLocalhost) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const userId = session?.user?.id || (isLocalhost ? "dev-user" : null);
  const db = getFirestore();

  try {
    switch (req.method) {
      case "GET": {
        const { contentType, limit = 20, skip = 0 } = req.query;

        let query: FirebaseFirestore.Query = db.collection(COLLECTION)
          .where("author", "==", userId)
          .where("isDeleted", "==", false);

        if (contentType) {
          query = query.where("contentType", "==", contentType);
        }

        const countSnapshot = await query.count().get();
        const total = countSnapshot.data().count;

        const snapshot = await query
          .orderBy("createdAt", "desc")
          .offset(parseInt(skip as string, 10))
          .limit(parseInt(limit as string, 10))
          .get();

        const content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return res.status(200).json({
          success: true,
          content,
          total,
          limit: parseInt(limit as string, 10),
          skip: parseInt(skip as string, 10),
        });
      }

      case "POST": {
        const {
          contentType,
          topic,
          postContent,
          postType,
          tone,
          length,
          hashtags,
          slides,
          slideImages,
          carouselStyle,
          aspectRatio,
          templateUsed,
          metrics,
        } = req.body as LinkedInPostData;

        if (!contentType || !topic) {
          return res.status(400).json({
            success: false,
            message: "Content type and topic are required",
          });
        }

        const now = new Date();
        const newContent: Omit<ILinkedInContent, "id" | "_id"> = {
          author: userId as string,
          contentType,
          topic,
          postContent: contentType === "post" ? postContent : undefined,
          postType,
          tone,
          length,
          hashtags: hashtags || [],
          slides: contentType === "carousel" ? slides : undefined,
          slideImages: contentType === "carousel" ? (slideImages || []) : [],
          carouselStyle,
          aspectRatio,
          status: "generated",
          templateUsed,
          metrics: {
            characterCount: typeof metrics?.characterCount === "number" ? metrics.characterCount : undefined,
            wordCount: typeof metrics?.wordCount === "number" ? metrics.wordCount : undefined,
            slideCount: typeof metrics?.slideCount === "number" ? metrics.slideCount : undefined,
          },
          isFavorite: false,
          isDeleted: false,
          isExported: false,
          exportType: "none",
          model: "gemini-1.5-pro",
          createdAt: now,
          updatedAt: now,
        };

        const docRef = await db.collection(COLLECTION).add(newContent);

        return res.status(201).json({
          success: true,
          content: { id: docRef.id, ...newContent },
        });
      }

      case "PATCH": {
        const { contentId, action, ...updates } = req.body as { contentId: string; action?: string };

        if (!contentId) {
          return res.status(400).json({
            success: false,
            message: "Content ID is required",
          });
        }

        const docRef = db.collection(COLLECTION).doc(contentId);
        const doc = await docRef.get();

        if (!doc.exists || doc.data()?.author !== userId) {
          return res.status(404).json({
            success: false,
            message: "Content not found",
          });
        }

        const now = new Date();
        const finalUpdate: Partial<ILinkedInContent> & { updatedAt: Date } = { updatedAt: now };

        if (action === "toggleFavorite") {
          finalUpdate.isFavorite = !doc.data()?.isFavorite;
        } else if (action === "markExported") {
          const { exportType } = updates as { exportType: ILinkedInContent["exportType"] };
          finalUpdate.isExported = true;
          finalUpdate.exportType = exportType;
          finalUpdate.exportedAt = now;
        } else if (action === "softDelete") {
          finalUpdate.isDeleted = true;
        } else {
          const typedUpdates = updates as Record<string, unknown>;
          Object.keys(typedUpdates).forEach((key) => {
            if (typedUpdates[key] !== undefined) {
              (finalUpdate as any)[key] = typedUpdates[key];
            }
          });
        }

        await docRef.update(finalUpdate);
        const updatedDoc = await docRef.get();

        return res.status(200).json({
          success: true,
          content: { id: updatedDoc.id, ...updatedDoc.data() },
        });
      }

      case "DELETE": {
        const { contentId } = req.query;

        if (!contentId) {
          return res.status(400).json({
            success: false,
            message: "Content ID is required",
          });
        }

        const docRef = db.collection(COLLECTION).doc(contentId as string);
        const doc = await docRef.get();

        if (!doc.exists || doc.data()?.author !== userId) {
          return res.status(404).json({
            success: false,
            message: "Content not found",
          });
        }

        await docRef.update({ isDeleted: true, updatedAt: new Date() });

        return res.status(200).json({
          success: true,
          message: "Content deleted",
        });
      }

      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} not allowed`,
        });
    }
  } catch (error: unknown) {
    console.error("LinkedIn content API error:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

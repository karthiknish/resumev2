import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";
import { getFirestore } from "@/lib/firebaseAdmin";

const COLLECTION = "blogs";
const USERS_COLLECTION = "users";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin = checkAdminStatus(session);
  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin privileges required" });
  }

  const { blogId } = req.query;

  if (!blogId || typeof blogId !== 'string') {
    return res.status(400).json({ success: false, message: "Valid Blog ID is required." });
  }

  try {
    const db = getFirestore();
    const blogDoc = await db.collection(COLLECTION).doc(blogId).get();

    if (!blogDoc.exists) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const blogData = { id: blogDoc.id, ...blogDoc.data() } as any;

    if (req.method === "GET") {
      // Manual population of authors in versions
      const versions = (blogData.versions || []) as any[];
      const populatedVersions = await Promise.all(
        versions.map(async (v) => {
          if (v.author && typeof v.author === 'string') {
            const authorDoc = await db.collection(USERS_COLLECTION).doc(v.author).get();
            if (authorDoc.exists) {
              const authorData = authorDoc.data();
              return {
                ...v,
                author: {
                  _id: authorDoc.id,
                  name: authorData?.name,
                  email: authorData?.email,
                  image: authorData?.image,
                }
              };
            }
          }
          return v;
        })
      );

      return res.status(200).json({
        success: true,
        data: {
          currentVersion: blogData.currentVersion || 1,
          versions: populatedVersions,
        },
      });
    }

    if (req.method === "POST") {
      const { versionNumber, changeDescription } = req.body as { versionNumber: number; changeDescription?: string };

      if (!versionNumber) {
        return res.status(400).json({
          success: false,
          message: "Version number is required.",
        });
      }

      const versions = (blogData.versions || []) as any[];
      const versionToRestore = versions.find(
        (v) => v.versionNumber === versionNumber
      );

      if (!versionToRestore) {
        return res.status(404).json({
          success: false,
          message: "Version not found.",
        });
      }

      const currentSnapshot = {
        versionNumber: (blogData.currentVersion as number) || 1,
        title: blogData.title as string,
        content: blogData.content as string,
        description: blogData.description as string,
        imageUrl: (blogData.imageUrl as string) || "",
        tags: (blogData.tags as string[]) || [],
        category: (blogData.category as string) || "Uncategorized",
        author: blogData.author,
        createdAt: (blogData.updatedAt as string) || new Date().toISOString(),
        changeDescription: changeDescription || "Before restoring to version " + versionNumber,
      };

      const newVersion = ((blogData.currentVersion as number) || 1) + 1;
      
      let updatedVersions = [...versions, currentSnapshot];
      if (updatedVersions.length > 20) {
        updatedVersions = updatedVersions.slice(-20);
      }

      const updatedData = {
        title: versionToRestore.title,
        content: versionToRestore.content,
        description: versionToRestore.description,
        imageUrl: versionToRestore.imageUrl || "",
        tags: versionToRestore.tags || [],
        category: versionToRestore.category || "Uncategorized",
        currentVersion: newVersion,
        versions: updatedVersions,
        updatedAt: new Date().toISOString(),
      };

      await db.collection(COLLECTION).doc(blogId).update(updatedData);

      return res.status(200).json({
        success: true,
        message: `Restored to version ${versionNumber}`,
        data: {
          currentVersion: newVersion,
          title: updatedData.title,
          content: updatedData.content,
          description: updatedData.description,
          imageUrl: updatedData.imageUrl,
          tags: updatedData.tags,
          category: updatedData.category,
        },
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Version history error:", error);
    return res.status(500).json({
      message: "Error managing version history",
      error: (error as Error).message,
    });
  }
}

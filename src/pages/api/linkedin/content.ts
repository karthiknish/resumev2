import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "@/lib/dbConnect";
import LinkedInContent from "@/models/LinkedInContent";

interface LinkedInPostData {
  contentType: string;
  topic: string;
  postContent?: string;
  postType?: string;
  tone?: string;
  length?: string;
  hashtags?: string[];
  slides?: any[];
  slideImages?: string[];
  carouselStyle?: string;
  aspectRatio?: string;
  templateUsed?: string;
  metrics?: Record<string, any>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getSession({ req });

  const isLocalhost =
    req.headers.host?.includes("localhost") || req.headers.host?.includes("127.0.0.1");

  if (!session && !isLocalhost) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  await dbConnect();

  const userId = session?.user?.id || (isLocalhost ? "dev-user" : null);

  try {
    switch (req.method) {
      case "GET": {
        const { contentType, limit = 20, skip = 0 } = req.query;

        const query: any = {
          author: userId,
          isDeleted: false,
        };

        if (contentType) {
          query.contentType = contentType;
        }

        const content = await LinkedInContent.find(query)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit as string, 10))
          .skip(parseInt(skip as string, 10))
          .lean();

        const total = await LinkedInContent.countDocuments(query);

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

        if (contentType === "post" && !postContent) {
          return res.status(400).json({
            success: false,
            message: "Post content is required for post type",
          });
        }

        if (contentType === "carousel" && (!slides || slides.length === 0)) {
          return res.status(400).json({
            success: false,
            message: "Slides are required for carousel type",
          });
        }

        const newContent = new LinkedInContent({
          author: userId,
          contentType,
          topic,
          postContent: contentType === "post" ? postContent : undefined,
          postType,
          tone,
          length,
          hashtags: hashtags || [],
          slides: contentType === "carousel" ? slides : undefined,
          slideImages: contentType === "carousel" ? slideImages || [] : [],
          carouselStyle,
          aspectRatio,
          status: "generated",
          templateUsed,
          metrics: metrics || {},
        });

        await newContent.save();

        return res.status(201).json({
          success: true,
          content: newContent.toJSON(),
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

        const content = await LinkedInContent.findOne({
          _id: contentId,
          author: userId,
        });

        if (!content) {
          return res.status(404).json({
            success: false,
            message: "Content not found",
          });
        }

        if (action === "toggleFavorite") {
          content.isFavorite = !content.isFavorite;
          await content.save();
          return res.status(200).json({
            success: true,
            content: content.toJSON(),
          });
        }

        if (action === "markExported") {
          const { exportType } = updates as { exportType: string };
          content.markAsExported(exportType);
          return res.status(200).json({
            success: true,
            content: content.toJSON(),
          });
        }

        if (action === "softDelete") {
          content.softDelete();
          return res.status(200).json({
            success: true,
            message: "Content deleted",
          });
        }

        Object.keys(updates).forEach((key) => {
          if (updates[key] !== undefined) {
            (content as any)[key] = updates[key];
          }
        });

        await content.save();

        return res.status(200).json({
          success: true,
          content: content.toJSON(),
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

        const content = await LinkedInContent.findOne({
          _id: contentId,
          author: userId,
        });

        if (!content) {
          return res.status(404).json({
            success: false,
            message: "Content not found",
          });
        }

        content.softDelete();

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
  } catch (error) {
    console.error("LinkedIn content API error:", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Internal server error",
    });
  }
}

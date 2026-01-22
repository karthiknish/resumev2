// Converted to TypeScript - migrated
// src/pages/api/pexels/search.js
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY; // Store the key in .env.local

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = (await getServerSession(req, res, authOptions)) as Session | null;
  
  // Allow access for admin users
  const isAdmin =
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (!PEXELS_API_KEY) {
    console.error("Pexels API key is not configured in environment variables.");
    return res
      .status(500)
      .json({ message: "Image search configuration error." });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { query, per_page = 15, page = 1 } = req.query as { query?: string; per_page?: string; page?: string };

  try {
    let pexelsUrl;
    let params: {
      per_page: number;
      page: number;
      query?: string;
      orientation?: string;
    } = {
      per_page: parseInt(per_page as string, 10),
      page: parseInt(page as string, 10),
    };

    if (query && typeof query === "string" && query.trim().length > 0) {
      pexelsUrl = `https://api.pexels.com/v1/search`;
      params.query = query;
      params.orientation = "landscape"; // Prefer landscape for search
    } else {
      // Fallback to curated photos if no query
      pexelsUrl = `https://api.pexels.com/v1/curated`;
      // Curated doesn't support orientation param in the same way, but returns mixed
    }

    const response = await axios.get(pexelsUrl, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: params,
    });

    // We only need specific fields from the Pexels response
    const simplifiedPhotos = response.data.photos.map((photo: PexelsPhoto) => ({
      id: photo.id,
      width: photo.width,
      height: photo.height,
      url: photo.url, // Link to Pexels page
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      src: {
        original: photo.src.original,
        large: photo.src.large, // Good size for banner preview
        medium: photo.src.medium,
        small: photo.src.small,
        landscape: photo.src.landscape, // Often suitable for banners
        tiny: photo.src.tiny,
      },
      alt: photo.alt || `Photo by ${photo.photographer}`, // Use provided alt text or generate one
    }));

    res.status(200).json({
      success: true,
      photos: simplifiedPhotos,
      page: response.data.page,
      per_page: response.data.per_page,
      total_results: response.data.total_results,
      next_page: response.data.next_page, // For pagination if needed later
    });
  } catch (error: unknown) {
    console.error("Pexels API error:", error);
    let status = 500;
    let message = "Failed to fetch images from Pexels.";
    let details = "Unknown error";

    if (axios.isAxiosError(error)) {
      status = error.response?.status || 500;
      details = error.response?.data?.error || error.message;
    } else if (error instanceof Error) {
      details = error.message;
    }

    res.status(status).json({
      success: false,
      message,
      error: details,
    });
  }
}


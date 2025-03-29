// src/pages/api/pexels/search.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY; // Store the key in .env.local

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // Allow access for admin users
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
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

  const { query, per_page = 15, page = 1 } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Search query is required." });
  }

  try {
    const pexelsUrl = `https://api.pexels.com/v1/search`;
    const response = await axios.get(pexelsUrl, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: {
        query: query,
        per_page: parseInt(per_page, 10),
        page: parseInt(page, 10),
        orientation: "landscape", // Prefer landscape images for banners
      },
    });

    // We only need specific fields from the Pexels response
    const simplifiedPhotos = response.data.photos.map((photo) => ({
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
  } catch (error) {
    console.error("Pexels API error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: "Failed to fetch images from Pexels.",
      error: error.response?.data?.error || error.message,
    });
  }
}

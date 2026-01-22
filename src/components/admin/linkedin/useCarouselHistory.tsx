// Converted to TypeScript - migrated
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Session } from "next-auth";

export interface CarouselSlide {
  slideNumber: number;
  heading: string;
  body: string;
}

export interface CarouselImage {
  slideNumber: number;
  imageData?: string;
  mimeType?: string;
  error?: string;
}

export interface HistoryItem {
  _id: string;
  id: string;
  topic: string;
  slides: CarouselSlide[];
  slideImages: CarouselImage[];
  carouselStyle: string;
  aspectRatio: string;
  slideCount: number;
  createdAt: string;
  isFavorite: boolean;
}

interface ServerCarouselItem {
  _id: string;
  topic: string;
  slides: CarouselSlide[];
  slideImages: CarouselImage[];
  carouselStyle: string;
  aspectRatio: string;
  createdAt: string;
  isFavorite: boolean;
}

export const useCarouselHistory = (session: Session | null) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/linkedin/content?contentType=carousel&limit=20");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.content) {
          const transformedHistory = data.content.map((item: ServerCarouselItem) => ({
            _id: item._id,
            id: item._id,
            topic: item.topic,
            slides: item.slides,
            slideImages: item.slideImages,
            carouselStyle: item.carouselStyle,
            aspectRatio: item.aspectRatio,
            slideCount: item.slideImages?.length || item.slides?.length || 0,
            createdAt: item.createdAt,
            isFavorite: item.isFavorite,
          }));
          setHistory(transformedHistory);
          setIsLoadingHistory(false);
          return;
        }
      }
    } catch (error: unknown) {
      console.error("Failed to fetch carousel history:", error instanceof Error ? error.message : error);
    }
    setIsLoadingHistory(false);
  };

  const saveToHistory = async (topic: string, slidesData: CarouselSlide[], imagesData: CarouselImage[], style: string, aspectRatio: string) => {
    try {
      const response = await fetch("/api/linkedin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "carousel",
          topic: topic.trim(),
          slides: slidesData,
          slideImages: imagesData,
          carouselStyle: style,
          aspectRatio: aspectRatio,
          metrics: {
            slideCount: imagesData.length,
          },
        }),
      });

      if (response.ok) {
        fetchHistory();
        return true;
      }
    } catch (error: unknown) {
      console.error("Failed to save carousel to server:", error instanceof Error ? error.message : error);
    }
    return false;
  };

  const deleteHistoryItem = async (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (item._id) {
      try {
        const response = await fetch("/api/linkedin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: item._id,
            action: "softDelete",
          }),
        });
        if (response.ok) {
          setHistory(history.filter((h) => h._id !== item._id));
          toast.success("Deleted from history");
          return;
        }
      } catch (err: unknown) {
        console.error("Failed to delete from server:", err instanceof Error ? err.message : err);
      }
    }

    setHistory(history.filter((h) => h.id !== item.id));
    toast.success("Deleted from history");
  };

  const toggleFavorite = async (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (item._id) {
      try {
        const response = await fetch("/api/linkedin/content", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contentId: item._id,
            action: "toggleFavorite",
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setHistory(
              history.map((h) =>
                h._id === item._id
                  ? { ...h, isFavorite: data.content.isFavorite }
                  : h
              )
            );
            toast.success(
              data.content.isFavorite ? "Added to favorites" : "Removed from favorites"
            );
            return;
          }
        }
      } catch (err: unknown) {
        console.error("Failed to toggle favorite:", err instanceof Error ? err.message : err);
      }
    }

    setHistory(
      history.map((h) =>
        h.id === item.id ? { ...h, isFavorite: !h.isFavorite } : h
      )
    );
    toast.info("Favorite status updated");
  };

  useEffect(() => {
    fetchHistory();
  }, [session]);

  return {
    history,
    setHistory,
    isLoadingHistory,
    fetchHistory,
    saveToHistory,
    deleteHistoryItem,
    toggleFavorite,
  };
};


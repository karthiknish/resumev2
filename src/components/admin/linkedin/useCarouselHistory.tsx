// Converted to TypeScript - migrated
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useCarouselHistory = (session) => {
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/linkedin/content?contentType=carousel&limit=20");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.content) {
          const transformedHistory = data.content.map((item) => ({
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
    } catch (error) {
      console.error("Failed to fetch carousel history:", error);
    }
    setIsLoadingHistory(false);
  };

  const saveToHistory = async (topic, slidesData, imagesData, style, aspectRatio) => {
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
    } catch (error) {
      console.error("Failed to save carousel to server:", error);
    }
    return false;
  };

  const deleteHistoryItem = async (item, e) => {
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
      } catch (err) {
        console.error("Failed to delete from server:", err);
      }
    }

    setHistory(history.filter((h) => h.id !== item.id));
    toast.success("Deleted from history");
  };

  const toggleFavorite = async (item, e) => {
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
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
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
    isLoadingHistory,
    fetchHistory,
    saveToHistory,
    deleteHistoryItem,
    toggleFavorite,
  };
};


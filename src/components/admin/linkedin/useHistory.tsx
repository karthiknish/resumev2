// Converted to TypeScript - migrated
import { useState, useEffect } from "react";
import { toast } from "sonner";

const LOCAL_STORAGE_HISTORY_KEY = "linkedin-post-history";
const MAX_LOCAL_HISTORY = 5;

export const useHistory = (session) => {
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/linkedin/content?contentType=post&limit=20");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.content) {
          const transformedHistory = data.content.map((item) => ({
            _id: item._id,
            id: item._id,
            topic: item.topic,
            post: item.postContent,
            postType: item.postType,
            tone: item.tone,
            createdAt: item.createdAt,
            isFavorite: item.isFavorite,
            hashtags: item.hashtags,
          }));
          setHistory(transformedHistory);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to fetch history from server:", error);
    } finally {
      setIsLoadingHistory(false);
    }

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        const localHistory = JSON.parse(saved);
        setHistory(localHistory.slice(0, MAX_LOCAL_HISTORY));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
    }
    setIsLoadingHistory(false);
  };

  const saveToHistory = async (historyItem) => {
    try {
      const response = await fetch("/api/linkedin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType: "post",
          topic: historyItem.topic,
          postContent: historyItem.post,
          postType: historyItem.postType,
          tone: historyItem.tone,
          length: historyItem.length,
          hashtags: historyItem.hashtags,
          metrics: {
            characterCount: historyItem.post?.length || 0,
            wordCount: historyItem.post?.split(/\s+/).length || 0,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          fetchHistory();
          return true;
        }
      }
    } catch (error) {
      console.error("Failed to save to server:", error);
    }

    try {
      const updatedHistory = [historyItem, ...history].slice(0, MAX_LOCAL_HISTORY);
      setHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
      return true;
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
      return false;
    }
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

  const clearHistory = async () => {
    if (history.length > 0 && history[0]._id) {
      try {
        await Promise.all(
          history
            .filter((item) => item._id)
            .map((item) =>
              fetch("/api/linkedin/content", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contentId: item._id,
                  action: "softDelete",
                }),
              })
            )
        );
      } catch (err) {
        console.error("Failed to clear history on server:", err);
      }
    }

    setHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    toast.success("History cleared");
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
    clearHistory,
    toggleFavorite,
  };
};


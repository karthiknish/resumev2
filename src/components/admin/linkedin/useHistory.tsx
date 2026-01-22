// Converted to TypeScript - migrated
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Session } from "next-auth";

export interface HistoryItem {
  _id?: string;
  id?: string;
  topic: string;
  post: string;
  postType: string;
  tone: string;
  createdAt: string | Date;
  isFavorite: boolean;
  hashtags?: string[];
  length?: string;
}

const LOCAL_STORAGE_HISTORY_KEY = "linkedin-post-history";
const MAX_LOCAL_HISTORY = 5;

interface ServerHistoryItem {
  _id: string;
  topic: string;
  postContent: string;
  postType: string;
  tone: string;
  createdAt: string;
  isFavorite: boolean;
  hashtags?: string[];
}

export const useHistory = (session: Session | null) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/linkedin/content?contentType=post&limit=20");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.content) {
          const transformedHistory = data.content.map((item: ServerHistoryItem) => ({
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
    } catch (error: unknown) {
      console.error("Failed to fetch history from server:", error instanceof Error ? error.message : error);
    } finally {
      setIsLoadingHistory(false);
    }

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        const localHistory = JSON.parse(saved);
        setHistory(localHistory.slice(0, MAX_LOCAL_HISTORY));
      }
    } catch (e: unknown) {
      console.error("Failed to load history from localStorage:", e instanceof Error ? e.message : e);
    }
    setIsLoadingHistory(false);
  };

  const saveToHistory = async (historyItem: HistoryItem) => {
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
    } catch (error: unknown) {
      console.error("Failed to save to server:", error instanceof Error ? error.message : error);
    }

    try {
      const updatedHistory = [historyItem, ...history].slice(0, MAX_LOCAL_HISTORY);
      setHistory(updatedHistory);
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
      return true;
    } catch (e: unknown) {
      console.error("Failed to save to localStorage:", e instanceof Error ? e.message : e);
      return false;
    }
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
      } catch (err: unknown) {
        console.error("Failed to clear history on server:", err instanceof Error ? err.message : err);
      }
    }

    setHistory([]);
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
    toast.success("History cleared");
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
    isLoadingHistory,
    fetchHistory,
    saveToHistory,
    deleteHistoryItem,
    clearHistory,
    toggleFavorite,
  };
};


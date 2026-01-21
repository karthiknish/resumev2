"use client";

import { useState, useEffect, RefObject } from "react";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { toast } from "sonner";

interface LikeButtonProps {
  blogId: string;
  initialLikeCount?: number;
  initialViewCount?: number;
}

export default function LikeButton({ blogId, initialLikeCount = 0, initialViewCount = 0 }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setIsLiked(likedPosts.includes(blogId));
  }, [blogId]);

  useEffect(() => {
    const recordView = async () => {
      try {
        const viewedPosts = JSON.parse(sessionStorage.getItem("viewedPosts") || "[]");
        if (viewedPosts.includes(blogId)) return;

        const response = await fetch("/api/blog/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blogId }),
        });

        if (response.ok) {
          const data = await response.json();
          setViewCount(data.data?.viewCount || viewCount + 1);
          sessionStorage.setItem("viewedPosts", JSON.stringify([...viewedPosts, blogId]));
        }
      } catch (error) {
        console.error("Error recording view:", error);
      }
    };

    if (blogId) {
      recordView();
    }
  }, [blogId, viewCount]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });

      const data = await response.json();

      if (response.ok) {
        setLikeCount(data.data?.likeCount || (isLiked ? likeCount - 1 : likeCount + 1));
        setIsLiked(data.data?.isLiked);

        const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
        if (data.data?.isLiked) {
          localStorage.setItem("likedPosts", JSON.stringify([...likedPosts, blogId]));
        } else {
          localStorage.setItem("likedPosts", JSON.stringify(likedPosts.filter(id => id !== blogId)));
        }
      } else {
        throw new Error(data.message || "Failed to like post");
      }
    } catch (error) {
      toast.error("Failed to like post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <motion.button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
          isLiked
            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
          />
        </motion.div>
        <span className="font-semibold text-sm">
          {likeCount > 0 ? likeCount : "Like"}
        </span>
      </motion.button>

      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
        <Eye className="w-5 h-5" />
        <span className="font-semibold text-sm">
          {viewCount > 0 ? `${viewCount.toLocaleString()} views` : "0 views"}
        </span>
      </div>
    </div>
  );
}

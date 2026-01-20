import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CommentSkeleton } from "@/components/ui/loading-states";

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function CommentsSection({ blogPostId }) {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [anonymousName, setAnonymousName] = useState(""); // State for anonymous name input
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!blogPostId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/comments?blogPostId=${blogPostId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data.data || []);
      } catch (err) {
        setError(err.message);
        toast.error("Could not load comments.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [blogPostId]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    // Basic validation for anonymous name if provided
    if (!session && anonymousName && anonymousName.length > 50) {
      toast.error("Name cannot exceed 50 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogPostId: blogPostId,
          text: newComment,
          // Send name only if anonymous and provided, otherwise API uses session or default
          authorName: session ? undefined : anonymousName.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new comment to the list optimistically
        // If anonymous, manually add the name used, otherwise use populated data
        const commentToAdd = {
          ...data.data,
          // Ensure authorName is correctly set for immediate display
          authorName:
            session?.user?.name || anonymousName.trim() || "Anonymous",
          // Ensure author image is correctly set for immediate display
          authorImage: session?.user?.image || null,
          // If author was populated by API (logged in user), use that, otherwise null
          author: data.data.author || null,
        };
        setComments((prevComments) => [...prevComments, commentToAdd]);
        setNewComment("");
        setAnonymousName(""); // Clear anonymous name input too
        toast.success("Comment posted!");
      } else {
        throw new Error(data.message || "Failed to post comment.");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Could not post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-16 pt-8 sm:pt-12 border-t border-slate-200 bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm"
    >
      <motion.h2
        className="font-heading text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-6 sm:mb-8 flex flex-wrap items-center gap-3 sm:gap-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <span>Comments</span>

        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base font-semibold text-slate-700">
          {comments.length}
        </span>
      </motion.h2>

      {/* Comment Submission Form - Always visible */}
      <motion.form
        onSubmit={handleCommentSubmit}
        className="mb-8 sm:mb-12 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3
          className="font-heading text-xl sm:text-2xl mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-slate-900"
        >
          Share your thoughts
        </h3>
        {/* Show Name input only if not logged in */}
        {status === "unauthenticated" && (
          <motion.div
            className="mb-4 sm:mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor="anonymousName"
              className="block text-sm sm:text-base font-semibold text-slate-700 mb-2 sm:mb-3 flex items-center gap-2"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700">
                {/* Lucide icon: User */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
                </svg>
              </span>
              Name (Optional)
            </label>
            <Input
              type="text"
              id="anonymousName"
              value={anonymousName}
              onChange={(e) => setAnonymousName(e.target.value)}
              placeholder="Your Name"
              maxLength={50}
              disabled={isSubmitting}
              className="w-full sm:w-1/2 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-medium transition-all duration-300"
            />
          </motion.div>
        )}
        {/* Textarea is always visible */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 sm:mb-6"
        >
          <label className="block text-base sm:text-lg font-semibold text-slate-700 mb-2 sm:mb-3 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700">
              {/* Lucide icon: MessageSquare */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            Your Comment
          </label>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={
              session
                ? "Share your thoughts and insights..."
                : "Share your thoughts... (Sign in to use your profile name/image)"
            }
            required
            maxLength={2000}
            disabled={isSubmitting || status === "loading"} // Disable if auth status is loading
            className="w-full p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-500 focus:ring-4 focus:ring-slate-200 focus:border-slate-400 min-h-[100px] sm:min-h-[120px] text-base sm:text-lg transition-all duration-300 resize-none"
            aria-label="New comment"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            type="submit"
            disabled={
              isSubmitting || !newComment.trim() || status === "loading"
            }
            className="bg-slate-900 hover:bg-slate-700 text-slate-100 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-sm hover:shadow-lg disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center gap-2 sm:gap-3"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Posting your thoughts...</span>
              </>
            ) : (
              <>
                <motion.span
                  animate={{ y: [0, -3, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-sm text-slate-500"
                >
                  {/* Lucide icon: Send */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </motion.span>
                <span>Post Comment</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.form>
      {/* Display Comments */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {isLoading && <CommentSkeleton />}
        {error && !isLoading && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-red-600 font-medium text-base sm:text-lg flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                {/* Lucide icon: AlertTriangle */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </span>
              Error loading comments: {error}
            </p>
          </motion.div>
        )}
        {!isLoading && !error && comments.length === 0 && (
          <motion.div
            className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* No emoji for empty state */}
            <h4
              className="font-heading text-xl sm:text-2xl text-slate-900 mb-2"
            >
              Be the first to comment!
            </h4>
            <p className="text-slate-600 text-base sm:text-lg">
              Share your thoughts and start the conversation
            </p>
          </motion.div>
        )}
        {!isLoading &&
          !error &&
          comments.map((comment, index) => (
            <motion.div
              key={comment._id}
              className="flex items-start space-x-3 sm:space-x-6 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative">
                  <Image
                    // Use comment.authorImage if available (set during creation), else default
                    src={comment.authorImage || "/avatars/default.png"}
                    alt={`${comment.authorName || "Anonymous"}'s avatar`}
                    width={48}
                    height={48}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-4 border-slate-200 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-400" />
                </div>
              </motion.div>
              <motion.div
                className="flex-grow bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm group-hover:shadow-lg group-hover:border-slate-300 transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                  <motion.span
                    className="font-heading text-lg sm:text-xl text-slate-900 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700">
                      {/* Lucide icon: User */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="7" r="4" />
                        <path d="M5.5 21a7.5 7.5 0 0 1 13 0" />
                      </svg>
                    </span>
                    {comment.authorName || "Anonymous"}
                  </motion.span>
                  <motion.span
                    className="text-xs sm:text-sm font-medium text-slate-500 bg-gradient-to-r from-purple-100 to-blue-100 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brandSecondary/10 text-brandSecondary">
                      {/* Lucide icon: Calendar */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </span>
                    <span className="text-slate-500 text-sm">
                      {formatDate(comment.createdAt)}
                    </span>
                  </motion.span>
                </div>
                <motion.p
                  className="text-slate-700 leading-relaxed text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {comment.text}
                </motion.p>
                {/* Add reply functionality here later if needed */}
              </motion.div>
            </motion.div>
          ))}
      </motion.div>
    </motion.div>
  );
}

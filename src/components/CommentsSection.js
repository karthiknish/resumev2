import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link"; // Import Link
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Import Input for anonymous name
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

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
      className="mt-16 pt-12 border-t border-purple-200 bg-white/50 backdrop-blur-sm rounded-3xl p-8"
    >
      <motion.h2
        className="text-4xl md:text-5xl font-black mb-8 flex items-center gap-4"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Comments
        </span>
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-3xl"
        >
          💬
        </motion.span>
        <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-xl font-bold">
          {comments.length}
        </span>
      </motion.h2>

      {/* Comment Submission Form - Always visible */}
      <motion.form
        onSubmit={handleCommentSubmit}
        className="mb-12 bg-white/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-purple-200 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3
          className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Share your thoughts
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-xl"
          >
            ✨
          </motion.span>
        </h3>
        {/* Show Name input only if not logged in */}
        {status === "unauthenticated" && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor="anonymousName"
              className="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"
            >
              <span className="text-xl">👤</span>
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
              className="w-full sm:w-1/2 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 rounded-2xl px-6 py-4 text-lg font-medium transition-all duration-300"
            />
          </motion.div>
        )}
        {/* Textarea is always visible */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-xl">💭</span>
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
            className="w-full p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 min-h-[120px] text-lg font-medium transition-all duration-300 resize-none"
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
            disabled={isSubmitting || !newComment.trim() || status === "loading"}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center gap-3"
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
                  className="text-xl"
                >
                  🚀
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
        {isLoading && (
          <motion.div
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-3 text-lg font-medium text-gray-600">Loading comments...</span>
          </motion.div>
        )}
        {error && !isLoading && (
          <motion.div
            className="bg-red-50 border-2 border-red-200 rounded-2xl p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-red-600 font-medium text-lg flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Error loading comments: {error}
            </p>
          </motion.div>
        )}
        {!isLoading && !error && comments.length === 0 && (
          <motion.div
            className="text-center py-16 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl border-2 border-purple-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-6xl mb-4"
            >
              💬
            </motion.div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Be the first to comment!
            </h4>
            <p className="text-gray-600 text-lg">
              Share your thoughts and start the conversation
            </p>
          </motion.div>
        )}
        {!isLoading &&
          !error &&
          comments.map((comment, index) => (
            <motion.div
              key={comment._id}
              className="flex items-start space-x-6 group"
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
                    width={56}
                    height={56}
                    className="rounded-2xl border-4 border-purple-200 shadow-lg"
                  />
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="text-xs">✨</span>
                  </motion.div>
                </div>
              </motion.div>
              <motion.div
                className="flex-grow bg-white/80 backdrop-blur-sm p-6 rounded-3xl border-2 border-purple-200 shadow-lg group-hover:shadow-xl group-hover:border-purple-300 transition-all duration-300"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.span
                    className="font-bold text-xl text-gray-900 flex items-center gap-2"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-lg">👤</span>
                    {comment.authorName || "Anonymous"}
                  </motion.span>
                  <motion.span
                    className="text-sm font-medium text-gray-500 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full flex items-center gap-1"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-xs">📅</span>
                    {formatDate(comment.createdAt)}
                  </motion.span>
                </div>
                <motion.p
                  className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed"
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

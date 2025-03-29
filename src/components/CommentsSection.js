import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link"; // Import Link
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Import Input for anonymous name
import { Loader2 } from "lucide-react";
import Image from "next/image";

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
    <div className="mt-12 pt-8 border-t border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 font-calendas">
        Comments ({comments.length})
      </h2>

      {/* Comment Submission Form - Always visible */}
      <form onSubmit={handleCommentSubmit} className="mb-8">
        {/* Show Name input only if not logged in */}
        {status === "unauthenticated" && (
          <div className="mb-3">
            <label
              htmlFor="anonymousName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
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
              className="w-full sm:w-1/2 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        {/* Textarea is always visible */}
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            session
              ? "Write your comment..."
              : "Write your comment... (Sign in to use your profile name/image)"
          }
          required
          maxLength={2000}
          disabled={isSubmitting || status === "loading"} // Disable if auth status is loading
          className="w-full p-3 rounded-md bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] mb-3"
          aria-label="New comment"
        />
        <Button
          type="submit"
          disabled={isSubmitting || !newComment.trim() || status === "loading"}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>
      {/* Display Comments */}
      <div className="space-y-6">
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
        )}
        {error && !isLoading && (
          <p className="text-red-400">Error loading comments: {error}</p>
        )}
        {!isLoading && !error && comments.length === 0 && (
          <p className="text-gray-400">Be the first to comment!</p>
        )}
        {!isLoading &&
          !error &&
          comments.map((comment) => (
            <div key={comment._id} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Image
                  // Use comment.authorImage if available (set during creation), else default
                  src={comment.authorImage || "/avatars/default.png"}
                  alt={`${comment.authorName || "Anonymous"}'s avatar`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-grow bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">
                    {comment.authorName || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {comment.text}
                </p>
                {/* Add reply functionality here later if needed */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

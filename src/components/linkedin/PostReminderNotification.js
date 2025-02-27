import { useState, useEffect } from "react";
import { FadeIn, SlideUp } from "@/components/animations/MotionComponents";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { differenceInDays, format } from "date-fns";
import { X } from "lucide-react";

export default function PostReminderNotification({ posts, dismissedDays = 1 }) {
  const [show, setShow] = useState(false);
  const [lastPostDays, setLastPostDays] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user has recently dismissed the notification
    const lastDismissed = localStorage.getItem("linkedinReminderDismissed");
    const shouldShow =
      !lastDismissed ||
      differenceInDays(new Date(), new Date(lastDismissed)) >= dismissedDays;

    if (shouldShow && posts && posts.length === 0) {
      // No posts ever - show notification
      setShow(true);
      setLastPostDays(null);
    } else if (shouldShow && posts && posts.length > 0) {
      // Check when the last post was made
      const sortedPosts = [...posts].sort((a, b) => {
        return (
          new Date(b.postedAt || b.createdAt) -
          new Date(a.postedAt || a.createdAt)
        );
      });

      const lastPostDate = new Date(
        sortedPosts[0].postedAt || sortedPosts[0].createdAt
      );
      const daysSinceLastPost = differenceInDays(new Date(), lastPostDate);

      // Show reminder if it's been more than 3 days since last post
      if (daysSinceLastPost > 3) {
        setShow(true);
        setLastPostDays(daysSinceLastPost);
      }
    }
  }, [posts, dismissedDays]);

  const handleDismiss = () => {
    // Record when notification was dismissed
    localStorage.setItem("linkedinReminderDismissed", new Date().toISOString());
    setShow(false);
  };

  const handleCreatePost = () => {
    router.push("/linkedin-manager?tab=compose");
    handleDismiss();
  };

  if (!show) return null;

  return (
    <FadeIn>
      <div className="fixed bottom-4 right-4 z-40 max-w-md">
        <SlideUp>
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg">LinkedIn Post Reminder</h3>
              <button
                onClick={handleDismiss}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mb-4">
              {lastPostDays === null
                ? "You haven't posted to LinkedIn yet. Regular posting helps build your professional presence."
                : `It's been ${lastPostDays} days since your last LinkedIn post. Stay engaged with your network by posting regularly.`}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-100">
                {format(new Date(), "EEEE, MMMM do")}
              </p>
              <Button
                onClick={handleCreatePost}
                className="bg-white text-blue-900 hover:bg-blue-50"
                size="sm"
              >
                Create Post
              </Button>
            </div>
          </div>
        </SlideUp>
      </div>
    </FadeIn>
  );
}

import React, { useState, useEffect, useMemo } from "react"; // Import hooks
import Link from "next/link";
import { format } from "date-fns";
import { AiOutlineFileAdd } from "react-icons/ai";
import { Calendar } from "@/components/ui/calendar"; // Import shadcn Calendar
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SlideUp,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "@/components/animations/MotionComponents";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Helper function to check if two dates are the same day
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

function CalendarTab() {
  // Internal state for calendar data
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [blogPosts, setBlogPosts] = useState([]); // Store all fetched posts
  const [blogDates, setBlogDates] = useState([]); // Dates with posts for dots
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all blog posts on mount
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch all posts, including drafts, to mark dates correctly
        const response = await fetch("/api/blog"); // Fetch all
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data = await response.json();
        if (data.success && data.data) {
          const posts = data.data;
          setBlogPosts(posts);
          // Extract dates for the calendar dots
          const dates = posts.map((post) => new Date(post.createdAt));
          setBlogDates(dates);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Could not load blog posts for calendar.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []); // Fetch only once on mount

  // Memoize the filtering of posts for the selected date
  const postsOnSelectedDate = useMemo(() => {
    return blogPosts.filter((post) =>
      isSameDay(new Date(post.createdAt), selectedDate)
    );
  }, [blogPosts, selectedDate]);

  // Handler for shadcn Calendar's onSelect
  const handleDateChange = (date) => {
    // onSelect provides the date directly or undefined if deselected
    if (date) {
      setSelectedDate(date);
    }
  };

  // Custom Day component to render the dot inside the day cell
  const DayContent = (dayProps) => {
    const { date, displayMonth } = dayProps;
    // Check if the current day in the calendar has posts
    const hasPosts = blogDates.some((postDate) => isSameDay(postDate, date));

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {format(date, "d")}
        {hasPosts && displayMonth === date.getMonth() && (
          <span
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"
            aria-hidden="true"
          ></span>
        )}
      </div>
    );
  };

  return (
    <SlideUp delay={0.2}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glow-card">
          <CardHeader className="bg-black rounded-t-lg">
            <CardTitle className="text-2xl font-medium text-white font-calendas glow-blue">
              Blog Post Calendar
            </CardTitle>
            <p className="text-gray-300">
              Dates with blog posts are marked with a blue dot.
            </p>
          </CardHeader>
          <CardContent className="bg-gray-900 p-0 md:p-2 flex justify-center">
            {" "}
            {/* Center calendar */}
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <p className="text-red-400 text-center py-10">
                Error loading calendar data: {error}
              </p>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                components={{ DayContent: DayContent }}
                className="p-3" // Use className for internal padding if needed
                classNames={{
                  root: "bg-gray-900 text-gray-300 rounded-md border border-gray-700",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-white",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-gray-300",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-700 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-gray-800 transition-colors",
                  day_selected:
                    "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                  day_today: "bg-gray-700 text-white",
                  day_outside: "text-gray-500 opacity-50",
                  day_disabled: "text-gray-600 opacity-50",
                  day_range_middle:
                    "aria-selected:bg-gray-700 aria-selected:text-gray-300",
                  day_hidden: "invisible",
                }}
              />
            )}
          </CardContent>
        </Card>

        <FadeIn delay={0.4}>
          <Card className="glow-card">
            <CardHeader className="bg-black rounded-t-lg">
              <CardTitle className="text-2xl font-medium text-white font-calendas glow-blue">
                Posts on{" "}
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "..."}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-900 min-h-[200px]">
              {" "}
              {/* Added min-height */}
              {isLoading ? (
                <div className="flex justify-center items-center pt-10">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : postsOnSelectedDate.length > 0 ? (
                <StaggerContainer className="space-y-4">
                  {postsOnSelectedDate.map((post, index) => (
                    <StaggerItem key={post._id} index={index}>
                      <HoverCard>
                        <Card className="bg-gray-700 border border-gray-600">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-medium text-white mb-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {post.description || "No description available"}{" "}
                              {/* Use description */}
                            </p>
                            <div className="flex justify-between items-center">
                              <Badge
                                variant={
                                  post.isPublished ? "success" : "warning"
                                }
                                className={
                                  post.isPublished
                                    ? "bg-green-900 text-green-300"
                                    : "bg-yellow-900 text-yellow-300"
                                }
                              >
                                {post.isPublished ? "Published" : "Draft"}
                              </Badge>
                              <div className="flex space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="text-white hover:text-white hover:bg-gray-600"
                                >
                                  <Link
                                    href={`/admin/blog/edit/${post._id}`} // Use ID for edit link
                                  >
                                    Edit
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="text-white border-gray-600 hover:text-white hover:bg-gray-600"
                                >
                                  <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                  >
                                    View
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </HoverCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <p className="text-gray-300 pt-4">
                  No posts found for this date.
                </p>
              )}
            </CardContent>

            <CardFooter className="pt-6 border-t border-gray-700 bg-black rounded-b-lg">
              <Button className="w-full glow-button" asChild>
                <Link href="/admin/blog/create">
                  <AiOutlineFileAdd className="mr-2" />
                  Create New Blog Post
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </FadeIn>
      </div>
    </SlideUp>
  );
}

export default CalendarTab;

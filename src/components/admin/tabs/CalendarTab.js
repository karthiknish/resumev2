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
    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {format(date, "d")}
        {hasPosts && displayMonth === date.getMonth() && (
          <span
            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${
              isSelected
                ? "bg-white"
                : isToday
                ? "bg-primary ring-2 ring-primary/30"
                : "bg-primary"
            }`}
            aria-hidden="true"
          ></span>
        )}
      </div>
    );
  };

  return (
    <SlideUp delay={0.2}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden rounded-3xl border border-border bg-card text-foreground shadow-lg">
          <CardHeader className="border-b border-border bg-muted/50 p-5">
            <CardTitle className="mb-1 text-xl font-heading font-semibold text-foreground">
              📅 Blog Post Calendar
            </CardTitle>
            <p className="font-medium text-muted-foreground">
              Dates with blog posts are marked with a blue accent dot.
            </p>
          </CardHeader>
          <CardContent className="flex justify-center p-5">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <p className="py-10 text-center text-destructive">
                Error loading calendar data: {error}
              </p>
            ) : (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                components={{ DayContent: DayContent }}
                className="p-3"
                classNames={{
                  months:
                    "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-lg font-semibold text-primary",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "h-8 w-8 bg-card border border-border rounded-md p-0 opacity-80 hover:opacity-100 text-primary hover:bg-primary/10 hover:border-primary/30 transition-colors shadow-sm",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-primary w-9 rounded-md font-medium text-sm",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-primary/10 transition-colors",
                  day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90 rounded-md shadow-sm",
                  day_today: "bg-primary/20 text-primary font-semibold",
                  day_outside: "text-muted-foreground opacity-70",
                  day_disabled: "text-muted-foreground/50 opacity-50",
                  day_range_middle:
                    "aria-selected:bg-primary/20 aria-selected:text-primary",
                  day_hidden: "invisible",
                }}
              />
            )}
          </CardContent>
        </Card>

        <FadeIn delay={0.4}>
          <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
            <CardHeader className="border-b border-border bg-muted/50 p-5">
              <CardTitle className="text-xl font-heading font-semibold text-foreground">
                Posts on{" "}
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "..."}
              </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[200px] p-5">
              {isLoading ? (
                <div className="flex justify-center items-center pt-10">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : postsOnSelectedDate.length > 0 ? (
                <StaggerContainer className="space-y-4">
                  {postsOnSelectedDate.map((post, index) => (
                    <StaggerItem key={post._id} index={index}>
                      <HoverCard>
                        <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow rounded-xl">
                          <CardContent className="p-4">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {post.description || "No description available"}
                            </p>
                            <div className="flex justify-between items-center">
                              <Badge
                                variant={
                                  post.isPublished ? "success" : "warning"
                                }
                                className={
                                  post.isPublished
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                }
                              >
                                {post.isPublished ? "Published" : "Draft"}
                              </Badge>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50"
                                >
                                  <Link href={`/admin/blog/edit/${post._id}`}>
                                    Edit
                                  </Link>
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  asChild
                                  className="bg-primary text-primary-foreground hover:bg-primary/90"
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
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-muted-foreground font-medium">
                    No posts found for this date
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Create a new blog post to get started
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-border bg-card px-5 py-4">
              <Button className="w-full rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" asChild>
                <Link href="/admin/blog/create">
                  <AiOutlineFileAdd className="mr-2 h-5 w-5" />
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

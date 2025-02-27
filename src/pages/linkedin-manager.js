import { useState, useEffect } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  format,
  parseISO,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
} from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  SlideUp,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "@/components/animations/MotionComponents";
import { PageTransition } from "@/components/animations/MotionComponents";
import PostSuggestionGenerator from "@/components/linkedin/PostSuggestionGenerator";
import PostingAnalytics from "@/components/linkedin/PostingAnalytics";
import PostReminderNotification from "@/components/linkedin/PostReminderNotification";

// Daily suggestions for LinkedIn posts
const dailySuggestions = {
  Monday: [
    "Share your goals for the week",
    "Post about industry news that emerged over the weekend",
    "Share a motivational quote to start the week",
    "Highlight a successful project your team completed recently",
    "Share insights from a recent professional development experience",
  ],
  Tuesday: [
    "Share tips related to your expertise",
    "Post about tools that improve your productivity",
    "Share a recent achievement or milestone",
    "Highlight a team member or colleague's accomplishment",
    "Share current trends in your industry",
  ],
  Wednesday: [
    "Share a 'behind the scenes' look at your work",
    "Post a mid-week motivation or inspiration",
    "Ask a thought-provoking question related to your industry",
    "Share an interesting statistic or data point",
    "Post about a challenge you've overcome professionally",
  ],
  Thursday: [
    "Share a throwback post about your career journey",
    "Post about an upcoming industry event",
    "Share an article you've written or been featured in",
    "Highlight a project you're currently working on",
    "Share a learning resource your network might find valuable",
  ],
  Friday: [
    "Share your achievements from the week",
    "Post a fun team photo or experience",
    "Share weekend reading recommendations",
    "Highlight plans for professional development over the weekend",
    "Post a gratitude message to your team or customers",
  ],
  Saturday: [
    "Share a personal hobby that helps you maintain work-life balance",
    "Post about weekend events related to your industry",
    "Share a relaxed, authentic message about your professional philosophy",
    "Highlight how you recharge for the week ahead",
    "Share a book or podcast recommendation",
  ],
  Sunday: [
    "Share inspiration for the week ahead",
    "Post weekly planning tips",
    "Share reflections on your professional journey",
    "Highlight goals for the upcoming week",
    "Share industry predictions or trends to watch",
  ],
};

// Sample post templates with hashtags
const postTemplates = [
  {
    title: "Industry Insight",
    template:
      "I've been noticing [observation] in the [industry] space recently. This could mean [interpretation]. What are you seeing? #IndustryInsight #ProfessionalDevelopment #[Industry]",
  },
  {
    title: "Professional Growth",
    template:
      "Just completed [course/certification/book] on [topic]. My key takeaway: [insight]. How has continuous learning impacted your career? #ProfessionalDevelopment #NeverStopLearning #[Topic]",
  },
  {
    title: "Project Success",
    template:
      "Excited to share that our team just [achievement]. We overcame [challenge] by [solution]. Proud of what we've accomplished! #TeamSuccess #[Industry] #ProjectManagement",
  },
  {
    title: "Career Reflection",
    template:
      "Looking back on [timeframe], I've learned that [lesson]. This has changed how I approach [aspect of work]. What professional lessons have shaped your approach? #CareerInsights #ProfessionalJourney #Growth",
  },
  {
    title: "Tool Recommendation",
    template:
      "Recently started using [tool] for [purpose]. It's improved [metric/result] by [amount]. Game-changer for my workflow! Has anyone else tried it? #ProductivityTools #WorkSmarter #TechTools",
  },
];

export default function LinkedInManager() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("compose");
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [postImages, setPostImages] = useState([]);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [error, setError] = useState("");

  // Get day of week for suggestions
  const today = new Date();
  const dayOfWeek = format(today, "EEEE");
  const todaySuggestions = dailySuggestions[dayOfWeek] || [];

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/signin");
    }

    // Load posts from API when session is available
    if (session) {
      fetchPosts();
    }

    // Set active tab based on URL query parameter
    if (router.query.tab) {
      setActiveTab(router.query.tab);
    }
  }, [status, router, session, router.query.tab]);

  // Fetch posts from API
  const fetchPosts = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/linkedin/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setSavedPosts(data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePost = async () => {
    if (!postContent.trim() || !postTitle.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // Create post data
      const postData = {
        title: postTitle,
        content: postContent,
        scheduledFor: scheduledDate ? scheduledDate.toISOString() : null,
        images: postImages,
      };

      // Send to API
      const response = await fetch("/api/linkedin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      const data = await response.json();

      // Update local state with new post
      setSavedPosts((prev) => [data.post, ...prev]);

      // Reset form
      setPostContent("");
      setPostTitle("");
      setSelectedTemplate(null);
      setScheduledDate(null);
      setPostImages([]);

      // Show success message
      alert("Post saved successfully!");
    } catch (err) {
      console.error("Error saving post:", err);
      setError("Failed to save post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostNow = async () => {
    if (!postContent.trim() || !postTitle.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // Create post data
      const postData = {
        title: postTitle,
        content: postContent,
        posted: true,
        postedAt: new Date().toISOString(),
        images: postImages,
      };

      // Send to API
      const response = await fetch("/api/linkedin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to post to LinkedIn");
      }

      const data = await response.json();

      // Update local state with new post
      setSavedPosts((prev) => [data.post, ...prev]);

      // Reset form
      setPostContent("");
      setPostTitle("");
      setSelectedTemplate(null);
      setScheduledDate(null);
      setPostImages([]);

      // Show success message
      alert("Post shared to LinkedIn successfully!");
    } catch (err) {
      console.error("Error posting to LinkedIn:", err);
      setError("Failed to share post to LinkedIn. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/linkedin/posts?id=${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Remove post from local state
      setSavedPosts((prev) => prev.filter((post) => post._id !== postId));

      // Show success message
      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPost = (post) => {
    // Set form fields for editing
    setPostTitle(post.title);
    setPostContent(post.content);
    if (post.scheduledFor) {
      setScheduledDate(new Date(post.scheduledFor));
    } else {
      setScheduledDate(null);
    }
    setPostImages(post.images || []);

    // Switch to compose tab
    setActiveTab("compose");
  };

  const handlePublishPost = async (post) => {
    setIsLoading(true);
    setError("");

    try {
      const postData = {
        id: post._id,
        posted: true,
        postedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/linkedin/posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to publish post");
      }

      const data = await response.json();

      // Update post in local state
      setSavedPosts((prev) =>
        prev.map((p) => (p._id === post._id ? data.post : p))
      );

      // Show success message
      alert("Post published to LinkedIn successfully!");
    } catch (err) {
      console.error("Error publishing post:", err);
      setError("Failed to publish post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTemplate = (template) => {
    setSelectedTemplate(template);
    setPostContent(template.template);
  };

  const handleApplySuggestion = (suggestion) => {
    setPostContent((prev) => {
      if (prev.trim()) {
        return `${prev}\n\n${suggestion}`;
      }
      return suggestion;
    });
  };

  const navigateWeek = (direction) => {
    if (direction === "next") {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    } else {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    }
  };

  const postsForSelectedDate = savedPosts.filter((post) => {
    // For the API implementation, check if posts have scheduledFor field
    const postDate = post.scheduledFor
      ? format(new Date(post.scheduledFor), "yyyy-MM-dd")
      : format(new Date(post.createdAt), "yyyy-MM-dd");

    return postDate === format(selectedDate, "yyyy-MM-dd");
  });

  // Add a function to handle tab changes
  const handleTabChange = (value) => {
    setActiveTab(value);
    router.replace(
      {
        pathname: "/linkedin-manager",
        query: { tab: value },
      },
      undefined,
      { shallow: true }
    );
  };

  // Show error message if API error
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-red-900 text-white p-4 rounded-md">
          {error}
          <Button
            onClick={fetchPosts}
            className="mt-4 bg-red-700 hover:bg-red-800"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to sign in...</div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-black">
        <Head>
          <title>LinkedIn Post Manager</title>
        </Head>

        {/* Post reminder notification */}
        <PostReminderNotification posts={savedPosts} />

        <div className="container mx-auto px-4 py-16 mt-6">
          <SlideUp delay={0.2}>
            <h1 className="text-4xl font-bold text-white mb-8">
              LinkedIn Post Manager
            </h1>
          </SlideUp>

          <Tabs
            defaultValue={activeTab}
            onValueChange={handleTabChange}
            className="mb-8"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="compose"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Compose New Post
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Post Calendar
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                Post History
              </TabsTrigger>
            </TabsList>

            {/* Compose Tab */}
            <TabsContent value="compose">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Post Editor Card */}
                <div className="lg:col-span-2">
                  <Card className="bg-gray-900 text-white border-gray-800">
                    <CardHeader>
                      <CardTitle>Create Your LinkedIn Post</CardTitle>
                      <CardDescription className="text-gray-400">
                        Compose your content and share it directly to LinkedIn
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">
                            Post Title (for your reference)
                          </label>
                          <Input
                            placeholder="Enter a title for your post"
                            value={postTitle}
                            onChange={(e) => setPostTitle(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">
                            Post Content
                          </label>
                          <Textarea
                            placeholder="What do you want to share on LinkedIn?"
                            rows={10}
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white resize-none"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">
                            Schedule (Optional)
                          </label>
                          <div className="bg-gray-800 p-4 rounded-md">
                            <Calendar
                              mode="single"
                              selected={scheduledDate}
                              onSelect={setScheduledDate}
                              className="rounded-md bg-gray-800"
                              disabled={(date) => date < new Date()}
                            />
                          </div>
                          {scheduledDate && (
                            <div className="mt-2 text-blue-400">
                              Scheduled for:{" "}
                              {format(scheduledDate, "MMMM dd, yyyy")}
                              <Button
                                variant="link"
                                onClick={() => setScheduledDate(null)}
                                className="text-red-400 ml-2 p-0"
                              >
                                Clear
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleSavePost}
                        disabled={isLoading || !postContent.trim()}
                        className="border-gray-700 text-white hover:bg-gray-800"
                      >
                        Save as Draft
                      </Button>
                      <Button
                        onClick={handlePostNow}
                        disabled={isLoading || !postContent.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isLoading ? "Posting..." : "Post to LinkedIn"}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Suggestions and Templates Panel */}
                <div className="space-y-6">
                  {/* Custom Suggestion Generator */}
                  <PostSuggestionGenerator
                    onSelectSuggestion={handleApplySuggestion}
                  />

                  {/* Today's Suggestions */}
                  <Card className="bg-gray-900 text-white border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Today's Post Ideas ({dayOfWeek})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StaggerContainer className="space-y-3">
                        {todaySuggestions.map((suggestion, index) => (
                          <StaggerItem key={index} index={index}>
                            <HoverCard>
                              <div
                                className="p-3 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
                                onClick={() =>
                                  handleApplySuggestion(suggestion)
                                }
                              >
                                {suggestion}
                              </div>
                            </HoverCard>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </CardContent>
                  </Card>

                  {/* Post Templates */}
                  <Card className="bg-gray-900 text-white border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-xl">Post Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <StaggerContainer className="space-y-3">
                        {postTemplates.map((template, index) => (
                          <StaggerItem key={index} index={index}>
                            <HoverCard>
                              <div
                                className={`p-3 rounded-md cursor-pointer transition-colors ${
                                  selectedTemplate === template
                                    ? "bg-blue-900 border border-blue-700"
                                    : "bg-gray-800 hover:bg-gray-700"
                                }`}
                                onClick={() => handleApplyTemplate(template)}
                              >
                                <h3 className="font-medium mb-1">
                                  {template.title}
                                </h3>
                                <p className="text-sm text-gray-400">
                                  {template.template.substring(0, 80)}...
                                </p>
                              </div>
                            </HoverCard>
                          </StaggerItem>
                        ))}
                      </StaggerContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule">
              <Card className="bg-gray-900 text-white border-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Post Calendar</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => navigateWeek("prev")}
                        className="border-gray-700 text-white"
                      >
                        Previous Week
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigateWeek("next")}
                        className="border-gray-700 text-white"
                      >
                        Next Week
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Week of {format(currentWeekStart, "MMMM dd, yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-4">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const date = addDays(currentWeekStart, index);
                      const dayPosts = savedPosts.filter((post) => {
                        const postDate = post.scheduledFor
                          ? format(parseISO(post.scheduledFor), "yyyy-MM-dd")
                          : format(parseISO(post.createdAt), "yyyy-MM-dd");

                        return postDate === format(date, "yyyy-MM-dd");
                      });

                      const isToday =
                        format(date, "yyyy-MM-dd") ===
                        format(new Date(), "yyyy-MM-dd");

                      return (
                        <div
                          key={index}
                          className={`bg-gray-800 p-3 rounded-md min-h-[150px] ${
                            isToday ? "border border-blue-500" : ""
                          }`}
                          onClick={() => setSelectedDate(date)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">
                              {format(date, "EEE")}
                            </span>
                            <span
                              className={`text-sm ${
                                isToday ? "text-blue-400" : "text-gray-400"
                              }`}
                            >
                              {format(date, "MMM dd")}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {dayPosts.length > 0 ? (
                              dayPosts.map((post, i) => (
                                <HoverCard key={i}>
                                  <div className="bg-gray-700 p-2 rounded text-sm">
                                    <p className="truncate">{post.title}</p>
                                    <div className="flex items-center mt-1">
                                      <Badge
                                        className={
                                          post.posted
                                            ? "bg-green-900 text-green-300"
                                            : "bg-blue-900 text-blue-300"
                                        }
                                      >
                                        {post.posted ? "Posted" : "Scheduled"}
                                      </Badge>
                                    </div>
                                  </div>
                                </HoverCard>
                              ))
                            ) : (
                              <div className="text-gray-500 text-sm text-center mt-4">
                                No posts
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-800 pt-4">
                  <div className="w-full">
                    <h3 className="text-lg font-medium mb-3">
                      Posts for {format(selectedDate, "MMMM dd, yyyy")}
                    </h3>

                    {postsForSelectedDate.length > 0 ? (
                      <div className="space-y-4">
                        {postsForSelectedDate.map((post) => (
                          <Card
                            key={post.id}
                            className="bg-gray-800 border-gray-700"
                          >
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">
                                  {post.title}
                                </CardTitle>
                                <Badge
                                  className={
                                    post.posted
                                      ? "bg-green-900 text-green-300"
                                      : "bg-blue-900 text-blue-300"
                                  }
                                >
                                  {post.posted ? "Posted" : "Scheduled"}
                                </Badge>
                              </div>
                              <CardDescription className="text-gray-400">
                                {post.posted
                                  ? `Posted on ${format(
                                      parseISO(post.postedAt),
                                      "MMM dd, yyyy h:mm a"
                                    )}`
                                  : `Scheduled for ${format(
                                      parseISO(post.scheduledFor),
                                      "MMM dd, yyyy"
                                    )}`}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-300 whitespace-pre-line">
                                {post.content}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-md p-6 text-center">
                        <p className="text-gray-400">No posts for this date</p>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <Card className="bg-gray-900 text-white border-gray-800">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Post History</CardTitle>
                        <div className="flex space-x-2">
                          <select
                            className="bg-gray-800 border border-gray-700 rounded-md text-white p-2"
                            onChange={(e) => {
                              // Filter implementation would go here
                            }}
                          >
                            <option value="all">All Posts</option>
                            <option value="posted">Posted</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="draft">Drafts</option>
                          </select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {savedPosts.length > 0 ? (
                        <StaggerContainer className="space-y-4">
                          {savedPosts.map((post, index) => (
                            <StaggerItem
                              key={post._id || post.id}
                              index={index}
                            >
                              <Card className="bg-gray-800 border-gray-700">
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">
                                      {post.title}
                                    </CardTitle>
                                    <Badge
                                      className={
                                        post.posted
                                          ? "bg-green-900 text-green-300"
                                          : post.scheduledFor
                                          ? "bg-blue-900 text-blue-300"
                                          : "bg-gray-700 text-gray-300"
                                      }
                                    >
                                      {post.posted
                                        ? "Posted"
                                        : post.scheduledFor
                                        ? "Scheduled"
                                        : "Draft"}
                                    </Badge>
                                  </div>
                                  <CardDescription className="text-gray-400">
                                    {post.posted
                                      ? `Posted on ${format(
                                          new Date(post.postedAt),
                                          "MMM dd, yyyy h:mm a"
                                        )}`
                                      : post.scheduledFor
                                      ? `Scheduled for ${format(
                                          new Date(post.scheduledFor),
                                          "MMM dd, yyyy"
                                        )}`
                                      : `Created on ${format(
                                          new Date(post.createdAt),
                                          "MMM dd, yyyy"
                                        )}`}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-gray-300 whitespace-pre-line">
                                    {post.content}
                                  </p>
                                </CardContent>
                                <CardFooter className="border-t border-gray-700 pt-3 flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-600 text-white"
                                    onClick={() => handleEditPost(post)}
                                  >
                                    Edit
                                  </Button>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-800 text-red-400 hover:bg-red-900/30"
                                    onClick={() =>
                                      handleDeletePost(post._id || post.id)
                                    }
                                  >
                                    Delete
                                  </Button>

                                  {!post.posted && (
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={() => handlePublishPost(post)}
                                    >
                                      Post Now
                                    </Button>
                                  )}
                                </CardFooter>
                              </Card>
                            </StaggerItem>
                          ))}
                        </StaggerContainer>
                      ) : (
                        <div className="bg-gray-800 rounded-md p-10 text-center">
                          <p className="text-gray-400">No posts yet</p>
                          <Button
                            className="mt-4 bg-blue-600 hover:bg-blue-700"
                            onClick={() => setActiveTab("compose")}
                          >
                            Create Your First Post
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <PostingAnalytics posts={savedPosts} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}

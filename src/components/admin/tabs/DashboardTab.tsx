// Converted to TypeScript - migrated
import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Loader2,
  FileText,
  MessageSquare,
  Users,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  Bot,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyTable } from "@/components/ui/empty-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import Alert Dialog components
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/animations/MotionComponents";

// Simple date formatter
const formatDate = (dateString: string | Date | undefined) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "PP"); // e.g., Sep 30, 2024
};

const POSTS_PER_PAGE = 5;

interface BlogPost {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  isPublished: boolean;
  createdAt: string | Date;
}

interface DashboardTabProps {
  unreadCount?: number | null;
}

export default function DashboardTab({ unreadCount }: DashboardTabProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postToDelete, setPostToDelete] = useState<string | null>(null); // State to hold ID of post to delete
  const [isDeleting, setIsDeleting] = useState(false); // State for delete loading
  const [subscribersCount, setSubscribersCount] = useState<number | null>(null);
  const [visitorsCount, setVisitorsCount] = useState<number | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetchPosts(currentPage);
    fetchDashboardStats();
  }, [currentPage]);

  const fetchDashboardStats = async () => {
    setIsLoadingStats(true);
    try {
      // Fetch Subscribers count
      const subRes = await fetch("/api/subscribers");
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubscribersCount(subData.count || 0);
      }

      // Fetch API usage (as a proxy for visitors/activity)
      const usageRes = await fetch("/api/admin/api-usage");
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        const totalUsage = Array.isArray(usageData.data) 
          ? usageData.data.reduce((acc: number, curr: { count?: number }) => acc + (curr.count || 0), 0)
          : (usageData.data?.count || 0);
        setVisitorsCount(totalUsage);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/blog?limit=${POSTS_PER_PAGE}&page=${page}&sort=-createdAt`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      const data = await response.json();
      if (data.success && data.data && data.pagination) {
        setBlogPosts(data.data);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalPosts(data.pagination.total || 0);
        if (
          page > (data.pagination.totalPages || 1) &&
          (data.pagination.totalPages || 1) > 0
        ) {
          setCurrentPage(Math.max(1, data.pagination.totalPages || 1));
        } else if (data.pagination.total === 0) {
          setCurrentPage(1);
          setTotalPages(1);
        }
      } else {
        throw new Error("Invalid data format received for blog posts");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Could not load blog posts.";
      setError(errorMessage);
      toast.error(errorMessage);
      setBlogPosts([]);
      setTotalPages(1);
      setTotalPosts(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Opens the confirmation dialog by setting the post ID
  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
  };

  // Performs the actual deletion after confirmation
  const confirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/delete?id=${postToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete post");
      }
      toast.success("Blog post deleted successfully.");
      setPostToDelete(null); // Close dialog implicitly by resetting state
      // Refetch or adjust page
      if (blogPosts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1); // Go to previous page if last item deleted
      } else {
        fetchPosts(currentPage); // Refetch current page
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete blog post.";
      toast.error(errorMessage);
      console.error("Delete post error:", err);
    } finally {
      setIsDeleting(false);
      // No need to setPostToDelete(null) here as AlertDialog closes on action/cancel
    }
  };

  return (
    <StaggerContainer className="space-y-5">
      {/* Stats Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem index={0}>
          <Card className="rounded-xl border border-border bg-card transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-heading font-semibold text-muted-foreground">
                Total Posts
              </CardTitle>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && totalPosts === 0 ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl font-black text-foreground">
                  {totalPosts}
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem index={1}>
          <Card className="rounded-xl border border-border bg-card transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-heading font-semibold text-muted-foreground">
                Unread Messages
              </CardTitle>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-black text-foreground">
                {unreadCount ?? (
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                )}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem index={2}>
          <Card className="rounded-xl border border-border bg-card transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-heading font-semibold text-muted-foreground">
                Subscribers
              </CardTitle>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl font-black text-foreground">
                  {subscribersCount ?? "0"}
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem index={3}>
          <Card className="rounded-xl border border-border bg-card transition-all duration-300 shadow-sm hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm sm:text-base font-heading font-semibold text-muted-foreground">
                Site Visitors
              </CardTitle>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="text-2xl sm:text-3xl font-black text-foreground">
                  {visitorsCount ?? "0"}
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>
      </div>

      {/* Main Content Area - Grid Layout */}
      <div className="grid gap-5 lg:grid-cols-1">
        {/* Recent Blog Posts Table */}
        <StaggerItem index={1} className="lg:col-span-1">
          <Card className="h-full rounded-2xl border border-border bg-card shadow-md">
            <CardHeader className="flex flex-col items-start justify-between gap-3 pb-4 md:pb-5 md:flex-row md:items-center">
              <CardTitle className="text-lg md:text-xl font-heading font-semibold text-foreground">
                Recent Blog Posts
              </CardTitle>
              <div className="flex w-full flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  size="sm"
                  asChild
                  className="rounded-xl bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 text-sm"
                >
                  <Link href="/admin/blog/ai-create" aria-label="Use AI to generate a blog post">
                    <Bot className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" /> AI Generator
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-xl bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:bg-primary/90 text-sm"
                >
                  <Link href="/admin/blog/create" aria-label="Create a new blog post manually">
                    <FilePlus className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" /> Create New
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
               {isLoading && (
                   <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border bg-muted/50">
                          <TableHead className="text-left text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Title
                          </TableHead>
                          <TableHead className="text-left text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Status
                          </TableHead>
                          <TableHead className="text-left hidden sm:table-cell text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Created At
                          </TableHead>
                          <TableHead className="text-right text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...Array(5)].map((_, i) => (
                          <TableRow key={i} className="border-b border-border">
                            <TableCell className="py-3 sm:py-4">
                              <div className="h-4 w-32 sm:w-48 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell className="py-3 sm:py-4">
                              <div className="h-5 w-16 sm:w-20 bg-muted rounded-full animate-pulse" />
                            </TableCell>
                            <TableCell className="py-3 sm:py-4 hidden sm:table-cell">
                              <div className="h-4 w-24 sm:w-28 bg-muted rounded animate-pulse" />
                            </TableCell>
                            <TableCell className="py-3 sm:py-4 text-right">
                              <div className="flex justify-end gap-1.5 sm:gap-2">
                                <div className="size-7 sm:size-8 bg-muted rounded-lg animate-pulse" />
                                <div className="size-7 sm:size-8 bg-muted rounded-lg animate-pulse" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
               )}
              {error && !isLoading && (
                <div className="flex items-center justify-center py-10">
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-8 py-6 text-center shadow-md">
                    <h3 className="mb-2 text-2xl font-heading font-semibold text-destructive">
                      Oops! Something went wrong
                    </h3>
                    <p className="font-medium text-destructive">Error: {error}</p>
                  </div>
                </div>
              )}
               {!isLoading && !error && blogPosts.length === 0 && (
                 <div className="overflow-x-auto">
                   <Table>
                     <TableHeader>
                       <TableRow className="border-b border-border bg-muted/50">
                         <TableHead className="text-left text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                           Title
                         </TableHead>
                         <TableHead className="text-left text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                           Status
                         </TableHead>
                         <TableHead className="text-left hidden sm:table-cell text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                           Created
                         </TableHead>
                         <TableHead className="text-left hidden sm:table-cell text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                           Views
                         </TableHead>
                         <TableHead className="text-right text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                           Actions
                         </TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       <EmptyTable
                         title="No Blog Posts Yet"
                         description="Create your first blog post to get started!"
                         illustration="files"
                         colSpan={5}
                       />
                     </TableBody>
                   </Table>
                 </div>
               )}
              {!isLoading && !error && blogPosts.length > 0 && (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border bg-muted/50">
                          <TableHead className="text-left text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Title
                          </TableHead>
                          <TableHead className="text-left text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Status
                          </TableHead>
                          <TableHead className="text-left hidden sm:table-cell text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Created At
                          </TableHead>
                          <TableHead className="text-right text-xs sm:text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts.map((post) => (
                          <TableRow
                            key={post._id}
                            className="border-b border-border transition-colors duration-200 hover:bg-muted/50"
                          >
                            <TableCell className="text-sm sm:text-md font-semibold text-foreground">
                              {post.title}
                            </TableCell>
                            <TableCell>
                              <Badge
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  setIsLoading(true);
                                  try {
                                    const res = await fetch(`/api/blog/edit`, {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        id: post._id,
                                        isPublished: !post.isPublished,
                                      }),
                                    });
                                    if (!res.ok) {
                                      toast.error("Failed to update status");
                                    } else {
                                      toast.success(
                                        `Status changed to ${
                                          !post.isPublished
                                            ? "Published"
                                            : "Draft"
                                        }`
                                      );
                                      fetchPosts(currentPage);
                                    }
                                  } catch (err) {
                                    toast.error("Failed to update status");
                                  } finally {
                                    setIsLoading(false);
                                  }
                                }}
                                onKeyDown={async (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsLoading(true);
                                    try {
                                      const res = await fetch(`/api/blog/edit`, {
                                        method: "PUT",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          id: post._id,
                                          isPublished: !post.isPublished,
                                        }),
                                      });
                                      if (!res.ok) {
                                        toast.error("Failed to update status");
                                      } else {
                                        toast.success(
                                          `Status changed to ${
                                            !post.isPublished
                                              ? "Published"
                                              : "Draft"
                                          }`
                                        );
                                        fetchPosts(currentPage);
                                      }
                                    } catch (err) {
                                      toast.error("Failed to update status");
                                    } finally {
                                      setIsLoading(false);
                                    }
                                  }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-label={`Toggle publication status. Currently ${post.isPublished ? 'Published' : 'Draft'}`}
                                variant={
                                  post.isPublished ? "success" : "warning"
                                }
                                className={`cursor-pointer rounded-lg sm:rounded-xl border px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-bold transition-all duration-300 ${
                                  post.isPublished
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                }`}
                                title="Click to toggle status"
                              >
                                {isLoading && (
                                  <div className="mr-0.5 sm:mr-1 inline text-xs sm:text-sm">
                                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-primary" />
                                  </div>
                                )}
                                {post.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell font-medium text-muted-foreground text-sm">
                              {formatDate(post.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 sm:gap-2 flex-wrap">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="rounded-lg sm:rounded-xl bg-primary text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary/90 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                                >
                                  <Link href={`/admin/blog/edit/${post._id}`} aria-label={`Edit blog post: ${post.title}`}>
                                    Edit
                                  </Link>
                                </Button>
                                {post.isPublished && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="rounded-lg sm:rounded-xl border border-primary/20 bg-card text-primary transition-all duration-300 hover:bg-primary/10 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3 hidden sm:inline-flex"
                                  >
                                    <Link
                                      href={`/blog/${post.slug}`}
                                      target="_blank"
                                      aria-label={`View live blog post: ${post.title}`}
                                    >
                                      View
                                    </Link>
                                  </Button>
                                )}
                                {/* Delete Button wrapped in AlertDialogTrigger */}
                                <AlertDialog
                                  onOpenChange={(open) =>
                                    !open && setPostToDelete(null)
                                  }
                                >
                                  {" "}
                                  {/* Reset state when dialog closes */}
                                  <AlertDialogTrigger asChild>
                                    {/* Use a normal button, AlertDialogTrigger handles opening */}
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="rounded-lg sm:rounded-xl bg-destructive text-destructive-foreground shadow-sm transition-all duration-300 hover:bg-destructive/90 text-xs sm:text-sm h-7 sm:h-8 w-7 sm:w-auto px-0 sm:px-3"
                                      onClick={() => handleDeleteClick(post._id)}
                                      aria-label={`Delete blog post: ${post.title}`}
                                    >
                                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  {/* Render content only when this specific post is targeted */}
                                  {postToDelete === post._id && (
                                    <AlertDialogContent className="rounded-2xl border border-border bg-card text-foreground shadow-xl max-w-md mx-4">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-heading font-semibold text-foreground">
                                          <div className="text-3xl sm:text-4xl">⚠️</div>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-base sm:text-lg font-medium text-muted-foreground">
                                          This action cannot be undone. This will
                                          permanently delete the blog post titled
                                          <span className="font-bold text-destructive">
                                            {" "}
                                            "
                                            {blogPosts.find(
                                              (p) => p._id === postToDelete
                                            )?.title || "this post"}
                                            "
                                          </span>
                                          .
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter className="gap-3 flex-col sm:flex-row">
                                        <AlertDialogCancel
                                          className="rounded-xl border border-border bg-card px-4 sm:px-5 py-2 text-muted-foreground transition-all duration-300 hover:bg-muted/50 w-full sm:w-auto"
                                          onClick={() => setPostToDelete(null)}
                                        >
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={confirmDelete}
                                          disabled={isDeleting}
                                          className="rounded-xl bg-destructive px-4 sm:px-5 py-2 text-destructive-foreground shadow-sm transition-all duration-300 hover:bg-destructive/90 disabled:opacity-70 w-full sm:w-auto"
                                        >
                                          {isDeleting ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                                          ) : null}
                                          Yes, delete post
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  )}
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-end gap-3 sm:gap-4 py-4 sm:py-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage <= 1 || isLoading}
                        className="rounded-lg sm:rounded-xl border border-border bg-card px-3 py-1.5 sm:px-4 sm:py-2 text-muted-foreground transition-all duration-300 hover:bg-muted/50 disabled:opacity-40 text-xs sm:text-sm"
                        aria-label="Go to previous page"
                      >
                        <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" /> Previous
                      </Button>
                      <div className="rounded-lg sm:rounded-xl border border-border bg-muted/50 px-3 py-1.5 sm:px-4 sm:py-2">
                        <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages || isLoading}
                        className="rounded-lg sm:rounded-xl border border-border bg-card px-3 py-1.5 sm:px-4 sm:py-2 text-muted-foreground transition-all duration-300 hover:bg-muted/50 disabled:opacity-40 text-xs sm:text-sm"
                        aria-label="Go to next page"
                      >
                        Next <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </StaggerItem>
      </div>
    </StaggerContainer>
  );
}


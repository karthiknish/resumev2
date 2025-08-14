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
  AlertTriangle, // Icon for Alert Dialog
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
import RecentContactsWidget from "@/components/admin/widgets/RecentContactsWidget"; // Import the new widget

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "PP"); // e.g., Sep 30, 2024
};

const POSTS_PER_PAGE = 5;

export default function DashboardTab({ unreadCount }) {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postToDelete, setPostToDelete] = useState(null); // State to hold ID of post to delete
  const [isDeleting, setIsDeleting] = useState(false); // State for delete loading

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
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
    } catch (err) {
      setError(err.message);
      toast.error("Could not load blog posts.");
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
  const handleDeleteClick = (postId) => {
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
    } catch (err) {
      toast.error(err.message || "Failed to delete blog post.");
      console.error("Delete post error:", err);
    } finally {
      setIsDeleting(false);
      // No need to setPostToDelete(null) here as AlertDialog closes on action/cancel
    }
  };

  return (
    <StaggerContainer className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem index={0}>
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-bold text-gray-700">
                Total Posts
              </CardTitle>
              <div className="p-2 bg-blue-600 rounded-xl">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && totalPosts === 0 ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="text-3xl font-black text-gray-800">
                  {totalPosts}
                </div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem index={1}>
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-200 hover:border-green-300 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-bold text-gray-700">
                Unread Messages
              </CardTitle>
              <div className="p-2 bg-blue-600 rounded-xl">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-gray-800">
                {unreadCount ?? (
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem index={2}>
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 hover:border-orange-300 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-bold text-gray-700">
                Subscribers
              </CardTitle>
              <div className="p-2 bg-blue-600 rounded-xl">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-gray-800">N/A</div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem index={3}>
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-bold text-gray-700">
                Site Visitors
              </CardTitle>
              <div className="p-2 bg-blue-600 rounded-xl">
                <BarChart2 className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-gray-800">N/A</div>
            </CardContent>
          </Card>
        </StaggerItem>
      </div>

      {/* Main Content Area - Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-1">
        {/* Recent Blog Posts Table */}
        <StaggerItem index={1} className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-2xl rounded-3xl h-full">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
              <CardTitle
                className="text-2xl font-black text-gray-800"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Recent Blog Posts
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="sm"
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  <Link href="/admin/blog/ai-create">
                    <Bot className="mr-2 h-4 w-4" /> AI Generator
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  <Link href="/admin/blog/create">
                    <FilePlus className="mr-2 h-4 w-4" /> Create New
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl px-8 py-6 shadow-xl flex items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
              {error && !isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="bg-white/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl px-8 py-6 shadow-xl text-center">
                    <h3
                      className="text-2xl font-black text-gray-800 mb-2"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      Oops! Something went wrong
                    </h3>
                    <p className="text-red-600 font-medium">Error: {error}</p>
                  </div>
                </div>
              )}
              {!isLoading && !error && blogPosts.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-2xl px-8 py-6 shadow-xl text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3
                      className="text-2xl font-black text-gray-800 mb-2"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      No Blog Posts Yet
                    </h3>
                    <p className="text-gray-600 font-medium">
                      Create your first blog post to get started!
                    </p>
                  </div>
                </div>
              )}
              {!isLoading && !error && blogPosts.length > 0 && (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-purple-200 hover:bg-purple-50/50">
                          <TableHead className="text-gray-700 font-bold text-lg">
                            Title
                          </TableHead>
                          <TableHead className="text-gray-700 font-bold text-lg">
                            Status
                          </TableHead>
                          <TableHead className="text-gray-700 font-bold text-lg">
                            Created At
                          </TableHead>
                          <TableHead className="text-right text-gray-700 font-bold text-lg">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts.map((post) => (
                          <TableRow
                            key={post._id}
                            className="border-purple-100 hover:bg-purple-50/30 transition-colors duration-200"
                          >
                            <TableCell className="font-semibold text-gray-800 text-lg">
                              {post.title}
                            </TableCell>
                            <TableCell>
                              <Badge
                                as="button"
                                disabled={isLoading}
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
                                variant={
                                  post.isPublished ? "success" : "warning"
                                }
                                className={`cursor-pointer transition-all duration-300 font-bold rounded-xl px-3 py-1 ${
                                  post.isPublished
                                    ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-300"
                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-300"
                                }`}
                                title="Click to toggle status"
                              >
                                {isLoading && (
                                  <div className="text-sm mr-1 inline">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  </div>
                                )}
                                {post.isPublished ? "Published" : "Draft"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-700 font-medium">
                              {formatDate(post.createdAt)}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                              >
                                <Link href={`/admin/blog/edit/${post._id}`}>
                                  Edit
                                </Link>
                              </Button>
                              {post.isPublished && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                  className="bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                  <Link
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
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
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                    onClick={() => handleDeleteClick(post._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                {/* Render content only when this specific post is targeted */}
                                {postToDelete === post._id && (
                                  <AlertDialogContent className="bg-white/90 backdrop-blur-sm border-2 border-red-200 rounded-2xl shadow-2xl">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle
                                        className="flex items-center gap-3 text-2xl font-black text-gray-800"
                                        style={{
                                          fontFamily:
                                            "Space Grotesk, sans-serif",
                                        }}
                                      >
                                        <div className="text-4xl">⚠️</div>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-gray-700 font-medium text-lg">
                                        This action cannot be undone. This will
                                        permanently delete the blog post titled
                                        <span className="font-bold text-red-600">
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
                                    <AlertDialogFooter className="gap-3">
                                      <AlertDialogCancel
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border-transparent"
                                        onClick={() => setPostToDelete(null)}
                                      >
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                      >
                                        {isDeleting ? (
                                          <div className="animate-spin text-lg mr-2">
                                            ⚡
                                          </div>
                                        ) : null}
                                        Yes, delete post
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                )}
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-4 py-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage <= 1 || isLoading}
                        className="bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                      </Button>
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 rounded-xl border border-purple-200">
                        <span className="text-sm font-bold text-purple-700">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages || isLoading}
                        className="bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
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

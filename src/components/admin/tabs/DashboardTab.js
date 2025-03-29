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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StaggerItem index={0}>
          <Card className="border-gray-700 bg-gray-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              {isLoading && totalPosts === 0 ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <div className="text-2xl font-bold">{totalPosts}</div>
              )}
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem index={1}>
          <Card className="border-gray-700 bg-gray-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unread Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unreadCount ?? <Loader2 className="h-6 w-6 animate-spin" />}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem index={2}>
          <Card className="border-gray-700 bg-gray-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem index={3}>
          <Card className="border-gray-700 bg-gray-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Site Visitors
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">N/A</div>
            </CardContent>
          </Card>
        </StaggerItem>
      </div>

      {/* Recent Blog Posts Table */}
      <StaggerItem index={1}>
        <Card className="border-gray-700 bg-gray-900 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Recent Blog Posts</CardTitle>
            <div className="flex space-x-2">
              <Button
                size="sm"
                asChild
                className="bg-green-600 hover:bg-green-700"
              >
                <Link href="/admin/blog/ai-create">
                  <Bot className="mr-2 h-4 w-4" /> AI Generator
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/admin/blog/create">
                  <FilePlus className="mr-2 h-4 w-4" /> Create New
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            )}
            {error && !isLoading && (
              <p className="text-red-400 text-center py-10">Error: {error}</p>
            )}
            {!isLoading && !error && blogPosts.length === 0 && (
              <p className="text-gray-400 text-center py-10">
                No blog posts found.
              </p>
            )}
            {!isLoading && !error && blogPosts.length > 0 && (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-800">
                        <TableHead className="text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">
                          Created At
                        </TableHead>
                        <TableHead className="text-right text-gray-300">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow
                          key={post._id}
                          className="border-gray-800 hover:bg-gray-800/50"
                        >
                          <TableCell className="font-medium">
                            {post.title}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={post.isPublished ? "success" : "warning"}
                              className={
                                post.isPublished
                                  ? "bg-green-900 text-green-300"
                                  : "bg-yellow-900 text-yellow-300"
                              }
                            >
                              {post.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(post.createdAt)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="text-white hover:text-white hover:bg-gray-600"
                            >
                              <Link href={`/admin/blog/edit/${post._id}`}>
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-white border-gray-600 hover:text-white hover:bg-gray-600"
                            >
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                View
                              </Link>
                            </Button>
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
                                  className="text-red-400 hover:bg-red-700 hover:text-white"
                                  onClick={() => handleDeleteClick(post._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              {/* Render content only when this specific post is targeted */}
                              {postToDelete === post._id && (
                                <AlertDialogContent className="bg-gray-900 border-gray-700 text-white">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center gap-2">
                                      <AlertTriangle className="text-red-500" />{" "}
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-400">
                                      This action cannot be undone. This will
                                      permanently delete the blog post titled "
                                      {blogPosts.find(
                                        (p) => p._id === postToDelete
                                      )?.title || "this post"}
                                      ".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      className="bg-gray-600 hover:bg-gray-700 border-gray-600"
                                      onClick={() => setPostToDelete(null)}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={confirmDelete}
                                      disabled={isDeleting}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {isDeleting ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage <= 1 || isLoading}
                      className="border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <span className="text-sm text-gray-400">
                      {" "}
                      Page {currentPage} of {totalPages}{" "}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages || isLoading}
                      className="border-gray-600 hover:bg-gray-700 disabled:opacity-50"
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
    </StaggerContainer>
  );
}

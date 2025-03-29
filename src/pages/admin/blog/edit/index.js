import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import Pagination components

function Index() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [paginationData, setPaginationData] = useState(null); // State for pagination info
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching

  useEffect(() => {
    getData(currentPage); // Fetch initial page
  }, [currentPage]); // Refetch when currentPage changes

  const getData = async (page = 1) => {
    setIsLoading(true);
    try {
      // Fetch posts for the specific page
      const res = await fetch(`/api/blog?page=${page}&limit=10`); // Added page and limit params
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
        setPaginationData(result.pagination); // Store pagination details
      } else {
        setData([]);
        setPaginationData(null);
        console.error("Failed to fetch blog posts:", result.message);
        toast.error("Failed to load blog posts.");
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load blog posts.");
      setData([]);
      setPaginationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async () => {
    try {
      // Corrected endpoint to /api/blog and pass ID as query param for DELETE
      const res = await fetch(`/api/blog?id=${deleteId}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to delete post");
      }
      toast.success("Post deleted successfully.");
      setShowModal(false);
      // Refresh the current page after delete
      getData(currentPage);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(`Error deleting post: ${error.message}`);
      setShowModal(false); // Close modal even on error
    }
  };

  // Handler for changing the publish status directly from the list
  const handleStatusChange = async (postId, isChecked) => {
    // Optimistically update the UI
    setData((currentData) =>
      currentData.map((post) =>
        post._id === postId ? { ...post, isPublished: isChecked } : post
      )
    );

    try {
      // Send update to the backend - Corrected endpoint to /api/blog
      const response = await axios.put("/api/blog", {
        id: postId,
        isPublished: isChecked,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update status");
      }
      toast.success(
        `Post status updated to ${isChecked ? "Published" : "Draft"}.`
      );
      // No need to call getData() again due to optimistic update
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Failed to update post status.");
      // Revert optimistic update on error
      setData((currentData) =>
        currentData.map((post) =>
          post._id === postId ? { ...post, isPublished: !isChecked } : post
        )
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (paginationData?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const Modal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-lg font-medium mb-4 text-white">
          Are you sure you want to delete this post?
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setShowModal(false)}
            className="text-gray-300 hover:text-white border-gray-600 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={deleteData}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Manage Blog Posts</title>
      </Head>
      <PageContainer>
        <div className="min-h-screen py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white font-calendas">
                Blog Posts
              </h1>
              <Link href="/admin/blog/create">
                <Button>Create New Post</Button>
              </Link>
            </div>
            <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-10 text-gray-500"
                        >
                          Loading posts...
                        </td>
                      </tr>
                    ) : data?.length > 0 ? (
                      data.map((post) => (
                        <tr key={post._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white hover:text-blue-400">
                              <Link href={`/admin/blog/edit/${post._id}`}>
                                {post.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`publish-switch-${post._id}`}
                                checked={post.isPublished}
                                onCheckedChange={(isChecked) =>
                                  handleStatusChange(post._id, isChecked)
                                }
                                aria-label={`Toggle publish status for ${post.title}`}
                              />
                              <Label
                                htmlFor={`publish-switch-${post._id}`}
                                className="text-xs text-gray-400"
                              >
                                {post.isPublished ? "Published" : "Draft"}
                              </Label>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-4">
                              <Link
                                href={`/admin/blog/edit/${post._id}`}
                                className="text-blue-400 hover:text-blue-300"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => {
                                  setDeleteId(post._id);
                                  setShowModal(true);
                                }}
                                className="text-red-400 hover:text-red-300"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-10 text-gray-500"
                        >
                          No blog posts found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {paginationData && paginationData.totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                        aria-disabled={currentPage <= 1}
                        className={
                          currentPage <= 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {/* Simple page number display - can be enhanced */}
                    <PaginationItem>
                      <span className="px-4 py-2 text-sm text-gray-400">
                        Page {currentPage} of {paginationData.totalPages}
                      </span>
                    </PaginationItem>
                    {/* Add Ellipsis and specific page links if needed later */}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                        aria-disabled={currentPage >= paginationData.totalPages}
                        className={
                          currentPage >= paginationData.totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
      {showModal && <Modal />}
    </>
  );
}

export default Index;

import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react"; // Import useState
import {
  AiOutlineFileAdd,
  AiOutlineEdit,
  AiOutlineRobot,
  AiOutlineFileText, // Icon for Total Posts
  AiOutlineMessage, // Icon for Unread Messages
} from "react-icons/ai";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "@/components/animations/MotionComponents";

// Accept unreadCount prop
function DashboardTab({ blogPosts, isLoading, unreadCount }) {
  const totalPosts = blogPosts?.length || 0;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 blog posts per page

  // Ensure blogPosts is an array before slicing
  const safeBlogPosts = Array.isArray(blogPosts) ? blogPosts : [];

  // Pagination Calculations for Blog Posts
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentBlogPosts = safeBlogPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );
  const totalBlogPages = Math.ceil(safeBlogPosts.length / itemsPerPage);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    // Apply grid layout to the main FadeIn container
    <FadeIn delay={0.2} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Stats Cards Row - Spanning full width */}
      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Posts Card */}
        <StaggerItem index={0}>
          <Card className="glow-card bg-gray-900">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Posts</p>
                <p className="text-3xl font-bold text-white">{totalPosts}</p>
              </div>
              <AiOutlineFileText className="text-4xl text-blue-500 opacity-80" />
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Unread Messages Card */}
        <StaggerItem index={1}>
          <Card className="glow-card bg-gray-900">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-400">
                  Unread Messages
                </p>
                <p className="text-3xl font-bold text-white">{unreadCount}</p>
              </div>
              <AiOutlineMessage className="text-4xl text-green-500 opacity-80" />
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Placeholder Card 1 (e.g., Users) */}
        <StaggerItem index={2}>
          <Card className="glow-card bg-gray-900 opacity-60">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-3xl font-bold text-gray-400">--</p>
              </div>
              {/* Add User Icon */}
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Placeholder Card 2 (e.g., Site Visits) */}
        <StaggerItem index={3}>
          <Card className="glow-card bg-gray-900 opacity-60">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Site Visits (24h)
                </p>
                <p className="text-3xl font-bold text-gray-400">--</p>
              </div>
              {/* Add Visits Icon */}
            </CardContent>
          </Card>
        </StaggerItem>
      </div>

      {/* Action Cards Row - Spanning full width */}
      <StaggerContainer className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StaggerItem index={0}>
          <Link href="/admin/blog/create" className="block h-full">
            <HoverCard>
              <Card className="h-full glow-card">
                <CardContent className="flex flex-col items-center justify-center p-8 h-full bg-gray-900">
                  <AiOutlineFileAdd className="text-5xl mb-4 text-blue-500" />
                  <span className="text-white text-lg font-calendas">
                    Create Blog
                  </span>
                </CardContent>
              </Card>
            </HoverCard>
          </Link>
        </StaggerItem>

        <StaggerItem index={1}>
          <Link href="/admin/blog/ai-create" className="block h-full">
            <HoverCard>
              <Card className="h-full glow-card">
                <CardContent className="flex flex-col items-center justify-center p-8 h-full bg-gray-900">
                  <AiOutlineRobot className="text-5xl mb-4 text-blue-500" />
                  <span className="text-white text-lg font-calendas">
                    AI Blog Creator
                  </span>
                </CardContent>
              </Card>
            </HoverCard>
          </Link>
        </StaggerItem>

        <StaggerItem index={2}>
          <Link href="/admin/blog/edit" className="block h-full">
            <HoverCard>
              <Card className="h-full glow-card">
                <CardContent className="flex flex-col items-center justify-center p-8 h-full bg-gray-900">
                  <AiOutlineEdit className="text-5xl mb-4 text-blue-500" />
                  <span className="text-white text-lg font-calendas">
                    Edit/Delete Blog
                  </span>
                </CardContent>
              </Card>
            </HoverCard>
          </Link>
        </StaggerItem>
      </StaggerContainer>

      {/* Recent Blog Posts Summary - Spanning full width */}
      <SlideUp delay={0.6} className="lg:col-span-4 mt-8">
        <Card className="glow-card">
          <CardHeader className="bg-black rounded-t-lg">
            <CardTitle className="text-2xl font-medium text-white font-calendas glow-blue">
              Recent Blog Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-gray-900 p-0">
            {isLoading ? (
              <p className="text-gray-300 p-4">Loading blog posts...</p>
            ) : currentBlogPosts && currentBlogPosts.length > 0 ? ( // Check currentBlogPosts
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 border-b-2">
                        <TableCell className="text-gray-300 py-2 w-2/5 font-bold text-left">
                          Title
                        </TableCell>
                        <TableCell className="text-gray-300 py-2 w-1/5 font-bold text-left">
                          Date
                        </TableCell>
                        <TableCell className="text-gray-300 py-2 w-1/5 font-bold text-left">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="mt-0">
                      {/* Map over currentBlogPosts */}
                      {currentBlogPosts.map((post, index) => (
                        <TableRow
                          key={post._id || index}
                          className="border-gray-700 hover:bg-gray-800/50"
                        >
                          <TableCell className="font-medium text-white truncate w-2/5 text-left">
                            {post.title}
                          </TableCell>
                          <TableCell className="text-gray-300 w-1/5 text-left">
                            {format(
                              new Date(post.createdAt || new Date()),
                              "MMM dd, yyyy"
                            )}
                          </TableCell>
                          <TableCell className="text-left w-1/5">
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-white hover:text-white hover:bg-gray-800"
                              >
                                <Link href={`/admin/blog/edit?id=${post._id}`}>
                                  Edit
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-400 hover:bg-gray-800"
                                onClick={() => {
                                  if (
                                    confirm(
                                      "Are you sure you want to delete this post?"
                                    )
                                  ) {
                                    fetch(`/api/blog/delete?id=${post._id}`, {
                                      method: "DELETE",
                                    })
                                      .then((response) => response.json())
                                      .then((data) => {
                                        if (data.success) {
                                          // Ideally, trigger a refresh via prop function
                                          window.location.reload();
                                        } else {
                                          alert(
                                            "Failed to delete post: " +
                                              data.message
                                          );
                                        }
                                      })
                                      .catch((error) => {
                                        console.error(
                                          "Error deleting post:",
                                          error
                                        );
                                        alert(
                                          "An error occurred while deleting the post"
                                        );
                                      });
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Blog Post Pagination Controls */}
                {totalBlogPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 p-4 border-t border-gray-700">
                    <Button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="text-white border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </Button>
                    <span className="text-gray-400 text-sm">
                      Page {currentPage} of {totalBlogPages}
                    </span>
                    <Button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalBlogPages}
                      variant="outline"
                      size="sm"
                      className="text-white border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-300 p-4">No blog posts found.</p>
            )}
          </CardContent>
        </Card>
      </SlideUp>
    </FadeIn>
  );
}

export default DashboardTab;

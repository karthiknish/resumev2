import Link from "next/link";
import { format } from "date-fns";
import {
  AiOutlineFileAdd,
  AiOutlineEdit,
  AiOutlineRobot,
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

function DashboardTab({ blogPosts, isLoading }) {
  return (
    <FadeIn delay={0.2}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 col-span-1 sm:col-span-2 lg:col-span-4 gap-6">
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

        {/* Recent Blog Posts Summary */}
        <SlideUp
          delay={0.6}
          className="col-span-1 sm:col-span-2 lg:col-span-4 mt-8"
        >
          <Card className="glow-card">
            <CardHeader className="bg-black rounded-t-lg">
              <CardTitle className="text-2xl font-medium text-white font-calendas glow-blue">
                Recent Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-900 p-0">
              {isLoading ? (
                <p className="text-gray-300 p-4">Loading blog posts...</p>
              ) : blogPosts && blogPosts.length > 0 ? (
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
                      {blogPosts.slice(0, 5).map((post, index) => (
                        <div key={post._id || index} index={index}>
                          <TableRow className="border-gray-700 hover:bg-gray-800/50">
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
                                  <Link
                                    href={`/admin/blog/edit?id=${post._id}`}
                                  >
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
                                            // We need to update the parent component's state
                                            // This is a prop, so we can't modify it directly
                                            // The parent component should handle refreshing the posts
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
                        </div>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-300 p-4">No blog posts found.</p>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </FadeIn>
  );
}

export default DashboardTab;

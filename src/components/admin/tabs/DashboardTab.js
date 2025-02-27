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
        <StaggerContainer>
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
            <CardContent className="bg-gray-900">
              {isLoading ? (
                <p className="text-gray-300">Loading blog posts...</p>
              ) : blogPosts.length > 0 ? (
                <div className="overflow-x-auto">
                  <StaggerContainer>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700">
                          <TableHead className="text-gray-300">Title</TableHead>
                          <TableHead className="text-gray-300">Date</TableHead>
                          <TableHead className="text-gray-300">
                            Status
                          </TableHead>
                          <TableHead className="text-gray-300">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts.slice(0, 5).map((post, index) => (
                          <StaggerItem key={post._id} index={index}>
                            <TableRow className="border-gray-700">
                              <TableCell className="font-medium text-white">
                                {post.title}
                              </TableCell>
                              <TableCell className="text-gray-300">
                                {format(
                                  new Date(post.createdAt),
                                  "MMM dd, yyyy"
                                )}
                              </TableCell>
                              <TableCell>
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
                              </TableCell>
                              <TableCell>
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
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="text-white border-gray-700 hover:border-gray-600 hover:text-white"
                                  >
                                    <Link
                                      href={`/blog/${post.slug}`}
                                      target="_blank"
                                    >
                                      View
                                    </Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </StaggerItem>
                        ))}
                      </TableBody>
                    </Table>
                  </StaggerContainer>
                </div>
              ) : (
                <p className="text-gray-300">No blog posts found.</p>
              )}
            </CardContent>
          </Card>
        </SlideUp>
      </div>
    </FadeIn>
  );
}

export default DashboardTab;

import Link from "next/link";
import { format } from "date-fns";
import { AiOutlineFileAdd } from "react-icons/ai";
import Calendar from "react-calendar";
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

function CalendarTab({
  selectedDate,
  postsOnSelectedDate,
  blogDates,
  handleDateChange,
}) {
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    // Check if there are any blog posts on this date
    const hasPosts = blogDates.some(
      (postDate) =>
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
    );

    return hasPosts ? (
      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
    ) : null;
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
              Dates with blog posts are marked with a blue dot
            </p>
          </CardHeader>
          <CardContent className="bg-gray-900">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
              className="w-full"
            />
          </CardContent>
        </Card>

        <FadeIn delay={0.4}>
          <Card className="glow-card">
            <CardHeader className="bg-black rounded-t-lg">
              <CardTitle className="text-2xl font-medium text-white font-calendas glow-blue">
                Posts on {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-900">
              {postsOnSelectedDate.length > 0 ? (
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
                              {post.excerpt || "No excerpt available"}
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
                                    href={`/admin/blog/edit?id=${post._id}`}
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
                <p className="text-gray-300">
                  No posts published on this date.
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

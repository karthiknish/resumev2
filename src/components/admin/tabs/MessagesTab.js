import { FaCheckCircle, FaCircle, FaComments, FaServer } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  PulseAnimation,
} from "@/components/animations/MotionComponents";

function MessagesTab({
  chatLogs,
  searchQuery,
  setSearchQuery,
  isLoadingMessages,
  messageError,
  fetchChatMessages,
  unreadCount,
  markAsRead,
  markAllAsRead,
}) {
  // Filter chat logs based on search query
  const filteredChatLogs = chatLogs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      log.user.name.toLowerCase().includes(query) ||
      log.user.email.toLowerCase().includes(query) ||
      log.message.toLowerCase().includes(query)
    );
  });

  return (
    <FadeIn delay={0.2}>
      <div className="space-y-6">
        <Card className="glow-card">
          <CardHeader className="bg-black rounded-t-lg">
            <CardTitle className="text-2xl font-medium text-white font-calendas glow-blue flex items-center justify-between">
              <span>User Messages</span>
              <Badge
                variant="outline"
                className="bg-blue-900 text-blue-300 ml-2"
              >
                {unreadCount} unread
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 bg-gray-900">
            <div className="mb-6">
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Loading state */}
            {isLoadingMessages && (
              <div className="text-center py-10">
                <div className="animate-pulse mb-4">
                  <div className="h-12 w-12 mx-auto rounded-full bg-blue-600 opacity-75"></div>
                </div>
                <h3 className="text-xl text-gray-300 mb-2">
                  Loading messages...
                </h3>
              </div>
            )}

            {/* Error state */}
            {messageError && !isLoadingMessages && (
              <div className="text-center py-10">
                <div className="text-red-500 mb-4 text-5xl">
                  <FaServer className="mx-auto" />
                </div>
                <h3 className="text-xl text-gray-300 mb-2">
                  Error loading messages
                </h3>
                <p className="text-gray-400">{messageError}</p>
                <Button
                  variant="outline"
                  className="mt-4 text-white border-gray-600"
                  onClick={fetchChatMessages}
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Chat messages list */}
            {!isLoadingMessages && !messageError && (
              <StaggerContainer className="space-y-4">
                {filteredChatLogs.length > 0 ? (
                  filteredChatLogs.map((log, index) => (
                    <StaggerItem key={log.id} index={index}>
                      <HoverCard scale={1.01}>
                        <Card
                          className={`bg-gray-800 border ${
                            !log.isRead
                              ? "border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                              : "border-gray-700"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              <Avatar className="h-10 w-10 border-2 border-gray-700">
                                <AvatarImage
                                  src={log.user.avatar}
                                  alt={log.user.name}
                                />
                                <AvatarFallback className="bg-blue-900 text-white">
                                  {log.user.name
                                    .split(" ")
                                    .map((name) => name[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium text-white mb-1">
                                      {log.user.name}
                                    </p>
                                    <p className="text-sm text-blue-300">
                                      {log.user.email}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-300">
                                      {format(log.timestamp, "MMM dd, yyyy")}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {format(log.timestamp, "h:mm a")}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <p className="text-white">{log.message}</p>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                  <div className="flex items-center">
                                    {log.isRead ? (
                                      <span className="text-gray-400 text-sm flex items-center">
                                        <FaCheckCircle className="mr-1" /> Read
                                      </span>
                                    ) : (
                                      <span className="text-blue-400 text-sm flex items-center">
                                        <FaCircle className="mr-1 text-xs" />{" "}
                                        New
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex space-x-2">
                                    {!log.isRead && (
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => markAsRead(log.id)}
                                        className="bg-gray-700 hover:bg-gray-600 text-white"
                                      >
                                        Mark as Read
                                      </Button>
                                    )}
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700 text-white glow-button"
                                    >
                                      Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </HoverCard>
                    </StaggerItem>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <FaComments className="mx-auto text-5xl text-gray-400 mb-4" />
                    <h3 className="text-xl text-white mb-2">
                      No messages found
                    </h3>
                    <p className="text-gray-300">
                      {searchQuery
                        ? "No messages match your search criteria"
                        : "There are no messages to display"}
                    </p>
                  </div>
                )}
              </StaggerContainer>
            )}
          </CardContent>
          <CardFooter className="pt-6 border-t border-gray-700 bg-black rounded-b-lg">
            <div className="w-full flex justify-between">
              <Button
                variant="outline"
                className="text-white border-gray-700 hover:bg-gray-800"
                onClick={markAllAsRead}
                disabled={unreadCount === 0 || isLoadingMessages}
              >
                Mark All as Read
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white glow-button"
                disabled={chatLogs.length === 0 || isLoadingMessages}
              >
                Export Messages
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </FadeIn>
  );
}

export default MessagesTab;

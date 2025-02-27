import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SlideUp,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  MotionDiv,
} from "@/components/animations/MotionComponents";

function ChatHistoryTab({
  chatHistories,
  isLoadingChatHistories,
  chatHistoriesError,
  fetchChatHistories,
}) {
  return (
    <SlideUp delay={0.2}>
      <h2 className="text-2xl font-bold mb-4 text-white">
        Chatbot Conversations
      </h2>

      <Card className="bg-gray-900">
        <CardHeader className="bg-black">
          <CardTitle className="flex items-center justify-between text-white">
            <span>Conversations</span>
            <Button onClick={fetchChatHistories} size="sm">
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingChatHistories ? (
            <div className="text-center p-4 text-white">
              Loading chat histories...
            </div>
          ) : chatHistoriesError ? (
            <div className="text-center text-red-400 p-4">
              {chatHistoriesError}
            </div>
          ) : chatHistories.length === 0 ? (
            <div className="text-center p-4 text-white">
              No chat histories found.
            </div>
          ) : (
            <StaggerContainer className="space-y-6">
              {chatHistories.map((chat, index) => (
                <StaggerItem key={chat._id} index={index}>
                  <HoverCard>
                    <Card className="overflow-hidden bg-gray-800">
                      <CardHeader className="bg-gray-800 p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Avatar>
                              <AvatarFallback className="bg-blue-900 text-white">
                                {chat.email[0]?.toUpperCase() || "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium text-white">
                                {chat.email}
                              </h3>
                              <p className="text-sm text-gray-300">
                                {new Date(chat.lastUpdated).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-white border-blue-700 bg-blue-900"
                          >
                            {chat.device || "Unknown device"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 bg-gray-700">
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {chat.messages.map((msg, index) => (
                            <MotionDiv
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: index * 0.05,
                                duration: 0.3,
                              }}
                              className={`flex ${
                                msg.user === "user"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  msg.user === "user"
                                    ? "bg-blue-900 text-white ml-auto"
                                    : "bg-gray-800 text-white"
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <p className="text-xs text-gray-300 mt-1">
                                  {new Date(msg.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            </MotionDiv>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-800 p-3">
                        <div className="text-sm text-gray-300 w-full flex justify-between">
                          <span>Total messages: {chat.messages.length}</span>
                          <span>Browser: {chat.browser || "Unknown"}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </CardContent>
      </Card>
    </SlideUp>
  );
}

export default ChatHistoryTab;

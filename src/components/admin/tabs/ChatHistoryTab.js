import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Clock, User, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function ChatHistoryTab() {
  const [chatHistories, setChatHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatHistories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/chat-histories");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Failed to fetch chat histories"
          );
        }
        const data = await response.json();
        if (data.success && data.data && Array.isArray(data.data)) {
          setChatHistories(data.data);
        } else {
          setChatHistories([]);
          setError("No chat histories found or invalid response format");
        }
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Could not load chat histories.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatHistories();
  }, []);

  // Helper function to render message content safely
  const renderMessageContent = (msg) => {
    if (Array.isArray(msg.parts) && msg.parts.length > 0) {
      return msg.parts.map((part, partIndex) => (
        <span key={partIndex}>{part?.text ?? ""}</span>
      ));
    } else if (typeof msg.text === "string") {
      return <span>{msg.text}</span>;
    } else if (typeof msg.content === "string") {
      return <span>{msg.content}</span>;
    }
    return (
      <span className="italic text-gray-500">
        [Empty or unreadable message]
      </span>
    );
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Chat History (
          {chatHistories.length})
        </CardTitle>
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
        {!isLoading && !error && chatHistories.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            No chat history found.
          </p>
        )}
        {!isLoading && !error && chatHistories.length > 0 && (
          <Accordion type="single" collapsible className="w-full space-y-2">
            {chatHistories.map((history, index) => (
              <AccordionItem
                key={history._id || index}
                value={`item-${index}`}
                className="border border-gray-700 rounded-md bg-gray-800/50 px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between items-center w-full text-sm">
                    <span className="flex items-center gap-2 font-medium text-gray-300">
                      <User className="w-4 h-4" />{" "}
                      {history.email || "Unknown User"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />{" "}
                      {formatDate(history.timestamp || history.lastUpdated)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-gray-300">
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {history.messages?.map((msg, msgIndex) => {
                      if (!msg) {
                        console.warn(
                          `Skipping null/undefined message at index ${msgIndex} in history ${history._id}`
                        );
                        return null;
                      }
                      const isUser = msg.role === "user";
                      return (
                        <div
                          key={msgIndex}
                          className={`flex ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div // Changed Badge to div for more control
                            className={`max-w-[80%] whitespace-normal text-left px-3 py-1.5 rounded-lg border ${
                              isUser
                                ? "bg-green-600 text-white rounded-br-none border-green-500" // User styles
                                : "bg-gray-700 text-gray-100 rounded-bl-none border-gray-600" // AI styles
                            }`}
                          >
                            {renderMessageContent(msg)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Display metadata if available */}
                  <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500 space-y-1">
                    {history.device && <div>Device: {history.device}</div>}
                    {history.browser && <div>Browser: {history.browser}</div>}
                    {history.ip && <div>IP: {history.ip}</div>}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  MailCheck,
  MailWarning,
  Trash2,
  Search,
  MessageSquare,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function MessagesTab() {
  const [messages, setMessages] = useState([]); // Explicitly initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch messages on mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch messages");
      }
      const data = await response.json();
      if (data.success && data.messages) {
        // Format messages slightly for consistency if needed
        const formattedMessages = data.messages.map((msg) => ({
          id: msg._id, // Use _id as id
          user: {
            name: msg.name || "Anonymous",
            email: msg.email || "No email",
            avatar: msg.avatar || "/avatars/default.png",
          },
          message: msg.message,
          timestamp: new Date(msg.createdAt),
          isRead: msg.isRead || false,
        }));
        setMessages(formattedMessages);
        console.log("Fetched and formatted messages:", formattedMessages); // Add console log
      } else {
        setMessages([]);
        setError("No messages found or invalid response format");
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Could not load messages.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a single message as read/unread
  const toggleReadStatus = async (messageId, currentStatus) => {
    try {
      // Optimistic UI update
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: !currentStatus } : msg
        )
      );

      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update message status");
      }
      // No need to refetch on success due to optimistic update
      toast.success(`Message marked as ${!currentStatus ? "read" : "unread"}.`);
    } catch (error) {
      console.error("Error toggling read status:", error);
      toast.error("Failed to update message status.");
      // Revert optimistic update on error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: currentStatus } : msg
        )
      );
    }
  };

  // Mark all messages as read
  const markAllAsRead = async () => {
    const unreadIds = messages
      .filter((msg) => !msg.isRead)
      .map((msg) => msg.id);
    if (unreadIds.length === 0) {
      toast.info("No unread messages to mark.");
      return;
    }

    try {
      // Optimistic UI update
      setMessages((prev) => prev.map((msg) => ({ ...msg, isRead: true })));

      const response = await fetch(`/api/messages/read-all`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to mark all messages as read");
      }
      toast.success("All messages marked as read.");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all messages as read.");
      // Revert optimistic update
      fetchMessages(); // Refetch to get correct state
    }
  };

  // Placeholder for delete functionality
  const handleDeleteMessage = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    toast.info(`Delete functionality for message ${id} not implemented yet.`);
    // TODO: Implement API call DELETE /api/messages/[id]
    // Example:
    // try {
    //   const response = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    //   if (!response.ok) throw new Error('Failed to delete');
    //   setMessages(prev => prev.filter(m => m.id !== id));
    //   toast.success("Message deleted.");
    // } catch (err) { toast.error("Failed to delete message."); }
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      log.user.name.toLowerCase().includes(query) ||
      log.user.email.toLowerCase().includes(query) ||
      log.message.toLowerCase().includes(query)
    );
  });

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  return (
    <Card className="border-gray-700 bg-gray-900 text-white">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> Messages (
            {filteredMessages.length} / {messages.length})
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} Unread
              </Badge>
            )}
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border-gray-600 pl-8"
              />
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            <Button
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || isLoading}
              size="sm"
              variant="outline"
              className="border-gray-600 hover:bg-gray-700"
            >
              <MailCheck className="mr-2 h-4 w-4" /> Mark all read
            </Button>
          </div>
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
        {!isLoading && !error && messages.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            No messages received yet.
          </p>
        )}
        {!isLoading &&
          !error &&
          filteredMessages.length === 0 &&
          messages.length > 0 && (
            <p className="text-gray-400 text-center py-10">
              No messages match your search.
            </p>
          )}
        {!isLoading && !error && filteredMessages.length > 0 && (
          <div className="space-y-4">
            {filteredMessages.map((msg) => (
              <Card
                key={msg.id}
                className={`border ${
                  msg.isRead
                    ? "border-gray-700 bg-gray-800/50"
                    : "border-blue-500 bg-blue-900/20"
                }`}
              >
                <CardContent className="p-4 flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <Image
                      src={msg.user.avatar}
                      alt={msg.user.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-semibold text-white">
                          {msg.user.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {msg.user.email}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-4">
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-200 mt-2 whitespace-pre-wrap">
                      {msg.message}
                    </p>
                    <div className="flex justify-end space-x-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReadStatus(msg.id, msg.isRead)}
                        className="text-gray-400 hover:text-white"
                      >
                        {msg.isRead ? (
                          <Mail className="mr-1 h-4 w-4" />
                        ) : (
                          <MailWarning className="mr-1 h-4 w-4" />
                        )}
                        {msg.isRead ? "Mark Unread" : "Mark Read"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMessage(msg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

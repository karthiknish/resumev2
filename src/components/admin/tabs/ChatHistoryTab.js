import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Clock, User, MessageSquare, Bot, Sparkles, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { AccordionItemSkeleton } from "@/components/ui/loading-states";
import { EmptyState } from "@/components/ui/empty-state";

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
  const [filteredHistories, setFilteredHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
          // Sort by most recent first
          const sortedHistories = data.data.sort((a, b) => 
            new Date(b.timestamp || b.lastUpdated) - new Date(a.timestamp || a.lastUpdated)
          );
          setChatHistories(sortedHistories);
          setFilteredHistories(sortedHistories);
        } else {
          setChatHistories([]);
          setFilteredHistories([]);
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

  // Filter chat histories based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredHistories(chatHistories);
      return;
    }
    
    const filtered = chatHistories.filter(history => {
      // Search in email
      if (history.email && history.email.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      
      // Search in messages
      if (history.messages && Array.isArray(history.messages)) {
        return history.messages.some(msg => {
          // Check different message formats
          let content = "";
          if (Array.isArray(msg.parts) && msg.parts.length > 0) {
            content = msg.parts.map(part => part?.text ?? "").join("");
          } else if (typeof msg.text === "string") {
            content = msg.text;
          } else if (typeof msg.content === "string") {
            content = msg.content;
          }
          
          return content.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }
      
      return false;
    });
    
    setFilteredHistories(filtered);
  }, [searchTerm, chatHistories]);

  // Helper function to render message content safely
  const renderMessageContent = (msg) => {
    // Handle different message formats
    let content = "";
    
    // Gemini API format
    if (Array.isArray(msg.parts) && msg.parts.length > 0) {
      content = msg.parts.map(part => part?.text ?? "").join("");
    } 
    // Standard text formats
    else if (typeof msg.text === "string") {
      content = msg.text;
    } else if (typeof msg.content === "string") {
      content = msg.content;
    }
    
    // If we have content, render it with proper formatting
    if (content) {
      return (
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {content.split("\n").map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < content.split("\n").length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      );
    }
    
    // Fallback for empty or unreadable messages
    return (
      <span className="italic text-muted-foreground">
        [Empty or unreadable message]
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-card border border-border shadow-sm rounded-2xl">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="flex items-center gap-2 text-lg font-heading font-semibold text-foreground">
            <div className="p-2 bg-muted rounded-full">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            Chat Conversations
            <Badge variant="outline" className="text-xs font-medium text-muted-foreground border-border">
              {chatHistories.length} {chatHistories.length === 1 ? "conversation" : "conversations"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search conversations by email or message"
              className="pl-9 pr-4 py-5 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading && <AccordionItemSkeleton count={5} />}
        {error && !isLoading && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-5">
              <p className="text-sm font-medium text-destructive">Unable to load conversations. {error}</p>
            </div>
          </motion.div>
        )}
        {!isLoading && !error && filteredHistories.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EmptyState
              title={searchTerm ? "No matching conversations" : "No conversations yet"}
              description={
                searchTerm
                  ? `No conversations found matching "${searchTerm}". Try a different search term.`
                  : "Chat conversations will appear here once users start chatting with the AI."
              }
              illustration="inbox"
            />
          </motion.div>
        )}
        {!isLoading && !error && filteredHistories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
              <p>
                Showing {filteredHistories.length} of {chatHistories.length} conversations
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {filteredHistories.map((history, index) => (
                <motion.div
                  key={history._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border border-border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline px-5 py-3 bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex justify-between items-center w-full gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-card border border-border rounded-full shadow-sm">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-foreground text-sm">
                              {history.email || "Anonymous User"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {history.messages?.length || 0} {(history.messages?.length || 0) === 1 ? "message" : "messages"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(history.timestamp || history.lastUpdated)}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5">
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                        {history.messages?.map((msg, msgIndex) => {
                          if (!msg) {
                            console.warn(
                              `Skipping null/undefined message at index ${msgIndex} in history ${history._id}`
                            );
                            return null;
                          }
                          const isUser = msg.role === "user";
                          return (
                            <motion.div
                              key={msgIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: msgIndex * 0.05 }}
                              className={`flex items-start gap-3 ${
                                isUser ? "justify-end" : "justify-start"
                              }`}
                            >
                              {!isUser && (
                                <div className="p-2 bg-muted rounded-full flex-shrink-0">
                                  <Bot className="w-4 h-4 text-primary" />
                                </div>
                              )}
                              <div
                                className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                                  isUser
                                    ? "bg-primary text-white rounded-br-md"
                                    : "bg-muted/50 border border-border text-foreground rounded-bl-md"
                                }`}
                              >
                                {renderMessageContent(msg)}
                                <div className={`text-xs mt-2 ${
                                  isUser ? "text-primary/20" : "text-muted-foreground"
                                }`}>
                                  {formatDate(msg.timestamp)}
                                </div>
                              </div>
                              {isUser && (
                                <div className="p-2 bg-primary rounded-full flex-shrink-0">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                      {/* Display metadata if available */}
                      {(history.device || history.browser || history.ip) && (
                        <div className="mt-4 pt-3 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {history.device && (
                              <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-border">
                                📱 {history.device}
                              </Badge>
                            )}
                            {history.browser && (
                              <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-border">
                                🌐 {history.browser}
                              </Badge>
                            )}
                            {history.ip && (
                              <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground border-border">
                                🌍 {history.ip}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

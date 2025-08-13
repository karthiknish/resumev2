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

  // Filter chat histories based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredChatHistories(chatHistories);
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
    
    setFilteredChatHistories(filtered);
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
      <span className="italic text-gray-500">
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
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-200">
          <CardTitle className="flex items-center gap-3 text-gray-800">
            <div className="p-2 bg-white rounded-full shadow-md">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-bold">Chat Conversations</span>
            <Badge className="bg-purple-600 text-white hover:bg-purple-700">
              {chatHistories.length} {chatHistories.length === 1 ? 'conversation' : 'conversations'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search conversations by email or message content..."
              className="pl-10 pr-4 py-6 bg-white border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading && (
          <motion.div 
            className="flex flex-col justify-center items-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
              <Sparkles className="h-6 w-6 text-purple-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <p className="text-gray-600 font-medium mt-4">Loading chat conversations...</p>
          </motion.div>
        )}
        {error && !isLoading && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="text-red-600 text-5xl mb-4">⚠️</div>
              <p className="text-red-700 font-semibold text-lg mb-2">Unable to Load Conversations</p>
              <p className="text-red-600">{error}</p>
            </div>
          </motion.div>
        )}
        {!isLoading && !error && filteredHistories.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <p className="text-gray-600 font-semibold text-xl mb-2">
                {searchTerm ? "No Matching Conversations" : "No Conversations Yet"}
              </p>
              <p className="text-gray-500">
                {searchTerm 
                  ? `No conversations found matching "${searchTerm}". Try a different search term.` 
                  : "Chat conversations will appear here once users start chatting with the AI."}
              </p>
            </div>
          </motion.div>
        )}
        {!isLoading && !error && filteredHistories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredHistories.length} of {chatHistories.length} conversations
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {filteredHistories.map((history, index) => (
                <motion.div
                  key={history._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="border-2 border-purple-200 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-full shadow-sm">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-800">
                              {history.email || "Anonymous User"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {history.messages?.length || 0} {(history.messages?.length || 0) === 1 ? 'message' : 'messages'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(history.timestamp || history.lastUpdated)}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
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
                                <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full shadow-sm flex-shrink-0">
                                  <Bot className="w-4 h-4 text-purple-600" />
                                </div>
                              )}
                              <div
                                className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                                  isUser
                                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md"
                                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                                }`}
                              >
                                {renderMessageContent(msg)}
                                <div className={`text-xs mt-2 ${
                                  isUser ? "text-purple-100" : "text-gray-500"
                                }`}>
                                  {formatDate(msg.timestamp)}
                                </div>
                              </div>
                              {isUser && (
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-sm flex-shrink-0">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                      {/* Display metadata if available */}
                      {(history.device || history.browser || history.ip) && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            {history.device && (
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-300">
                                📱 {history.device}
                              </Badge>
                            )}
                            {history.browser && (
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-300">
                                🌐 {history.browser}
                              </Badge>
                            )}
                            {history.ip && (
                              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-300">
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

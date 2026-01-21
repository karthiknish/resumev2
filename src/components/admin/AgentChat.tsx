// Converted to TypeScript - migrated
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AgentChatProps {
  messages?: any[];
  onSendMessage?: (message: string) => void | Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
  showTimestamp?: boolean;
  showCopyButton?: boolean;
  maxHeight?: string;
}

const AgentChat: React.FC<AgentChatProps> = ({
  messages = [],
  onSendMessage,
  isLoading = false,
  placeholder = "Type your message...",
  disabled = false,
  showTimestamp = true,
  showCopyButton = true,
  maxHeight = "600px"
}) {
  const [inputValue, setInputValue] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || disabled) return;

    const messageContent = inputValue.trim();
    setInputValue("");

    if (onSendMessage) {
      try {
        await onSendMessage(messageContent);
      } catch (error) {
        toast.error(error.message || "Failed to send message");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (content, messageId) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Messages Area */}
      <div 
        className="flex-grow overflow-y-auto p-6 space-y-4"
        style={{ maxHeight }}
      >
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <div className="p-4 bg-muted rounded-full mb-4">
              <Bot className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Start a conversation by typing a message below
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const messageContent =
                typeof msg.content === "string"
                  ? msg.content
                  : JSON.stringify(msg.content);

              return (
                <motion.div
                  key={msg.id || index}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`p-2 rounded-full flex-shrink-0 ${
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {isUser ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col max-w-[75%]">
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted border border-border text-foreground rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                        {messageContent}
                      </div>

                      {/* Actions */}
                      {showCopyButton && messageContent && (
                        <div className={`flex items-center gap-2 mt-2 ${
                          isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          <button
                            onClick={() =>
                              handleCopyMessage(messageContent, msg.id || index)
                            }
                            className={`text-xs hover:opacity-80 transition-opacity flex items-center gap-1 ${
                              isUser ? "hover:text-primary-foreground" : "hover:text-foreground"
                            }`}
                            title="Copy message"
                          >
                            {copiedMessageId === (msg.id || index) ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    {showTimestamp && msg.timestamp && (
                      <span
                        className={`text-xs mt-1 ${
                          isUser
                            ? "text-right text-muted-foreground"
                            : "text-left text-muted-foreground"
                        }`}
                      >
                        {formatDate(msg.timestamp)}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3"
              >
                <div className="p-2 bg-muted rounded-full flex-shrink-0">
                  <Bot className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-muted border border-border">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </motion.div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading || disabled}
              className="pr-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all resize-none"
              style={{ minHeight: "44px" }}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || disabled}
            size="icon"
            className="shrink-0 h-11 w-11"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default AgentChat;


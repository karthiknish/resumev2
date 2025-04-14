import React, { useState, useEffect, useRef } from "react";
import { BiSend, BiMessageSquareDots, BiX, BiUserCircle } from "react-icons/bi"; // Added BiUserCircle
import { FaEnvelope, FaCheck } from "react-icons/fa"; // Added FaCheck
import Modal from "react-modal";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Loader2 } from "lucide-react";

// Only initialize Modal in browser environment
if (typeof window !== "undefined") {
  Modal.setAppElement("#__next");
}

// Simple date formatter
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Chatbot() {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [isCollectingEmail, setIsCollectingEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Scroll lock effect
  useEffect(() => {
    if (!isBrowser) return;

    const body = document.body;
    const isMobile = window.innerWidth < 768;

    if (isOpen && isMobile) {
      const originalStyle = window.getComputedStyle(body).overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = originalStyle;
      };
    } else {
      body.style.overflow = "";
    }
  }, [isOpen, isBrowser]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleWelcomeMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleWelcomeMessage = () => {
    // Friendlier welcome, explains email purpose
    const welcomeMsg = isCollectingEmail
      ? "Hello! I'm Cline, Karthik's AI assistant. To save our chat and follow up if needed, could you please share your email?"
      : `Thanks! I've got your email. How can I help you today?`; // This case might not be hit if email is always collected first
    setMessages([
      {
        role: "assistant",
        content: welcomeMsg,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const storeChatHistory = (currentMessages, email = userEmail) => {
    try {
      if (typeof window !== "undefined") {
        const chatHistory = JSON.parse(
          localStorage.getItem("chatHistory") || "{}"
        );
        chatHistory[email] = {
          messages: currentMessages,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      }
      if (email) {
        fetch("/api/save-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, messages: currentMessages }),
        }).catch((error) =>
          console.error("Error saving chat to server:", error)
        );
      }
    } catch (error) {
      console.error("Error storing chat history:", error);
    }
  };

  const handleEmailSubmit = () => {
    if (!isValidEmail(message)) {
      const errorMsg = {
        role: "assistant",
        content:
          "That doesn't look like a valid email. Please provide a valid email address.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [
        ...prev,
        { role: "user", content: message, timestamp: new Date().toISOString() },
        errorMsg,
      ]);
      setMessage("");
      return;
    }
    const email = message;
    setUserEmail(email);
    setIsCollectingEmail(false);
    const userMsg = {
      role: "user",
      content: email,
      timestamp: new Date().toISOString(),
    };
    // Slightly friendlier welcome after email
    const botWelcome = {
      role: "assistant",
      content: `Great, thanks ${email}! How can I assist you today? Feel free to ask about Karthik's services, projects, or blog posts.`,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, userMsg, botWelcome];
    setMessages(updatedMessages);
    setMessage("");
    storeChatHistory(updatedMessages, email); // Store history with the provided email
  };

  // Keep generateHelpfulResponse as is for now
  const generateHelpfulResponse = (content) => {
    const lowerContent = content.toLowerCase();
    if (
      lowerContent.includes("slow") ||
      lowerContent.includes("loading") ||
      lowerContent.includes("performance") ||
      lowerContent.includes("speed") ||
      lowerContent.includes("laggy") ||
      lowerContent.includes("takes time")
    ) {
      if (
        lowerContent.includes("home") ||
        lowerContent.includes("main page") ||
        lowerContent.includes("landing")
      ) {
        return `I understand the home page is loading slowly for you. This could be due to several factors:\n\n1. **Image Optimization** - Large images might be slowing down the page.\n2. **Too Many Components** - The home page may have many heavy components loading at once.\n3. **Network Issues** - Your connection might be affecting load times.\n\nI can help connect you with Karthik to address these performance issues. Would you like to [contact Karthik](/contact) about optimizing your website, or would you prefer some general advice on improving web performance?`;
      }
      return `I notice you're experiencing performance issues. This could be due to several factors:\n\n1. **Image Sizes** - Unoptimized images can significantly slow down websites\n2. **JavaScript Loading** - Too many scripts loading synchronously\n3. **Server Response Time** - Hosting service performance varies\n4. **Third-party Services** - Analytics, ads, or other third-party scripts\n\nKarthik specializes in optimizing website performance. Would you like to [contact him](/contact) for a performance audit?`;
    }
    return null;
  };

  const sendMessage = async (content) => {
    if (!content.trim()) return;
    const userMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);

    try {
      const helpfulResponse = generateHelpfulResponse(content);
      let botResponseContent;

      if (helpfulResponse) {
        botResponseContent = helpfulResponse;
      } else {
        const apiResponse = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: content,
            chatHistory: messages.map((msg) => ({
              role: msg.role === "user" ? "user" : "model",
              parts: [{ text: msg.content || "" }],
            })),
          }),
        });
        if (!apiResponse.ok)
          throw new Error(`API error: ${apiResponse.status}`);
        const data = await apiResponse.json();
        botResponseContent =
          data.response || "Sorry, I couldn't process that. Please try again.";
      }

      const botMessage = {
        role: "assistant",
        content: botResponseContent,
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...newMessages, botMessage];
      setMessages(updatedMessages);
      storeChatHistory(updatedMessages); // Uses userEmail state set previously
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      const errorMsg = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      storeChatHistory([...newMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!message.trim()) return;
    if (isCollectingEmail) handleEmailSubmit();
    else sendMessage(message);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderMessageContent = (msg) => {
    const content = msg.content || "";
    if (typeof content !== "string") {
      console.warn("Received non-string message content:", msg);
      return (
        <span className="italic text-gray-500">[Invalid message format]</span>
      );
    }
    // Simple check for markdown characters
    const looksLikeMarkdown = /[*_\[#]/.test(content);

    if (looksLikeMarkdown && msg.role === "assistant") {
      return (
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a
                className="text-blue-300 underline hover:text-blue-100"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            ),
            // Add other components if needed (e.g., for lists, code blocks)
          }}
        >
          {content}
        </ReactMarkdown>
      );
    } else {
      // Render plain text, preserving line breaks
      return content.split("\n").map((line, i, arr) => (
        <React.Fragment key={i}>
          {line}
          {i < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    }
  };

  if (!isBrowser) return null;

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: "100vh", scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: "100vh", scale: 0.9 },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <>
      {/* Chat button - Slightly larger, softer shadow */}
      <button
        className={`fixed z-[1100] right-5 p-3.5 rounded-full bg-blue-600 text-white flex items-center shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black ${
          // Adjust bottom only for mobile overlap prevention when open
          isOpen ? "bottom-[70px] md:bottom-5" : "bottom-5"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <BiX className="text-3xl" />
            ) : (
              <BiMessageSquareDots className="text-3xl" />
            )}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            // Use fixed positioning, apply responsive styles for placement/size
            className="fixed inset-0 z-[1000] flex flex-col bg-gray-900 shadow-2xl border border-gray-700/50
                       md:inset-auto md:bottom-20 md:right-5 md:w-[375px] md:max-h-[70vh] md:h-auto md:rounded-xl md:overflow-hidden"
          >
            {/* Chat header - Added subtle gradient */}
            <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 flex-shrink-0">
              <h3 className="text-white font-semibold text-lg">
                Chat Assistant
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <BiX size={24} />
              </button>
            </div>

            {/* Chat messages area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    // Added gap and items-end
                    msg.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Bot Avatar */}
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mb-1">
                      {/* Placeholder Icon - Replace with Image if desired */}
                      <BiUserCircle className="text-gray-300 w-4 h-4" />
                    </div>
                  )}

                  <motion.div
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{
                      delay: 0.1 + index * 0.05,
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    className={`max-w-[85%] px-4 py-2 rounded-lg shadow-md text-sm md:text-base border ${
                      msg.role === "assistant"
                        ? "bg-gray-700 text-gray-100 rounded-bl-none border-gray-600"
                        : "bg-green-600 text-white rounded-br-none border-green-500"
                    }`}
                  >
                    {renderMessageContent(msg)}
                    <span className="block text-xs opacity-60 mt-1 text-right">
                      {formatDate(msg.timestamp)}
                    </span>
                  </motion.div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  {/* Bot Avatar for loading */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center mr-2 mb-1">
                    <BiUserCircle className="text-gray-300 w-4 h-4" />
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-700 text-white max-w-[85%] px-4 py-2 rounded-lg shadow-md rounded-bl-none border border-gray-600"
                  >
                    <div className="flex space-x-1.5 items-center h-5">
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </motion.div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input area */}
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-700 p-3 bg-gray-800 flex-shrink-0" // Removed flex items-center gap-2 here
            >
              {/* Added descriptive text for email collection */}
              {isCollectingEmail && (
                <p className="text-xs text-gray-400 mb-1.5 px-1">
                  Please enter your email to continue:
                </p>
              )}
              <div className="flex items-center gap-2">
                {" "}
                {/* Added inner flex container */}
                {isCollectingEmail ? (
                  <>
                    <FaEnvelope className="text-gray-400 flex-shrink-0" />
                    <Input
                      className="flex-grow bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="your.email@example.com" // More specific placeholder
                      type="email"
                      required
                      aria-label="Enter your email"
                    />
                  </>
                ) : (
                  <Input
                    className="flex-grow bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    aria-label="Type your message"
                  />
                )}
                <Button
                  type="submit"
                  size="icon"
                  className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-shrink-0"
                  disabled={!message.trim() || isLoading}
                  aria-label={
                    isCollectingEmail ? "Submit email" : "Send message"
                  }
                >
                  {/* Conditional Icon */}
                  {isCollectingEmail ? (
                    <FaCheck className="w-5 h-5" />
                  ) : (
                    <BiSend className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;

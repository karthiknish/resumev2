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
      {/* Chat button - Modern vibrant design */}
      <motion.button
        className={`fixed z-[1100] right-6 p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300 ${
          // Adjust bottom only for mobile overlap prevention when open
          isOpen ? "bottom-[80px] md:bottom-6" : "bottom-6"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 10px 30px rgba(147, 51, 234, 0.3)",
            "0 15px 40px rgba(59, 130, 246, 0.4)",
            "0 10px 30px rgba(147, 51, 234, 0.3)"
          ]
        }}
        transition={{
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
            className="flex items-center gap-2"
          >
            {isOpen ? (
              <BiX className="text-3xl" />
            ) : (
              <>
                <BiMessageSquareDots className="text-3xl" />
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-xl ml-1"
                >
                  ✨
                </motion.span>
              </>
            )}
          </motion.div>
        </AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute -top-12 right-0 bg-white text-gray-800 px-3 py-2 rounded-2xl shadow-lg text-sm font-medium border-2 border-purple-200 whitespace-nowrap"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ delay: 1, duration: 0.3 }}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              Chat with me!
            </span>
            <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-r-2 border-b-2 border-purple-200 transform rotate-45"></div>
          </motion.div>
        )}
      </motion.button>

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
            className="fixed inset-0 z-[1000] flex flex-col bg-white/95 backdrop-blur-xl shadow-2xl border-2 border-purple-200
                       md:inset-auto md:bottom-24 md:right-6 md:w-[400px] md:max-h-[70vh] md:h-auto md:rounded-3xl md:overflow-hidden"
          >
            {/* Chat header - Modern vibrant design */}
            <motion.div
              className="flex justify-between items-center p-6 border-b-2 border-purple-200 bg-gradient-to-r from-purple-600 to-blue-600 flex-shrink-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-2xl">🤖</span>
                </motion.div>
                <div>
                  <h3 className="text-white font-black text-xl" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Cline AI
                  </h3>
                  <p className="text-purple-100 text-sm font-medium">
                    Karthik's Assistant
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all duration-300"
                aria-label="Close chat"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <BiX size={24} />
              </motion.button>
            </motion.div>

            {/* Chat messages area */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6 bg-gradient-to-br from-purple-50/50 via-white/50 to-blue-50/50 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
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
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-1 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        rotate: {
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      <span className="text-xl">🤖</span>
                    </motion.div>
                  )}
                  
                  {/* User Avatar */}
                  {msg.role === "user" && (
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-1 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-xl">👤</span>
                    </motion.div>
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
                    className={`max-w-[85%] px-6 py-4 rounded-3xl shadow-xl text-base border-2 ${
                      msg.role === "assistant"
                        ? "bg-white/90 backdrop-blur-sm text-gray-800 rounded-bl-xl border-purple-200"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-xl border-purple-400"
                    }`}
                  >
                    {renderMessageContent(msg)}
                    <motion.span
                      className={`block text-xs mt-2 text-right font-medium ${
                        msg.role === "assistant" ? "text-gray-500" : "text-purple-200"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      transition={{ delay: 0.5 }}
                    >
                      {formatDate(msg.timestamp)}
                    </motion.span>
                  </motion.div>
                </div>
              ))}
              {isLoading && (
                <motion.div
                  className="flex justify-start items-end gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Bot Avatar for loading */}
                  <motion.div
                    className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mb-1 shadow-lg"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <span className="text-xl">🤖</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-sm text-gray-800 max-w-[85%] px-6 py-4 rounded-3xl rounded-bl-xl shadow-xl border-2 border-purple-200"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🤔</span>
                      <span className="font-medium">Thinking...</span>
                    </div>
                    <div className="flex space-x-2 items-center mt-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-purple-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-blue-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.3
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-purple-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.6
                        }}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input area */}
            <motion.form
              onSubmit={handleSubmit}
              className="border-t-2 border-purple-200 p-6 bg-white/90 backdrop-blur-sm flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Added descriptive text for email collection */}
              {isCollectingEmail && (
                <motion.div
                  className="mb-4 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl border-2 border-purple-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
                    <span className="text-lg">📧</span>
                    Please enter your email to continue:
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    This helps me save our conversation and follow up if needed
                  </p>
                </motion.div>
              )}
              <div className="flex items-center gap-4">
                {isCollectingEmail ? (
                  <>
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        rotate: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      <FaEnvelope className="text-white text-lg" />
                    </motion.div>
                    <Input
                      className="flex-grow bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 text-gray-800 placeholder-gray-500 font-medium rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="your.email@example.com"
                      type="email"
                      required
                      aria-label="Enter your email"
                    />
                  </>
                ) : (
                  <>
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <span className="text-xl">💬</span>
                    </motion.div>
                    <Input
                      className="flex-grow bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 text-gray-800 placeholder-gray-500 font-medium rounded-2xl px-6 py-4 text-lg focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      aria-label="Type your message"
                    />
                  </>
                )}
                <motion.button
                  type="submit"
                  className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                  disabled={!message.trim() || isLoading}
                  aria-label={
                    isCollectingEmail ? "Submit email" : "Send message"
                  }
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : isCollectingEmail ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <FaCheck className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <BiSend className="w-6 h-6" />
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;

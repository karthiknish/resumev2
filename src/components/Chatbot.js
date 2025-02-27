import { useState, useEffect, useRef } from "react";
import { BiSend, BiMessageSquareDots, BiX } from "react-icons/bi";
import { FaEnvelope } from "react-icons/fa";
import Modal from "react-modal";
Modal.setAppElement("#__next");

function Chatbot() {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [isCollectingEmail, setIsCollectingEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Display welcome message when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      handleWelcomeMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Handle the welcome message based on email collection state
  const handleWelcomeMessage = () => {
    if (isCollectingEmail) {
      setMessages([
        {
          user: "bot",
          content:
            "Hi there! Before we start, could you please provide your email so I can better assist you?",
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setMessages([
        {
          user: "bot",
          content: `Thanks for your email ${userEmail}! How can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  // Handle email submission
  const handleEmailSubmit = () => {
    if (!isValidEmail(message)) {
      setMessages([
        ...messages,
        {
          user: "user",
          content: message,
          timestamp: new Date().toISOString(),
        },
        {
          user: "bot",
          content:
            "That doesn't look like a valid email. Please provide a valid email address.",
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");
      return;
    }

    // Save the email and update the state
    setUserEmail(message);
    setIsCollectingEmail(false);

    // Record this in the chatHistory
    const updatedMessages = [
      ...messages,
      {
        user: "user",
        content: message,
        timestamp: new Date().toISOString(),
      },
      {
        user: "bot",
        content: `Thanks for your email ${message}! How can I help you today?`,
        timestamp: new Date().toISOString(),
      },
    ];

    setMessages(updatedMessages);
    setMessage("");

    // Store chat in localStorage and send to API
    storeChatHistory(updatedMessages, message);
  };

  // Validate email format
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Store chat history in localStorage and send to API
  const storeChatHistory = (messages, email = userEmail) => {
    try {
      // Save to localStorage
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};
      chatHistory[email] = {
        messages,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));

      // Save to server if we have an email
      if (email) {
        fetch("/api/save-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, messages }),
        }).catch((error) => {
          console.error("Error saving chat to server:", error);
        });
      }
    } catch (error) {
      console.error("Error storing chat history:", error);
    }
  };

  // Handle sending a message using Gemini API
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    // Add user message to chat
    const newMessages = [
      ...messages,
      {
        user: "user",
        content,
        timestamp: new Date().toISOString(),
      },
    ];
    setMessages(newMessages);
    setMessage("");
    setIsLoading(true);

    try {
      // Call Gemini API
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: content,
          chatHistory: messages.map((msg) => ({
            role: msg.user === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Add bot response to chat
      const updatedMessages = [
        ...newMessages,
        {
          user: "bot",
          content:
            data.response ||
            "Sorry, I couldn't process your request. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ];

      setMessages(updatedMessages);

      // Store updated chat in localStorage
      storeChatHistory(updatedMessages);
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);

      // Add error message to chat
      const errorMessages = [
        ...newMessages,
        {
          user: "bot",
          content:
            "Sorry, I encountered an error processing your request. Please try again later.",
          timestamp: new Date().toISOString(),
        },
      ];

      setMessages(errorMessages);
      storeChatHistory(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle message submission
  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!message.trim()) return;

    if (isCollectingEmail) {
      handleEmailSubmit();
    } else {
      sendMessage(message);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed z-30 bottom-5 right-5">
      {/* Chat button */}
      <button
        className="p-4 rounded-full bg-blue-600 text-white flex items-center shadow-lg hover:bg-blue-700 transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <BiMessageSquareDots className="text-3xl" />
      </button>

      {/* Chat modal */}
      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Chat Assistant"
        className="chat-modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
          },
          content: {
            top: "auto",
            left: "auto",
            right: "20px",
            bottom: "80px",
            width: "350px",
            height: "500px",
            borderRadius: "12px",
            padding: 0,
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
          },
        }}
      >
        {/* Chat header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-700 bg-gray-800 rounded-t-lg">
          <h3 className="text-white font-medium">Chat Assistant</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close chat"
          >
            <BiX size={24} />
          </button>
        </div>

        {/* Chat messages */}
        <div className="p-4 overflow-auto h-[calc(100%-110px)] bg-gray-900">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.user === "bot" ? "justify-start" : "justify-end"
              } mb-3`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.user === "bot"
                    ? "bg-gray-700 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="bg-gray-700 text-white max-w-[80%] p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Chat input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-700 p-3 bg-gray-800 rounded-b-lg flex"
        >
          {isCollectingEmail ? (
            <>
              <div className="flex items-center mr-2 text-gray-400">
                <FaEnvelope />
              </div>
              <input
                className="flex-grow p-2 rounded-md bg-gray-700 text-white text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your email address..."
                type="email"
                required
              />
            </>
          ) : (
            <input
              className="flex-grow p-2 rounded-md bg-gray-700 text-white text-sm border border-gray-600 focus:border-blue-500 focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
          )}
          <button
            type="submit"
            className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={!message.trim() || isLoading}
          >
            <BiSend />
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Chatbot;

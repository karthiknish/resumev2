import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  FaLock,
  FaEye,
  FaDownload,
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
  FaDesktop,
  FaMobileAlt,
} from "react-icons/fa";

export default function ChatLogs() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [chatData, setChatData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 25,
    pages: 0,
  });
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle authentication
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real application, use an actual secure authentication flow
    // This is just a simple placeholder for demonstration
    if (
      password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      password === "admin123"
    ) {
      setIsAuthorized(true);
      setError("");
      fetchChatData();
    } else {
      setError("Invalid password");
    }
  };

  // Fetch the chat data
  const fetchChatData = async (page = 1, email = "") => {
    setLoading(true);
    setError("");
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", pagination.limit);
      if (email) {
        params.append("email", email);
      }

      const response = await fetch(`/api/get-chat-logs?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // In a real app, include a more secure authentication token
          Authorization: `Bearer ${password}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat logs");
      }

      const data = await response.json();
      setChatData(data.chatLogs || []);
      setPagination(
        data.pagination || {
          total: data.chatLogs?.length || 0,
          page: 1,
          limit: 25,
          pages: 1,
        }
      );
      setSelectedChat(null);
    } catch (error) {
      console.error("Error fetching chat data:", error);
      setError("Failed to load chat logs");
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchChatData(newPage, emailFilter);
  };

  // Handle email filter
  const handleEmailFilterSubmit = (e) => {
    e.preventDefault();
    fetchChatData(1, emailFilter);
  };

  // Filter chats based on search term (client-side filtering of fetched data)
  const filteredChats = chatData.filter((chat) =>
    searchTerm
      ? chat.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.messages.some((msg) =>
          msg.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true
  );

  // Export chat logs as JSON
  const exportChatLogs = () => {
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = `chat-logs-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Render login page if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Head>
          <title>Admin Login - Chat Logs</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex justify-center mb-6">
            <FaLock className="text-blue-500 text-4xl" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Admin Login
          </h1>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main admin interface
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Admin - Chat Logs</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chat Logs</h1>
          <div className="flex gap-4">
            {isClient && (
              <button
                onClick={() => router.push("/admin")}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
              >
                Back to Admin
              </button>
            )}
            <button
              onClick={exportChatLogs}
              className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded flex items-center gap-2 transition"
            >
              <FaDownload /> Export Logs
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow p-4 mb-4">
              {/* Email filter form */}
              <form onSubmit={handleEmailFilterSubmit} className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Filter by email..."
                      value={emailFilter}
                      onChange={(e) => setEmailFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                    <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
                  >
                    Filter
                  </button>
                </div>
              </form>

              {/* Search within results */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search within results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-400">
                  {filteredChats.length} of {pagination.total} conversations
                </div>
                {loading && (
                  <div className="text-sm text-blue-400">Loading...</div>
                )}
              </div>

              {/* Chat list */}
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {filteredChats.length > 0 ? (
                  filteredChats.map((chat, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedChat === index
                          ? "bg-blue-900/50 border border-blue-500"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => setSelectedChat(index)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FaUser className="text-blue-400" />
                        <span className="font-medium">{chat.email}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400 mb-2">
                        <FaCalendarAlt className="mr-1" />
                        {new Date(chat.timestamp).toLocaleString()}
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-gray-300">
                          {chat.messages.length} messages
                        </div>
                        {chat.device && (
                          <div className="text-xs text-gray-400 flex items-center">
                            {chat.device.includes("Mobile") ||
                            chat.device === "iOS" ||
                            chat.device === "Android" ? (
                              <FaMobileAlt className="mr-1" />
                            ) : (
                              <FaDesktop className="mr-1" />
                            )}
                            {chat.device}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    {loading ? "Loading..." : "No chat logs found"}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-4 flex items-center justify-center">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                    className={`p-2 rounded-l-md ${
                      pagination.page === 1 || loading
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    <FaChevronLeft />
                  </button>
                  <div className="px-4 py-2 bg-gray-800 text-white">
                    Page {pagination.page} of {pagination.pages}
                  </div>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages || loading}
                    className={`p-2 rounded-r-md ${
                      pagination.page === pagination.pages || loading
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg shadow p-4 h-[80vh] flex flex-col">
              {selectedChat !== null && filteredChats[selectedChat] ? (
                <>
                  <div className="border-b border-gray-700 pb-3 mb-4">
                    <h2 className="text-xl font-bold mb-1">
                      Conversation with {filteredChats[selectedChat].email}
                    </h2>
                    <div className="text-sm text-gray-400 flex flex-wrap gap-x-4">
                      <span>
                        {new Date(
                          filteredChats[selectedChat].timestamp
                        ).toLocaleString()}
                      </span>
                      {filteredChats[selectedChat].device && (
                        <span>
                          Device: {filteredChats[selectedChat].device}
                        </span>
                      )}
                      {filteredChats[selectedChat].browser && (
                        <span>
                          Browser: {filteredChats[selectedChat].browser}
                        </span>
                      )}
                      {filteredChats[selectedChat].ip && (
                        <span>IP: {filteredChats[selectedChat].ip}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-grow overflow-y-auto pr-2">
                    {filteredChats[selectedChat].messages.map((msg, idx) => (
                      <div key={idx} className="mb-4">
                        <div
                          className={`flex ${
                            msg.user === "bot" ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] p-3 rounded-lg ${
                              msg.user === "bot"
                                ? "bg-gray-700 text-white"
                                : "bg-blue-700 text-white"
                            }`}
                          >
                            <p className="mb-1">{msg.content}</p>
                            <div className="text-xs opacity-75 text-right">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <FaEye className="text-5xl mb-4 mx-auto opacity-30" />
                    <p>Select a conversation to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

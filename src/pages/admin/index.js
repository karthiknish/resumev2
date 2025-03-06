import { useEffect, useState } from "react";
import { AiOutlineDashboard, AiOutlineCalendar } from "react-icons/ai";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import "react-calendar/dist/Calendar.css";
import { FaComments } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence } from "framer-motion";
import {
  FadeIn,
  SlideInLeft,
  SlideUp,
  PageTransition,
} from "@/components/animations/MotionComponents";
import PageContainer from "@/components/PageContainer";
// Import extracted components
import DigitalClock from "@/components/admin/ui/DigitalClock";
import EmptyPage from "@/components/admin/ui/EmptyPage";
import DashboardTab from "@/components/admin/tabs/DashboardTab";
import CalendarTab from "@/components/admin/tabs/CalendarTab";
import ChatHistoryTab from "@/components/admin/tabs/ChatHistoryTab";

// Mock chat data for demonstration

function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [blogDates, setBlogDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [postsOnSelectedDate, setPostsOnSelectedDate] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionDebug, setSessionDebug] = useState(null);
  const [chatLogs, setChatLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [chatHistories, setChatHistories] = useState([]);
  const [isLoadingChatHistories, setIsLoadingChatHistories] = useState(false);
  const [chatHistoriesError, setChatHistoriesError] = useState(null);

  // Check for admin role in different formats when session changes
  useEffect(() => {
    if (session && session.user) {
      // Log session info for debugging
      console.log("Session user:", session.user);

      // Store session data for debugging
      setSessionDebug({
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        isAdmin: session.user.isAdmin,
        id: session.user.id,
        allUserProps: Object.keys(session.user),
        fullSession: session,
      });

      // Check various possible admin indicators
      const isUserAdmin =
        session.user.role === "admin" ||
        session.user.role === "ADMIN" ||
        session.user.isAdmin === true ||
        session.user.admin === true ||
        session.user.userRole === "admin" ||
        (session.user.permissions &&
          session.user.permissions.includes("admin")) ||
        // Check if email matches the admin email from environment variable
        session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      console.log("Is user admin?", isUserAdmin);
      console.log("Admin check conditions:", {
        roleIsAdmin: session.user.role === "admin",
        roleIsADMIN: session.user.role === "ADMIN",
        isAdminProperty: session.user.isAdmin === true,
        adminProperty: session.user.admin === true,
        userRoleProperty: session.user.userRole === "admin",
        hasAdminPermission:
          session.user.permissions &&
          session.user.permissions.includes("admin"),
        emailMatchesAdmin:
          session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        adminEmailEnvVar: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      });

      setIsAdmin(isUserAdmin);
    }
  }, [session]);

  // Handle redirect when not authenticated (client-side only)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Load blog data when component mounts and user is admin
  useEffect(() => {
    if (isAdmin) {
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/blog");
      const data = await response.json();

      if (data.success && data.data) {
        setBlogPosts(data.data);

        // Extract dates for the calendar
        const dates = data.data.map((post) => new Date(post.createdAt));
        setBlogDates(dates);

        // Set posts for the selected date (today)
        const today = new Date();
        const postsToday = data.data.filter((post) => {
          const postDate = new Date(post.createdAt);
          return (
            postDate.getDate() === today.getDate() &&
            postDate.getMonth() === today.getMonth() &&
            postDate.getFullYear() === today.getFullYear()
          );
        });
        setPostsOnSelectedDate(postsToday);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const postsOnDate = blogPosts.filter((post) => {
      const postDate = new Date(post.createdAt);
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      );
    });
    setPostsOnSelectedDate(postsOnDate);
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    // Check if there are any blog posts on this date
    const hasPosts = blogDates.some(
      (postDate) =>
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
    );

    return hasPosts ? (
      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
    ) : null;
  };

  // Load chat messages when tab changes to messages or on mount if active tab is messages
  useEffect(() => {
    if (isAdmin && (activeTab === "messages" || chatLogs.length === 0)) {
      fetchChatMessages();
    }
  }, [isAdmin, activeTab]);

  // Fetch chat messages from MongoDB
  const fetchChatMessages = async () => {
    try {
      setIsLoadingMessages(true);
      setMessageError(null);

      const response = await fetch("/api/messages");

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.messages) {
        // Transform data if needed to match the expected format
        const formattedMessages = data.messages.map((msg) => ({
          id: msg._id,
          user: {
            name: msg.name || "Anonymous",
            email: msg.email || "No email provided",
            avatar: msg.avatar || `/avatars/default.png`,
          },
          message: msg.message,
          timestamp: new Date(msg.createdAt),
          isRead: msg.isRead || false,
        }));

        setChatLogs(formattedMessages);
      } else {
        setChatLogs([]);
        setMessageError("No messages found or invalid response format");
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      setMessageError(error.message);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Function to handle marking a message as read
  const markAsRead = async (messageId) => {
    try {
      // Optimistically update UI
      setChatLogs((prevLogs) =>
        prevLogs.map((log) =>
          log.id === messageId ? { ...log, isRead: true } : log
        )
      );

      // Send update to server
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to update message status");
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
      // Revert the optimistic update
      fetchChatMessages();
    }
  };

  // Mark all messages as read
  const markAllAsRead = async () => {
    try {
      // Optimistically update UI
      setChatLogs((prevLogs) =>
        prevLogs.map((log) => ({ ...log, isRead: true }))
      );

      // Send update to server
      const response = await fetch(`/api/messages/read-all`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update message status");
      }
    } catch (error) {
      console.error("Error marking all messages as read:", error);
      // Revert the optimistic update
      fetchChatMessages();
    }
  };

  // Filter chat logs based on search query
  const filteredChatLogs = chatLogs.filter((log) => {
    const query = searchQuery.toLowerCase();
    return (
      log.user.name.toLowerCase().includes(query) ||
      log.user.email.toLowerCase().includes(query) ||
      log.message.toLowerCase().includes(query)
    );
  });

  // Count unread messages
  const unreadCount = chatLogs.filter((log) => !log.isRead).length;

  // Fetch chat histories from MongoDB
  const fetchChatHistories = async () => {
    try {
      setIsLoadingChatHistories(true);
      setChatHistoriesError(null);

      const response = await fetch("/api/chat-histories");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch chat histories: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success && data.chatHistories) {
        setChatHistories(data.chatHistories);
      } else {
        setChatHistories([]);
        setChatHistoriesError(
          "No chat histories found or invalid response format"
        );
      }
    } catch (error) {
      console.error("Error fetching chat histories:", error);
      setChatHistoriesError(error.message);
    } finally {
      setIsLoadingChatHistories(false);
    }
  };

  // Load chat histories when tab changes to chat-history or on mount if active tab is chat-history
  useEffect(() => {
    if (
      isAdmin &&
      (activeTab === "chat-history" || chatHistories.length === 0)
    ) {
      fetchChatHistories();
    }
  }, [isAdmin, activeTab]);

  // If no session exists, show a loading message
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, show a message (the redirect happens in useEffect)
  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to sign in...</div>
      </div>
    );
  }

  // Show debug information for logged-in users who aren't being recognized as admin
  if (!isAdmin) {
    return <EmptyPage sessionDebug={sessionDebug} />;
  }

  // Otherwise, show the admin dashboard
  return (
    <PageTransition>
      <div className="admin-dashboard min-h-screen bg-black text-white">
        <Head>
          <title>Admin Dashboard</title>
          <style jsx global>{`
            .react-calendar {
              width: 100%;
              max-width: 100%;
              background: #1f2937;
              color: white;
              border-radius: 8px;
              border: 1px solid #374151;
              font-family: "Calendas", Arial, sans-serif;
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
            }
            .react-calendar__tile {
              padding: 10px;
              color: white;
            }
            .react-calendar__tile:enabled:hover,
            .react-calendar__tile:enabled:focus {
              background-color: #374151;
              border-radius: 6px;
            }
            .react-calendar__tile--active {
              background: #3b82f6 !important;
              border-radius: 6px;
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            }
            .react-calendar__navigation button:enabled:hover,
            .react-calendar__navigation button:enabled:focus {
              background-color: #374151;
              border-radius: 6px;
            }
            .react-calendar__month-view__weekdays__weekday {
              color: #9ca3af;
            }
            .react-calendar__navigation button {
              color: white;
            }

            /* Glow effects */
            .glow-card {
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
              transition: box-shadow 0.3s ease;
            }
            .glow-card:hover {
              box-shadow: 0 0 25px rgba(59, 130, 246, 0.5);
            }
            .glow-blue {
              text-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
            }
            .glow-button {
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
              transition: box-shadow 0.3s ease;
            }
            .glow-button:hover {
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.6);
            }
          `}</style>
        </Head>

        <PageContainer>
          <SlideInLeft delay={0.2}>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-bold text-white font-calendas glow-blue">
                Admin Dashboard
              </h1>
              <DigitalClock />
            </div>
          </SlideInLeft>

          <FadeIn delay={0.3}>
            <Separator className="my-6 bg-gray-800" />
          </FadeIn>

          {/* Tabs using shadcn Tabs component */}
          <Tabs
            defaultValue="dashboard"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-8"
          >
            <SlideUp delay={0.4}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <AiOutlineDashboard className="mr-2" /> Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="calendar"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <AiOutlineCalendar className="mr-2" /> Calendar
                </TabsTrigger>
                <TabsTrigger
                  value="chat-history"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <FaComments className="mr-2" /> Chat History
                </TabsTrigger>
              </TabsList>
            </SlideUp>

            <AnimatePresence mode="wait">
              {/* Dashboard Content */}
              <TabsContent value="dashboard" key="dashboard">
                <DashboardTab blogPosts={blogPosts} isLoading={isLoading} />
              </TabsContent>

              {/* Calendar View */}
              <TabsContent value="calendar" key="calendar">
                <CalendarTab
                  selectedDate={selectedDate}
                  postsOnSelectedDate={postsOnSelectedDate}
                  blogDates={blogDates}
                  handleDateChange={handleDateChange}
                />
              </TabsContent>

              {/* Chat History Tab Content */}
              <TabsContent
                value="chat-history"
                key="chat-history"
                className="space-y-4"
              >
                <ChatHistoryTab
                  chatHistories={chatHistories}
                  isLoadingChatHistories={isLoadingChatHistories}
                  chatHistoriesError={chatHistoriesError}
                  fetchChatHistories={fetchChatHistories}
                />
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </PageContainer>
      </div>
    </PageTransition>
  );
}

// Export AdminDashboard as the default export for this page
export default AdminDashboard;

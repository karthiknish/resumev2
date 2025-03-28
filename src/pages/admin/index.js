import { useEffect, useState } from "react";
import {
  AiOutlineDashboard,
  AiOutlineCalendar,
  AiOutlineMail, // Icon for Contacts tab
  AiOutlineUser, // Icon for Users tab
  AiOutlineThunderbolt, // Icon for Bytes tab
} from "react-icons/ai";
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
import ContactsTab from "@/components/admin/tabs/ContactsTab";
import UsersTab from "@/components/admin/tabs/UsersTab";
import BytesTab from "@/components/admin/tabs/BytesTab"; // Import the new BytesTab

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
        session?.user?.role === "admin" ||
        session?.user?.isAdmin === true ||
        session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

      console.log("Is user admin?", isUserAdmin);
      console.log("Admin check conditions:", {
        roleIsAdmin: session.user.role === "admin",
        isAdminProperty: session.user.isAdmin === true,
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

  // This function is passed to CalendarTab but not used there currently
  // It needs to be passed into the ReactCalendar component's tileContent prop
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    // Check if there are any blog posts on this date
    const hasPosts = blogDates.some(
      (postDate) =>
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
    );

    // Use a class name for styling the dot
    return hasPosts ? <div className="blog-post-indicator"></div> : null;
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
          {/* Updated Calendar Dark Theme Styles */}
          <style jsx global>{`
            /* === React Calendar Dark Theme Styles === */
            .react-calendar {
              width: 100%;
              max-width: 100%;
              background: #111827 !important; /* Darker background (gray-900) */
              color: #d1d5db; /* Light gray text (gray-300) */
              border-radius: 8px;
              border: 1px solid #374151; /* Gray border (gray-700) */
              font-family: "Calendas", Arial, sans-serif; /* Ensure font consistency */
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Subtle shadow */
            }

            /* Tile base style */
            .react-calendar__tile {
              padding: 10px;
              color: #d1d5db; /* Light gray text */
              border-radius: 6px;
              position: relative; /* Needed for the dot */
              transition: background-color 0.2s ease; /* Smooth transition */
            }

            /* Tile hover/focus */
            .react-calendar__tile:enabled:hover,
            .react-calendar__tile:enabled:focus {
              background-color: #1f2937; /* Darker gray on hover/focus (gray-800) */
            }

            /* Style for today's date */
            .react-calendar__tile--now {
              background: #374151; /* Gray background for today (gray-700) */
              font-weight: bold;
              color: #ffffff; /* White text for today */
            }
            .react-calendar__tile--now:enabled:hover,
            .react-calendar__tile--now:enabled:focus {
              background: #4b5563; /* Darker gray hover for today (gray-600) */
            }

            /* Style for active/selected date */
            .react-calendar__tile--active {
              background: #3b82f6 !important; /* Blue for active/selected date (blue-500) */
              color: white !important; /* Ensure text is white */
              box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); /* Blue glow */
            }
            .react-calendar__tile--active:enabled:hover,
            .react-calendar__tile--active:enabled:focus {
              background: #2563eb !important; /* Darker blue on hover (blue-600) */
            }

            /* Navigation buttons */
            .react-calendar__navigation button {
              color: #d1d5db; /* Light gray text */
              min-width: 44px;
              background: none;
              font-size: 1rem;
              margin-top: 8px;
              border-radius: 6px;
              padding: 4px 0;
              transition: background-color 0.2s ease; /* Smooth transition */
            }
            .react-calendar__navigation button:enabled:hover,
            .react-calendar__navigation button:enabled:focus {
              background-color: #1f2937; /* Darker gray on hover/focus (gray-800) */
            }
            .react-calendar__navigation button[disabled] {
              color: #4b5563; /* Dim disabled buttons (gray-600) */
              background-color: transparent;
            }

            /* Weekday names */
            .react-calendar__month-view__weekdays {
              text-align: center;
              text-transform: uppercase;
              font-weight: bold;
              font-size: 0.75em;
              color: #9ca3af; /* Lighter gray for weekday names (gray-400) */
              padding-bottom: 0.75em; /* Add spacing */
              border-bottom: 1px solid #374151; /* Separator line (gray-700) */
              margin-bottom: 0.5em;
            }
            .react-calendar__month-view__weekdays__weekday {
              padding: 0.5em;
            }

            /* Days from neighboring months */
            .react-calendar__month-view__days__day--neighboringMonth {
              color: #4b5563; /* Dim days from other months (gray-600) */
            }

            /* Year/Decade/Century views */
            .react-calendar__year-view .react-calendar__tile,
            .react-calendar__decade-view .react-calendar__tile,
            .react-calendar__century-view .react-calendar__tile {
              padding: 2em 0.5em;
              background-color: #1f2937; /* Match hover color for consistency */
              color: #d1d5db;
            }
            .react-calendar__year-view .react-calendar__tile:hover,
            .react-calendar__decade-view .react-calendar__tile:hover,
            .react-calendar__century-view .react-calendar__tile:hover {
              background-color: #374151; /* Darker hover */
            }

            /* Style for the dot indicating posts */
            .blog-post-indicator {
              height: 6px;
              width: 6px;
              background-color: #ec4899; /* Pink dot (pink-500) */
              border-radius: 50%;
              position: absolute;
              bottom: 6px;
              left: 50%;
              transform: translateX(-50%);
            }

            /* === End Calendar Styles === */

            /* Glow effects (Keep existing glow styles) */
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
              {/* Update grid columns to 6 */}
              <TabsList className="grid w-full grid-cols-6 mb-4">
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
                {/* Add Contacts Tab Trigger */}
                <TabsTrigger
                  value="contacts"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <AiOutlineMail className="mr-2" /> Contacts
                </TabsTrigger>
                {/* Add Users Tab Trigger */}
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <AiOutlineUser className="mr-2" /> Users
                </TabsTrigger>
                {/* Add Bytes Tab Trigger */}
                <TabsTrigger
                  value="bytes"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <AiOutlineThunderbolt className="mr-2" /> Bytes
                </TabsTrigger>
              </TabsList>
            </SlideUp>

            <AnimatePresence mode="wait">
              {/* Dashboard Content */}
              <TabsContent value="dashboard" key="dashboard">
                <DashboardTab
                  blogPosts={blogPosts}
                  isLoading={isLoading}
                  unreadCount={unreadCount} // Pass unreadCount prop
                />
              </TabsContent>

              {/* Calendar View */}
              <TabsContent value="calendar" key="calendar">
                <CalendarTab
                  selectedDate={selectedDate}
                  postsOnSelectedDate={postsOnSelectedDate}
                  blogDates={blogDates}
                  handleDateChange={handleDateChange}
                  // Pass tileContent function to CalendarTab
                  tileContent={tileContent}
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

              {/* Contacts Tab Content */}
              <TabsContent value="contacts" key="contacts">
                <ContactsTab />
              </TabsContent>

              {/* Users Tab Content */}
              <TabsContent value="users" key="users">
                <UsersTab />
              </TabsContent>

              {/* Bytes Tab Content */}
              <TabsContent value="bytes" key="bytes">
                <BytesTab />
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

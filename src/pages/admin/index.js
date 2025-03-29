import { useEffect, useState } from "react";
import {
  AiOutlineRead,
  AiOutlineCalendar,
  AiOutlineMail,
  AiOutlineThunderbolt,
  AiOutlineExperiment,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { FaComments, FaUserCheck } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence } from "framer-motion";
import {
  FadeIn,
  SlideInLeft,
  SlideUp,
  PageTransition,
} from "@/components/animations/MotionComponents";
import PageContainer from "@/components/PageContainer";
// Import tab components
import DigitalClock from "@/components/admin/ui/DigitalClock";
import EmptyPage from "@/components/admin/ui/EmptyPage";
import DashboardTab from "@/components/admin/tabs/DashboardTab";
import CalendarTab from "@/components/admin/tabs/CalendarTab";
import ChatHistoryTab from "@/components/admin/tabs/ChatHistoryTab";
import ContactsTab from "@/components/admin/tabs/ContactsTab";
import BytesTab from "@/components/admin/tabs/BytesTab";
import ApiStatusTab from "@/components/admin/tabs/ApiStatusTab";
import SubscribersTab from "@/components/admin/tabs/SubscribersTab";
import MessagesTab from "@/components/admin/tabs/MessagesTab"; // Import MessagesTab

function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionDebug, setSessionDebug] = useState(null);

  // State specifically for unread messages count (needed by DashboardTab)
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingMessagesCount, setIsLoadingMessagesCount] = useState(true);

  // Check for admin role
  useEffect(() => {
    if (session?.user) {
      const isUserAdmin =
        session.user.role === "admin" ||
        session.user.isAdmin === true ||
        session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      setIsAdmin(isUserAdmin);
      setSessionDebug(session);
    } else {
      setIsAdmin(false);
    }
  }, [session]);

  // Handle redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Fetch only the unread message count needed for the dashboard badge
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!isAdmin) return;
      setIsLoadingMessagesCount(true);
      try {
        // TODO: Update this API call if the endpoint changes or requires specific parameters
        const response = await fetch(
          "/api/messages?isRead=false&countOnly=true"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch unread message count");
        }
        const data = await response.json();
        if (data.success) {
          setUnreadCount(data.count || 0);
        } else {
          console.error("API Error fetching unread count:", data.message);
          setUnreadCount(0);
        }
      } catch (error) {
        console.error("Error fetching unread message count:", error);
        setUnreadCount(0);
      } finally {
        setIsLoadingMessagesCount(false);
      }
    };

    fetchUnreadCount();
  }, [isAdmin]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect state
  if (!session && status !== "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to sign in...</div>
      </div>
    );
  }

  // Not admin state
  if (status === "authenticated" && !isAdmin) {
    return <EmptyPage sessionDebug={sessionDebug} />;
  }

  // Admin Dashboard Render
  if (status === "authenticated" && isAdmin) {
    return (
      <PageTransition>
        <div className="admin-dashboard min-h-screen bg-black text-white">
          <Head>
            <title>Admin Dashboard</title>
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

            <Tabs
              defaultValue="dashboard"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <SlideUp delay={0.4}>
                {/* Updated grid columns to 8 */}
                <TabsList className="grid w-full grid-cols-8 mb-4">
                  <TabsTrigger
                    value="dashboard"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <AiOutlineRead className="mr-2" /> Blogs
                  </TabsTrigger>
                  <TabsTrigger
                    value="calendar"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <AiOutlineCalendar className="mr-2" /> Calendar
                  </TabsTrigger>
                  <TabsTrigger
                    value="messages"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white relative"
                  >
                    <AiOutlineMail className="mr-2" /> Messages
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat-history"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <FaComments className="mr-2" /> Chat History
                  </TabsTrigger>
                  <TabsTrigger
                    value="contacts"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <AiOutlineMail className="mr-2" /> Contacts
                  </TabsTrigger>
                  <TabsTrigger
                    value="bytes"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <AiOutlineThunderbolt className="mr-2" /> Bytes
                  </TabsTrigger>
                  <TabsTrigger
                    value="subscribers"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <FaUserCheck className="mr-2" /> Subscribers
                  </TabsTrigger>
                  <TabsTrigger
                    value="api-status"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <AiOutlineExperiment className="mr-2" /> API Status
                  </TabsTrigger>
                </TabsList>
              </SlideUp>

              <AnimatePresence mode="wait">
                <TabsContent value="dashboard" key="dashboard">
                  <DashboardTab
                    unreadCount={
                      isLoadingMessagesCount ? undefined : unreadCount
                    }
                  />
                </TabsContent>
                <TabsContent value="calendar" key="calendar">
                  <CalendarTab />
                </TabsContent>
                <TabsContent value="messages" key="messages">
                  <MessagesTab />
                </TabsContent>
                <TabsContent value="chat-history" key="chat-history">
                  <ChatHistoryTab />
                </TabsContent>
                <TabsContent value="contacts" key="contacts">
                  <ContactsTab />
                </TabsContent>
                <TabsContent value="bytes" key="bytes">
                  <BytesTab />
                </TabsContent>
                <TabsContent value="subscribers" key="subscribers">
                  <SubscribersTab />
                </TabsContent>
                <TabsContent value="api-status" key="api-status">
                  <ApiStatusTab />
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </PageContainer>
        </div>
      </PageTransition>
    );
  }

  return null; // Fallback return
}

export default AdminDashboard;

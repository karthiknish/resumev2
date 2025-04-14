import { useEffect, useState } from "react";
import {
  AiOutlineRead,
  AiOutlineCalendar,
  AiOutlineMail,
  AiOutlineThunderbolt,
  AiOutlineExperiment,
  AiOutlineUsergroupAdd,
  AiFillLinkedin, // Added LinkedIn icon
  AiOutlineClockCircle, // Added Clock icon for Pomodoro
  AiOutlineFire, // Icon for News
} from "react-icons/ai";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { FaComments, FaUserCheck } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // <-- Import Select components
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
import LinkedInTab from "@/components/admin/tabs/LinkedInTab"; // Import LinkedInTab
import PomodoroTab from "@/components/admin/tabs/PomodoroTab"; // Import PomodoroTab
import HackerNewsFeed from "@/components/admin/tabs/HackerNewsFeed"; // Import HackerNewsFeed
import { checkAdminStatus } from "@/lib/authUtils"; // Import the utility
import { toast } from "sonner";

// Define tab configuration data
const adminTabs = [
  { value: "dashboard", label: "Blogs", Icon: AiOutlineRead },
  { value: "calendar", label: "Calendar", Icon: AiOutlineCalendar },
  { value: "chat-history", label: "Chat History", Icon: FaComments },
  {
    value: "contacts",
    label: "Contacts",
    Icon: AiOutlineMail,
    showBadge: true,
  },
  { value: "bytes", label: "Bytes", Icon: AiOutlineThunderbolt },
  { value: "subscribers", label: "Subscribers", Icon: FaUserCheck },
  { value: "linkedin", label: "LinkedIn", Icon: AiFillLinkedin },
  { value: "api-status", label: "API Status", Icon: AiOutlineExperiment },
  { value: "pomodoro", label: "Pomodoro", Icon: AiOutlineClockCircle },
  { value: "news", label: "News", Icon: AiOutlineFire },
];

function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(adminTabs[0].value);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionDebug, setSessionDebug] = useState(null);

  // State specifically for unread count (now for Contacts)
  const [unreadContactsCount, setUnreadContactsCount] = useState(0);
  const [isLoadingContactsCount, setIsLoadingContactsCount] = useState(true);

  // Check for admin role
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (status === "unauthenticated") {
      signIn(); // Redirect to signin if unauthenticated
      return;
    }

    // --- TEMPORARY LOGGING ---
    console.log("Admin Page Session Status:", status);
    console.log("Admin Page Session Object:", JSON.stringify(session, null, 2));
    console.log(
      "NEXT_PUBLIC_ADMIN_EMAIL:",
      process.env.NEXT_PUBLIC_ADMIN_EMAIL
    );
    // --- END TEMPORARY LOGGING ---

    const isAdminCheck = checkAdminStatus(session);
    setIsAdmin(isAdminCheck); // Update the isAdmin state
    console.log("Admin Check Result:", isAdminCheck); // Log the result of the check

    if (!isAdminCheck) {
      // Add a small delay before redirecting to allow logs to appear
      // and prevent immediate flashing if session is briefly null
      setTimeout(() => {
        toast.error("Access Denied: Redirecting...");
        router.push("/"); // Redirect non-admins to homepage
      }, 100);
    }
  }, [session, status, router]);

  // Fetch unread *contacts* count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!isAdmin) return;
      setIsLoadingContactsCount(true);
      try {
        const response = await fetch(
          "/api/contacts?isRead=false&countOnly=true"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch unread contact count");
        }
        const data = await response.json();
        if (data.success) {
          setUnreadContactsCount(data.count || 0);
        } else {
          console.error(
            "API Error fetching unread contact count:",
            data.message
          );
          setUnreadContactsCount(0);
        }
      } catch (error) {
        console.error("Error fetching unread contact count:", error);
        setUnreadContactsCount(0);
      } finally {
        setIsLoadingContactsCount(false);
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

  // Not admin state (Show temporarily while checking/redirecting if needed)
  if (status === "authenticated" && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">
          Checking access or redirecting...
        </div>
      </div>
    );
  }

  // Admin Dashboard Render
  if (status === "authenticated" && isAdmin) {
    return (
      <PageTransition>
        <div className="admin-dashboard min-h-screen bg-black text-white">
          <Head>
            <title>Admin Dashboard</title>
          </Head>

          <PageContainer className="mt-20">
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
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <SlideUp delay={0.4}>
                {/* Desktop TabsList (Hidden on Small Screens) */}
                <TabsList className="hidden md:flex w-full overflow-x-auto pb-2 scrollbar-thin mb-4 space-x-1">
                  {adminTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex-shrink-0 relative"
                    >
                      <tab.Icon className="h-4 w-4" />{" "}
                      <span className="ml-1.5">{tab.label}</span>
                      {tab.value === "contacts" && unreadContactsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-xs items-center justify-center">
                            {unreadContactsCount > 9
                              ? "9+"
                              : unreadContactsCount}
                          </span>
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Mobile Select (Visible only on Small Screens) */}
                <div className="block md:hidden mb-4">
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select a tab" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {adminTabs.map((tab) => (
                        <SelectItem key={tab.value} value={tab.value}>
                          <div className="flex items-center">
                            <tab.Icon className="mr-2 h-4 w-4" />
                            {tab.label}
                            {tab.value === "contacts" &&
                              unreadContactsCount > 0 && (
                                <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-red-500">
                                  {unreadContactsCount > 9
                                    ? "9+"
                                    : unreadContactsCount}
                                </span>
                              )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SlideUp>

              {/* Content Panes */}
              <AnimatePresence mode="wait">
                <TabsContent value="dashboard" key="dashboard">
                  <DashboardTab
                    unreadCount={
                      isLoadingContactsCount ? undefined : unreadContactsCount
                    }
                  />
                </TabsContent>
                <TabsContent value="calendar" key="calendar">
                  {" "}
                  <CalendarTab />{" "}
                </TabsContent>
                <TabsContent value="chat-history" key="chat-history">
                  {" "}
                  <ChatHistoryTab />{" "}
                </TabsContent>
                <TabsContent value="contacts" key="contacts">
                  {" "}
                  <ContactsTab />{" "}
                </TabsContent>
                <TabsContent value="bytes" key="bytes">
                  {" "}
                  <BytesTab />{" "}
                </TabsContent>
                <TabsContent value="subscribers" key="subscribers">
                  {" "}
                  <SubscribersTab />{" "}
                </TabsContent>
                <TabsContent value="linkedin" key="linkedin">
                  {" "}
                  <LinkedInTab />{" "}
                </TabsContent>
                <TabsContent value="api-status" key="api-status">
                  {" "}
                  <ApiStatusTab />{" "}
                </TabsContent>
                <TabsContent value="pomodoro" key="pomodoro">
                  {" "}
                  <PomodoroTab />{" "}
                </TabsContent>
                <TabsContent value="news" key="news">
                  {" "}
                  <HackerNewsFeed />{" "}
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </PageContainer>
        </div>
      </PageTransition>
    );
  }

  return null; // Fallback return for intermediate states
}

export default AdminDashboard;

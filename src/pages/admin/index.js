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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl px-8 py-6 shadow-xl flex items-center gap-4">
          <div className="animate-spin text-3xl">⚡</div>
          <span className="text-gray-700 font-bold text-xl">Loading Admin Dashboard...</span>
        </div>
      </div>
    );
  }

  // Redirect state
  if (!session && status !== "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-2xl px-8 py-6 shadow-xl flex items-center gap-4">
          <div className="text-3xl">🔐</div>
          <span className="text-gray-700 font-bold text-xl">Redirecting to sign in...</span>
        </div>
      </div>
    );
  }

  // Not admin state (Show temporarily while checking/redirecting if needed)
  if (status === "authenticated" && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl px-8 py-6 shadow-xl flex items-center gap-4">
          <div className="text-3xl">🔍</div>
          <span className="text-gray-700 font-bold text-xl">
            Checking access or redirecting...
          </span>
        </div>
      </div>
    );
  }

  // Admin Dashboard Render
  if (status === "authenticated" && isAdmin) {
    return (
      <PageTransition>
        <div className="admin-dashboard min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
          <Head>
            <title>Admin Dashboard</title>
          </Head>

          <PageContainer className="mt-20">
            <SlideInLeft delay={0.2}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-6xl animate-pulse">⚡</div>
                  <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Admin Dashboard
                  </h1>
                </div>
                <DigitalClock />
              </div>
            </SlideInLeft>

            <FadeIn delay={0.3}>
              <Separator className="my-6 bg-gradient-to-r from-purple-200 to-blue-200 h-1 rounded-full" />
            </FadeIn>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <SlideUp delay={0.4}>
                {/* Desktop TabsList (Hidden on Small Screens) */}
                <TabsList className="hidden md:flex w-full overflow-x-auto pb-2 scrollbar-thin mb-6 space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200 shadow-xl">
                  {adminTabs.map((tab, index) => {
                    const gradients = [
                      'from-purple-500 to-blue-500',
                      'from-pink-500 to-rose-500', 
                      'from-orange-500 to-red-500',
                      'from-green-500 to-teal-500',
                      'from-indigo-500 to-purple-500',
                      'from-cyan-500 to-blue-500',
                      'from-violet-500 to-purple-500',
                      'from-blue-500 to-indigo-500',
                      'from-emerald-500 to-teal-500',
                      'from-amber-500 to-orange-500'
                    ];
                    const gradientClass = gradients[index % gradients.length];
                    
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`flex-shrink-0 relative transition-all duration-300 rounded-xl px-4 py-3 font-bold border-2 ${
                          activeTab === tab.value
                            ? `bg-gradient-to-r ${gradientClass} text-white border-transparent shadow-lg`
                            : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white hover:border-purple-300 hover:text-purple-600"
                        }`}
                      >
                        <tab.Icon className="h-4 w-4" />{" "}
                        <span className="ml-2">{tab.label}</span>
                        {tab.value === "contacts" && unreadContactsCount > 0 && (
                          <span className="absolute -top-2 -right-2 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-xs items-center justify-center text-white font-bold">
                              {unreadContactsCount > 9
                                ? "9+"
                                : unreadContactsCount}
                            </span>
                          </span>
                        )}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {/* Mobile Select (Visible only on Small Screens) */}
                <div className="block md:hidden mb-6">
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-gray-700 rounded-2xl px-6 py-4 font-bold text-lg shadow-lg">
                      <SelectValue placeholder="Select a tab" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 text-gray-700 rounded-2xl shadow-xl">
                      {adminTabs.map((tab) => (
                        <SelectItem key={tab.value} value={tab.value} className="font-semibold">
                          <div className="flex items-center">
                            <tab.Icon className="mr-3 h-5 w-5" />
                            {tab.label}
                            {tab.value === "contacts" &&
                              unreadContactsCount > 0 && (
                                <span className="ml-3 inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
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

              {/* Tab Content with Card-like Container */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-purple-200">
                <AnimatePresence mode="wait">
                  {activeTab === "dashboard" && (
                    <DashboardTab key="dashboard" />
                  )}
                  {activeTab === "calendar" && <CalendarTab key="calendar" />}
                  {activeTab === "chat-history" && (
                    <ChatHistoryTab key="chat-history" />
                  )}
                  {activeTab === "contacts" && (
                    <ContactsTab
                      key="contacts"
                      onUnreadCountUpdate={setUnreadContactsCount}
                    />
                  )}
                  {activeTab === "bytes" && <BytesTab key="bytes" />}
                  {activeTab === "api-status" && (
                    <ApiStatusTab key="api-status" />
                  )}
                  {activeTab === "subscribers" && (
                    <SubscribersTab key="subscribers" />
                  )}
                  {activeTab === "linkedin" && <LinkedInTab key="linkedin" />}
                  {activeTab === "pomodoro" && <PomodoroTab key="pomodoro" />}
                  {activeTab === "news" && <HackerNewsFeed key="news" />}
                  {!activeTab && <EmptyPage />}
                </AnimatePresence>
              </div>
            </Tabs>
          </PageContainer>
        </div>
      </PageTransition>
    );
  }

  return null; // Fallback return for intermediate states
}

export default AdminDashboard;

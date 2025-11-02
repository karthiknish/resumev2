import { useEffect, useState } from "react";
import {
  AiOutlineRead,
  AiOutlineCalendar,
  AiOutlineMail,
  AiOutlineThunderbolt,
  AiOutlineExperiment,
  AiOutlineUsergroupAdd,
  AiOutlineClockCircle, // Added Clock icon for Pomodoro
  AiOutlineFire, // Icon for News
} from "react-icons/ai";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signIn } from "@/lib/authUtils";
import { FaComments, FaUserCheck } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
// import LinkedInTab from "@/components/admin/tabs/LinkedInTab";
import PomodoroTab from "@/components/admin/tabs/PomodoroTab";
import HackerNewsFeed from "@/components/admin/tabs/HackerNewsFeed";
import { checkAdminStatus } from "@/lib/authUtils";
import { toast } from "sonner";

// Define tab configuration data
const adminTabs = [
  { value: "dashboard", label: "Blogs", Icon: AiOutlineRead },
  { value: "calendar", label: "Calendar", Icon: AiOutlineCalendar },
  {
    value: "contacts",
    label: "Contacts",
    Icon: AiOutlineMail,
    showBadge: true,
  },
  { value: "bytes", label: "Bytes", Icon: AiOutlineThunderbolt },
  { value: "subscribers", label: "Subscribers", Icon: FaUserCheck },
  { value: "api-status", label: "API Status", Icon: AiOutlineExperiment },
  { value: "pomodoro", label: "Pomodoro", Icon: AiOutlineClockCircle },
  { value: "news", label: "News", Icon: AiOutlineFire },
];

function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(adminTabs[0].value);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

    const isAdminCheck = checkAdminStatus(session);
    setIsAdmin(isAdminCheck);

    // Only redirect if we're in the browser and not an admin
    if (!isAdminCheck && isClient) {
      setTimeout(() => {
        toast.error("Access Denied: Redirecting...");
        router.push("/");
      }, 100);
    }
  }, [session, status, router, isClient]);

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-700">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-8 py-6 shadow-xl">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
          <span className="font-heading text-xl font-semibold">
            Loading Admin Dashboard...
          </span>
        </div>
      </div>
    );
  }

  // Redirect state
  if (!session && status !== "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-700">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-8 py-6 shadow-xl">
          <div className="h-6 w-6 animate-pulse rounded-full bg-blue-500/70"></div>
          <span className="font-heading text-xl font-semibold">
            Redirecting to sign in...
          </span>
        </div>
      </div>
    );
  }

  // Not admin state (Show temporarily while checking/redirecting if needed)
  if (status === "authenticated" && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-700">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-8 py-6 shadow-xl">
          <div className="h-6 w-6 animate-pulse rounded-full bg-blue-500/70"></div>
          <span className="font-heading text-xl font-semibold">
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
        <div className="admin-dashboard min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900">
          <Head>
            <title>Admin Dashboard</title>
          </Head>

          <PageContainer className="px-4 pt-20 text-slate-900 md:px-8 lg:px-10">
            <SlideInLeft delay={0.2}>
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-heading font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                    Admin Dashboard
                  </h1>
                  <p className="mt-2 text-sm text-slate-600 sm:text-base">
                    Review site activity, manage content, and monitor tools in one place.
                  </p>
                </div>
                <DigitalClock />
              </div>
            </SlideInLeft>

            <FadeIn delay={0.3}>
              <Separator className="my-5 h-[2px] rounded-full bg-slate-200" />
            </FadeIn>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8 mt-2 z-10"
            >
              <SlideUp delay={0.4}>
                {/* Desktop TabsList (Hidden below lg) */}
                <TabsList className="hidden w-full snap-x snap-mandatory justify-center gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white py-3 shadow-sm scrollbar-thin md:py-4 lg:my-5 lg:flex">
                  {adminTabs.map((tab, index) => {
                    const gradients = [];
                    const gradientClass = "";

                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`relative flex-shrink-0 snap-start min-w-[8rem] rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-300 md:min-w-[9rem] md:px-4 md:py-2.5 ${
                          activeTab === tab.value
                            ? "border-blue-500 bg-blue-600 text-white shadow-md"
                            : "border-transparent bg-slate-100 text-slate-600 hover:border-blue-200 hover:bg-white hover:text-slate-900"
                        }`}
                      >
                        <tab.Icon className="h-4 w-4" />{" "}
                        <span className="ml-2">{tab.label}</span>
                        {tab.value === "contacts" &&
                          unreadContactsCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-5 w-5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/75 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-5 w-5 bg-destructive text-xs items-center justify-center text-destructive-foreground font-bold">
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

                {/* Mobile/Tablet Select (Visible below lg) */}
                <div className="mb-5 block lg:hidden">
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-700 shadow-sm">
                      <SelectValue placeholder="Select a tab" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[60vh] overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
                      {adminTabs.map((tab) => (
                        <SelectItem
                          key={tab.value}
                          value={tab.value}
                          className="font-semibold text-slate-700"
                        >
                          <div className="flex items-center">
                            <tab.Icon className="mr-3 h-5 w-5" />
                            <span>{tab.label}</span>
                            {tab.value === "contacts" &&
                              unreadContactsCount > 0 && (
                                <span className="ml-3 inline-flex items-center justify-center rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
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
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-md md:p-6">
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
                  {/* LinkedIn tab removed */}
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

  return null;
}

export default AdminDashboard;

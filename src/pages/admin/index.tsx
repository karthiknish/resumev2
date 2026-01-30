// Converted to TypeScript - migrated
import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  Mail,
  Zap,
  FlaskConical,
  Users,
  Clock,
  Flame,
  Linkedin,
  Send,
} from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signIn } from "@/lib/authUtils";
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
import ContactsTab from "@/components/admin/tabs/ContactsTab";
import BytesTab from "@/components/admin/tabs/BytesTab";
import ApiStatusTab from "@/components/admin/tabs/ApiStatusTab";
import SubscribersTab from "@/components/admin/tabs/SubscribersTab";
import LinkedInTab from "@/components/admin/tabs/LinkedInTab";
import PomodoroTab from "@/components/admin/tabs/PomodoroTab";
import HackerNewsFeed from "@/components/admin/tabs/HackerNewsFeed";
import NewsletterTab from "@/components/admin/tabs/NewsletterTab";
import { checkAdminStatus } from "@/lib/authUtils";
import { toast } from "sonner";

// Define tab configuration data
const adminTabs = [
  { value: "dashboard", label: "Blogs", Icon: BookOpen },
  { value: "calendar", label: "Calendar", Icon: Calendar },
  {
    value: "contacts",
    label: "Contacts",
    Icon: Mail,
    showBadge: true,
  },
  { value: "bytes", label: "Bytes", Icon: Zap },
  { value: "subscribers", label: "Subscribers", Icon: Users },
  { value: "newsletter", label: "Newsletter", Icon: Send },
  { value: "api-status", label: "API Status", Icon: FlaskConical },
  { value: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { value: "pomodoro", label: "Pomodoro", Icon: Clock },
  { value: "news", label: "News", Icon: Flame },
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
  const [unreadContactsCount, setUnreadContactsCount] = useState<number>(0);
  const [isLoadingContactsCount, setIsLoadingContactsCount] = useState(true);

  // Check for admin role
  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    
    // Localhost bypass for development testing
    const isLocalhost = typeof window !== "undefined" && 
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    
    if (isLocalhost) {
      setIsAdmin(true);
      return;
    }
    
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
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/90 px-8 py-6 shadow-xl">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
          <span className="font-heading text-xl font-semibold">
            Loading Admin Dashboard...
          </span>
        </div>
      </div>
    );
  }

  // Redirect state
  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/90 px-8 py-6 shadow-xl">
          <div className="h-6 w-6 animate-pulse rounded-full bg-primary/70"></div>
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
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/90 px-8 py-6 shadow-xl">
          <div className="h-6 w-6 animate-pulse rounded-full bg-primary/70"></div>
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
        <div className="admin-dashboard min-h-screen bg-background text-foreground">
          <Head>
            <title>Admin Dashboard</title>
          </Head>

          <PageContainer className="px-4 pt-20 md:pt-24 lg:pt-28 text-foreground md:px-6 lg:px-8">
            <SlideInLeft delay={0.2}>
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-heading font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    Admin Dashboard
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Review site activity, manage content, and monitor tools in one place.
                  </p>
                </div>
                <div className="flex items-center justify-center md:justify-end">
                  <DigitalClock />
                </div>
              </div>
            </SlideInLeft>

            <FadeIn delay={0.3}>
              <Separator className="my-4 md:my-5 h-[2px] rounded-full bg-border" />
            </FadeIn>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6 md:mb-8 mt-2 z-10"
            >
              <SlideUp delay={0.4}>
                {/* Desktop TabsList (Hidden below lg) */}
                <TabsList className="hidden w-full snap-x snap-mandatory justify-center gap-1 lg:gap-2 overflow-x-auto rounded-2xl border border-border bg-card py-2.5 shadow-sm scrollbar-thin md:py-3 lg:my-5 lg:flex lg:py-3.5">
                  {adminTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`relative flex-shrink-0 snap-start min-w-[7rem] md:min-w-[8rem] lg:min-w-[9rem] rounded-xl border px-2.5 py-1.5 text-xs md:text-sm lg:px-4 lg:py-2.5 md:px-3 md:py-2 font-semibold transition-all duration-300 ${
                        activeTab === tab.value
                          ? "border-primary bg-primary text-primary-foreground shadow-md"
                          : "border-transparent bg-muted text-muted-foreground hover:border-primary/20 hover:bg-card hover:text-foreground"
                      }`}
                      aria-label={`${tab.label} tab${tab.value === "contacts" && unreadContactsCount > 0 ? ` with ${unreadContactsCount} unread` : ""}`}
                    >
                      <tab.Icon className="size-3.5 md:size-4" aria-hidden="true" />{" "}
                      <span className="ml-2">{tab.label}</span>
                      {tab.value === "contacts" &&
                        unreadContactsCount > 0 && (
                          <span className="absolute -top-2 -right-2 flex size-5" aria-label={`${unreadContactsCount} unread messages`}>
                            <span className="animate-ping absolute inline-flex size-full rounded-full bg-destructive/75 opacity-75"></span>
                            <span className="relative inline-flex rounded-full size-5 bg-destructive text-xs items-center justify-center text-destructive-foreground font-bold">
                              {unreadContactsCount > 9
                                ? "9+"
                                : unreadContactsCount}
                            </span>
                          </span>
                        )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Mobile/Tablet Select (Visible below lg) */}
                <div className="mb-4 md:mb-5 block lg:hidden">
                  <Select value={activeTab} onValueChange={setActiveTab}>
                    <SelectTrigger className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm md:text-base font-semibold text-foreground shadow-sm" aria-label="Select admin tab">
                      <SelectValue placeholder="Select a tab" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[60vh] overflow-auto rounded-2xl border border-border bg-card shadow-lg">
                      {adminTabs.map((tab) => (
                        <SelectItem
                          key={tab.value}
                          value={tab.value}
                          className="font-semibold text-foreground text-sm"
                        >
                          <div className="flex items-center">
                            <tab.Icon className="mr-3 size-4 md:size-5" aria-hidden="true" />
                            <span>{tab.label}</span>
                            {tab.value === "contacts" &&
                              unreadContactsCount > 0 && (
                                <span className="ml-3 inline-flex items-center justify-center rounded-full bg-destructive/10 px-2 py-0.5 md:px-2 md:py-1 text-xs font-bold text-destructive" aria-label={`${unreadContactsCount} unread`}>
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
              <div className="rounded-3xl border border-border bg-card p-4 md:p-5 lg:p-6 text-foreground shadow-md">
                <AnimatePresence mode="wait">
                  {activeTab === "dashboard" && (
                    <DashboardTab
                      key="dashboard"
                      unreadCount={unreadContactsCount}
                    />
                  )}
                  {activeTab === "calendar" && <CalendarTab key="calendar" />}
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
                  {activeTab === "newsletter" && (
                    <NewsletterTab key="newsletter" />
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

  return null;
}

export default AdminDashboard;


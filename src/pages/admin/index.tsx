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
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
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
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-sm transition hover:border-primary/25 hover:bg-muted hover:text-foreground"
                  >
                    <ArrowLeft className="size-3.5" aria-hidden />
                    Back to site
                  </Link>
                  <h1 className="text-2xl font-heading font-bold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground sm:text-base">
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
              className="z-10 mb-6 mt-2 min-w-0 max-w-full md:mb-8"
            >
              <div className="sticky top-16 z-30 -mx-4 mb-4 border-b border-border/70 bg-background/90 px-2 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 md:-mx-6 lg:-mx-8">
              <SlideUp delay={0.4}>
                {/* Desktop TabsList (Hidden below lg) */}
                <TabsList className="hidden w-full flex-wrap justify-center gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-sm scrollbar-thin lg:flex lg:gap-2 lg:p-2.5">
                  {adminTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`shrink-0 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 md:px-3 md:py-2 md:text-sm lg:px-3.5 lg:py-2 ${
                        activeTab === tab.value
                          ? "border-primary bg-primary text-primary-foreground shadow-md"
                          : "border-transparent bg-muted text-muted-foreground hover:border-primary/20 hover:bg-card hover:text-foreground"
                      }`}
                      aria-label={`${tab.label} tab${tab.value === "contacts" && unreadContactsCount > 0 ? ` with ${unreadContactsCount} unread` : ""}`}
                    >
                      <span className="inline-flex items-center gap-1.5 md:gap-2">
                        <tab.Icon className="size-3.5 shrink-0 md:size-4" aria-hidden="true" />
                        <span className="whitespace-nowrap">{tab.label}</span>
                        {tab.value === "contacts" &&
                        unreadContactsCount > 0 ? (
                          <span
                            className="inline-flex min-h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground tabular-nums md:text-xs"
                            aria-label={`${unreadContactsCount} unread messages`}
                          >
                            {unreadContactsCount > 9
                              ? "9+"
                              : unreadContactsCount}
                          </span>
                        ) : null}
                      </span>
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
              </div>

              {/* Tab Content with Card-like Container */}
              <div className="min-h-[min(480px,72vh)] min-w-0 max-w-full rounded-3xl border border-border bg-card p-4 text-foreground shadow-md md:p-5 lg:p-6">
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


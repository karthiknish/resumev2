import "@/styles/globals.css";
import "highlight.js/styles/github.css"; // Light theme for code highlighting
import Script from "next/script";
import { useRouter } from "next/router";
import React, { useEffect, useState, lazy, Suspense } from "react"; // Import React
import ReactDOM from "react-dom"; // Import ReactDOM for react-axe
import { Inter, Space_Grotesk } from "next/font/google"; // Import Link for Cookie Banner
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence } from "framer-motion"; // Import AnimatePresence

// Dynamically import ChatBot
const ChatBot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

// Dynamically import PageTransitionWrapper with no SSR
const PageTransitionWrapper = dynamic(
  () => import("@/components/PageTransitionWrapper"),
  { ssr: false }
);

// Configure the Inter and Space Grotesk fonts with display: swap for better performance
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Create a client with default options for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

// Simple loading component with light theme
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
    <div className="animate-pulse bg-white rounded-lg p-8 shadow-lg border border-gray-100">
      <div className="h-8 w-32 bg-gradient-to-r from-purple-200 to-blue-200 rounded mb-4"></div>
      <div className="h-4 w-64 bg-gradient-to-r from-gray-200 to-purple-200 rounded"></div>
    </div>
  </div>
);

// Define centralized toast options with light theme
const toastOptions = {
  toastOptions: {
    style: {
      background: "#ffffff", // white
      color: "#1f2937", // gray-800
      border: "1px solid #e5e7eb", // gray-200
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    classNames: {
      toast:
        "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-800 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg",
      description: "group-[.toast]:text-gray-600",
      actionButton:
        "group-[.toast]:bg-blue-500 group-[.toast]:text-white group-[.toast]:hover:bg-blue-600",
      cancelButton:
        "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200",
      success: "group-[.toast]:text-green-600",
      error: "group-[.toast]:text-red-600",
    },
  },
  success: {
    style: {
      background: "#f0fdf4", // green-50
      color: "#166534", // green-800
      border: "1px solid #bbf7d0", // green-200
    },
  },
  error: {
    style: {
      background: "#fef2f2", // red-50
      color: "#991b1b", // red-800
      border: "1px solid #fecaca", // red-200
    },
  },
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const [transitionType, setTransitionType] = useState("default");
  const [isPageLoading, setIsPageLoading] = useState(false);
  // null | 'accepted' | 'declined'

  const [isMounted, setIsMounted] = useState(false);

  // Determine if chatbot should be shown only after mounted
  const showChatbot = isMounted && !router.pathname.startsWith("/admin");

  // Check cookie consent on mount

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Universal loading indicator for page transitions
  useEffect(() => {
    if (!isMounted) return; // Only set up router events after mount
    const handleStart = () => setIsPageLoading(true);
    const handleStop = () => setIsPageLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router, isMounted]);

  // Initialize react-axe for development only
  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined"
    ) {
      import("@axe-core/react").then((axe) => {
        axe.default(React, ReactDOM, 1000); // Initialize axe with a 1s delay
      });
    }
  }, []);

  // Check if the Component has a getLayout function
  // const getLayout = Component.getLayout || ((page) => page);

  // Handle page transitions
  useEffect(() => {
    if (!isMounted) return; // Only set up route change handlers after mount
    const handleRouteChangeStart = () => {
      document.documentElement.classList.add("js-page-transitioning");

      // Prefetch critical resources for the next page
      if (typeof window !== "undefined") {
        // Preload critical CSS
        const links = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]')
        );
        links.forEach((link) => {
          if (!link.hasAttribute("data-prefetched")) {
            const preloadLink = document.createElement("link");
            preloadLink.rel = "preload";
            preloadLink.as = "style";
            preloadLink.href = link.href;
            preloadLink.setAttribute("data-prefetched", "true");
            document.head.appendChild(preloadLink);
          }
        });
      }
    };

    const handleRouteChangeComplete = (url) => {
      document.documentElement.classList.remove("js-page-transitioning");

      // Track page view on route change
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", "G-LSLF7F9MS0", {
          page_path: url,
        });
      }

      // Report web vitals
      if (typeof window !== "undefined" && "performance" in window) {
        // Report LCP (Largest Contentful Paint)
        const performanceObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry && typeof window.gtag === "function") {
            // Send to analytics
            window.gtag("event", "web_vitals", {
              event_category: "Web Vitals",
              event_label: url,
              value: Math.round(lastEntry.startTime + lastEntry.duration),
              non_interaction: true,
            });
          }
        });

        performanceObserver.observe({
          type: "largest-contentful-paint",
          buffered: true,
        });
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [isMounted, router.events]);

  // Set different transition types based on route
  useEffect(() => {
    if (router.pathname.startsWith("/blog")) {
      setTransitionType("fade");
    } else if (router.pathname.startsWith("/projects")) {
      setTransitionType("slide");
    } else {
      setTransitionType("default");
    }
  }, [router.pathname]);

  // Initialize DOM loaded state
  useEffect(() => {
    setDomLoaded(true);

    // Add connection preload for Google Analytics
    const preconnectGA = document.createElement("link");
    preconnectGA.rel = "preconnect";
    preconnectGA.href = "https://www.googletagmanager.com";
    document.head.appendChild(preconnectGA);

    // Add connection preload for Google Fonts
    const preconnectGFonts = document.createElement("link");
    preconnectGFonts.rel = "preconnect";
    preconnectGFonts.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnectGFonts);

    // Add connection preload for Google Fonts resources
    const preconnectGStatic = document.createElement("link");
    preconnectGStatic.rel = "preconnect";
    preconnectGStatic.href = "https://fonts.gstatic.com";
    preconnectGStatic.crossOrigin = "anonymous";
    document.head.appendChild(preconnectGStatic);
  }, []);

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <div
          className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
        >
          <Nav />
          {isMounted ? (
            <AnimatePresence mode="wait" initial={false}>
              {isPageLoading ? (
                <LoadingFallback key="loading" />
              ) : (
                <Component {...pageProps} key={router.asPath} />
              )}
            </AnimatePresence>
          ) : (
            // Render component directly without AnimatePresence during SSR/build
            <Component {...pageProps} key={router.asPath} />
          )}
          <Footer />
          {/* ChatBot only on non-admin pages */}
          {showChatbot && <ChatBot />}
          <Toaster richColors closeButton position="top-right" />
          {/* Show cookie consent banner if no consent has been given */}

          <Analytics />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}

import "@/styles/globals.css";
import "highlight.js/styles/github-dark.css"; // Add highlight.js theme CSS
import Script from "next/script";
import { useRouter } from "next/router";
import React, { useEffect, useState, lazy, Suspense } from "react"; // Import React
import ReactDOM from "react-dom"; // Import ReactDOM for react-axe
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import ChatBot from "@/components/Chatbot";
// Dynamically import PageTransitionWrapper with no SSR
const PageTransitionWrapper = dynamic(
  () => import("@/components/PageTransitionWrapper"),
  { ssr: false }
);

// Configure the Inter font with display: swap for better performance
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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

// Simple loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse bg-gray-800 rounded-lg p-8">
      <div className="h-8 w-32 bg-gray-700 rounded mb-4"></div>
      <div className="h-4 w-64 bg-gray-700 rounded"></div>
    </div>
  </div>
);

// Define centralized toast options
const toastOptions = {
  toastOptions: {
    style: {
      background: "#1f2937", // gray-800
      color: "#f9fafb", // gray-50
      border: "1px solid #374151", // gray-700
    },
    classNames: {
      // Preserve existing classNames if any, or define default ones
      toast:
        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
      description: "group-[.toast]:text-muted-foreground",
      actionButton:
        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
      cancelButton:
        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      // Add specific classNames for success/error if desired, or rely on style
      success: "group-[.toast]:text-green-400", // Example: Tailwind text color
      error: "group-[.toast]:text-red-400", // Example: Tailwind text color
    },
  },
  // Define specific styles for success/error if classNames aren't enough
  success: {
    style: {
      background: "#047857", // emerald-700 (slightly darker green)
      color: "#d1fae5", // emerald-100 (light green text)
      border: "1px solid #065f46", // emerald-800
    },
  },
  error: {
    style: {
      background: "#b91c1c", // red-700 (slightly darker red)
      color: "#fee2e2", // red-100 (light red text)
      border: "1px solid #991b1b", // red-800
    },
  },
  // Add other types like info, warning if needed
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const [transitionType, setTransitionType] = useState("default");
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Universal loading indicator for page transitions
  useEffect(() => {
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
  }, [router]);

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
  const getLayout = Component.getLayout || ((page) => page);

  // Handle page transitions
  useEffect(() => {
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
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

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
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <main className={`${inter.variable} font-sans`}>
          {/* Google Analytics - load with higher priority */}
          <Script
            strategy="beforeInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-LSLF7F9MS0"
          />
          <Script id="google-analytics" strategy="beforeInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LSLF7F9MS0', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
          </Script>

          <Nav />
          {/* Universal loading overlay for page transitions */}
          {isPageLoading && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70">
              <svg
                className="animate-spin h-16 w-16 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div>
          )}
          {domLoaded ? (
            <Suspense fallback={<LoadingFallback />}>
              <PageTransitionWrapper transitionType={transitionType}>
                {getLayout(<Component {...pageProps} />)}
              </PageTransitionWrapper>
            </Suspense>
          ) : (
            <LoadingFallback />
          )}
          {/* Pass centralized toast options to Toaster */}
          <Toaster {...toastOptions} />
          <Footer />
          <ChatBot />
          <Analytics />
        </main>
      </SessionProvider>
    </QueryClientProvider>
  );
}

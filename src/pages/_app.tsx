import "@/styles/globals.css";
import "highlight.js/styles/atom-one-light.css";
import Script from "next/script";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  Inter,
  Space_Grotesk,
  Instrument_Serif,
} from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence } from "framer-motion";

const ChatBot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

const PageTransitionWrapper = dynamic(
  () => import("@/components/PageTransitionWrapper"),
  { ssr: false }
);

const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });

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

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  style: ["normal", "italic"],
  display: "swap",
  weight: "400"
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
});

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
    <div className="animate-pulse bg-white rounded-lg p-8 shadow-lg border border-gray-100">
      <div className="h-8 w-32 bg-gradient-to-r from-purple-200 to-blue-200 rounded mb-4"></div>
      <div className="h-4 w-64 bg-gradient-to-r from-gray-200 to-purple-200 rounded"></div>
    </div>
  </div>
);

const toastOptions = {
  toastOptions: {
    style: {
      background: "#ffffff",
      color: "#1f2937",
      border: "1px solid #e5e7eb",
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
      background: "#f0fdf4",
      color: "#166534",
      border: "1px solid #bbf7d0",
    },
  },
  error: {
    style: {
      background: "#fef2f2",
      color: "#991b1b",
      border: "1px solid #fecaca",
    },
  },
};

interface AppProps {
  Component: React.ComponentType<any> & { getLayout?: (page: React.ReactNode) => React.ReactNode };
  pageProps: any & { session?: any };
}

const App: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const [transitionType, setTransitionType] = useState("default");
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const showChatbot = isMounted && !router.pathname.startsWith("/admin");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
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

  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      typeof window !== "undefined"
    ) {
      import("@axe-core/react").then((axe) => {
        axe.default(React, ReactDOM, 1000);
      });
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const handleRouteChangeStart = () => {
      document.documentElement.classList.add("js-page-transitioning");

      if (typeof window !== "undefined") {
        const links = Array.from(
          document.querySelectorAll('link[rel="stylesheet"]')
        );
        links.forEach((link) => {
          if (!link.hasAttribute("data-prefetched")) {
            const preloadLink = document.createElement("link");
            preloadLink.rel = "preload";
            preloadLink.as = "style";
            preloadLink.href = (link as HTMLLinkElement).href;
            preloadLink.setAttribute("data-prefetched", "true");
            document.head.appendChild(preloadLink);
          }
        });
      }
    };

    const handleRouteChangeComplete = (url: string) => {
      document.documentElement.classList.remove("js-page-transitioning");

      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("config", "G-LSLF7F9MS0", {
          page_path: url,
        });
      }

      if (typeof window !== "undefined" && "performance" in window) {
        const performanceObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry && typeof (window as any).gtag === "function") {
            (window as any).gtag("event", "web_vitals", {
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

  useEffect(() => {
    if (router.pathname.startsWith("/blog")) {
      setTransitionType("fade");
    } else if (router.pathname.startsWith("/projects")) {
      setTransitionType("slide");
    } else {
      setTransitionType("default");
    }
  }, [router.pathname]);

  useEffect(() => {
    setDomLoaded(true);

    const preconnectGA = document.createElement("link");
    preconnectGA.rel = "preconnect";
    preconnectGA.href = "https://www.googletagmanager.com";
    document.head.appendChild(preconnectGA);

    const preconnectGFonts = document.createElement("link");
    preconnectGFonts.rel = "preconnect";
    preconnectGFonts.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnectGFonts);

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
          className={`${inter.variable} ${spaceGrotesk.variable} ${instrumentSerif.variable} font-sans antialiased`}
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
            <Component {...pageProps} key={router.asPath} />
          )}
          <Footer />
          {showChatbot && <ChatBot />}
          <CommandPalette />
          <Toaster richColors closeButton position="top-right" />
          <Analytics />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;

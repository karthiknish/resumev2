import "@/styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState, lazy, Suspense } from "react";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/react";

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

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);
  const [transitionType, setTransitionType] = useState("default");

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

      // Report web vitals
      if (typeof window !== "undefined" && "performance" in window) {
        // Report LCP (Largest Contentful Paint)
        const performanceObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            // Send to analytics
            gtag("event", "web_vitals", {
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
          {/* Google Analytics - load with high priority but non-blocking */}
          <Script
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-WR5RLSRK90"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WR5RLSRK90', {
                page_path: window.location.pathname,
              });
            `}
          </Script>

          <Nav />
          {domLoaded ? (
            <Suspense fallback={<LoadingFallback />}>
              <PageTransitionWrapper transitionType={transitionType}>
                {getLayout(<Component {...pageProps} />)}
              </PageTransitionWrapper>
            </Suspense>
          ) : (
            <LoadingFallback />
          )}
          <Footer />
          <Analytics />
        </main>
      </SessionProvider>
    </QueryClientProvider>
  );
}

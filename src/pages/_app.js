import "@/styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as gtag from "../lib/gtag";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const queryClient = new QueryClient();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        // Here you would typically validate the token with your backend
        // For now, we'll just set a simple session object
        setSession({ user: { token } });
      }
    };

    checkSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>

          <Nav />
          <div className="pt-24">
            <Component {...pageProps} session={session} />
          </div>
          <Footer />
        </>
      </SessionProvider>
    </QueryClientProvider>
  );
}

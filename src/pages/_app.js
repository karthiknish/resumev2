import "@/styles/globals.css";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "next-auth/react";

// Configure the Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Create a client
const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <main className={`${inter.variable} font-sans`}>
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
          <div>{domLoaded && <Component {...pageProps} />}</div>
          <Footer />
        </main>
      </SessionProvider>
    </QueryClientProvider>
  );
}

import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as gtag from "../lib/gtag";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
export default function App({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", (url) => handleRouteChange(url));
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-LSLF7F9MS0"
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-LSLF7F9MS0', {page_path: window.location.pathname,});`,
        }}
      />
      <SessionProvider>
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </SessionProvider>
    </>
  );
}

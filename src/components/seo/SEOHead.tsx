/**
 * Reusable SEO Head Component
 * Provides consistent meta tags across all pages
 */

import Head from "next/head";
import { useRouter } from "next/router";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  keywords?: string;
  author?: string;
  noIndex?: boolean;
  canonical?: string;
  children?: React.ReactNode;
}

const SITE_URL = "https://karthiknish.com";
const DEFAULT_TITLE = "Karthik Nishanth - Cross Platform Developer | Liverpool, UK";
const DEFAULT_DESCRIPTION = "Cross platform developer specializing in web and mobile applications. Building modern, scalable solutions with React, React Native, and cloud technologies.";
const DEFAULT_IMAGE = "https://karthiknish.com/Logo.png";

export function SEOHead({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  keywords,
  author = "Karthik Nishanth",
  noIndex = false,
  canonical,
  children,
}: SEOProps) {
  const router = useRouter();
  const currentUrl = url || `${SITE_URL}${router.asPath}`;
  const fullTitle = title ? `${title} | Karthik Nishanth` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Title */}
      <title>{fullTitle}</title>

      {/* Canonical URL */}
      <link rel="canonical" href={canonical || currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Karthik Nishanth" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@karthiknish" />
      <meta name="twitter:creator" content="@karthiknish" />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* Manifest */}
      <link rel="manifest" href="/site.webmanifest" />

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* Additional head children */}
      {children}
    </Head>
  );
}

// Simplified SEO component for auth pages
interface AuthPageSEOProps {
  title: string;
  description?: string;
}

export function AuthPageSEO({ title, description }: AuthPageSEOProps) {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title} | Karthik Nishanth</title>
      <meta
        name="description"
        content={description || "Sign in or create your account to get started."}
      />
      <meta name="robots" content="noindex, nofollow" />

      {/* Open Graph */}
      <meta property="og:title" content={`${title} | Karthik Nishanth`} />
      <meta
        property="og:description"
        content={description || "Sign in or create your account to get started."}
      />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={`${title} | Karthik Nishanth`} />

      {/* Theme */}
      <meta name="theme-color" content="#0f172a" />
    </Head>
  );
}

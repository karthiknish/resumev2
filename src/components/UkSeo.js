import Head from "next/head";
import { useRouter } from "next/router";

const UkSeo = ({
  title = "Full Stack Web Developer | React & Node.js Expert in UK",
  description = "UK-based Full Stack Developer specialising in React, Next.js, and Node.js development. Creating fast, responsive websites and applications for UK businesses.",
  keywords = "web developer UK, full stack developer, React developer London, Next.js expert UK, Node.js development Britain, JavaScript programmer England",
  ogType = "website",
  ogImage = "/images/profile-og.jpg",
  twitterHandle = "@yourtwitterhandle",
  canonical,
}) => {
  const router = useRouter();
  const path = router.asPath;
  const siteUrl = "https://www.yourdomain.co.uk";
  const canonicalUrl = canonical || `${siteUrl}${path}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Your Name" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* UK Locale */}
      <meta property="og:locale" content="en_GB" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="Your Name | Web Developer" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Geo tags for UK */}
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="London" />
      <meta name="geo.position" content="51.507;-0.127" />
      <meta name="ICBM" content="51.507, -0.127" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default UkSeo;

import { Html, Head, Main, NextScript } from "next/document";

const Document: React.FC = () => {
  return (
    <Html lang="en-GB">
      <Head>
        {/* Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* SEO */}
        <meta name="description" content="Karthik Nishanth - Cross platform developer specializing in web and mobile applications. Building modern, scalable solutions with React, React Native, and cloud technologies based in Liverpool, UK." />
        <meta name="keywords" content="Cross Platform Developer, Mobile App Development, Web Development, React, React Native, Node.js, TypeScript, Liverpool, UK, Freelance Developer" />
        <meta name="author" content="Karthik Nishanth" />
        <meta name="theme-color" content="#0f172a" />

        {/* Open Graph */}
        <meta property="og:title" content="Karthik Nishanth - Cross Platform Developer" />
        <meta property="og:description" content="Cross platform developer creating modern, scalable web and mobile solutions for businesses." />
        <meta property="og:image" content="https://karthiknish.com/Logo.png" />
        <meta property="og:url" content="https://karthiknish.com" />
        <meta property="og:site_name" content="Karthik Nishanth" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Karthik Nishanth - Cross Platform Developer" />
        <meta name="twitter:description" content="Cross platform developer creating modern, scalable web and mobile solutions for businesses." />
        <meta name="twitter:image" content="https://karthiknish.com/Logo.png" />
        <meta name="twitter:site" content="@karthiknish" />
        <meta name="twitter:creator" content="@karthiknish" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,600;1,400&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@100;200;300;400;500;600;700;800&family=Roboto:wght@100;300;400;500;700;900&display=optional"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=optional"
          rel="stylesheet"
        />

        {/* Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;

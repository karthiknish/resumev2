/**
 * Root Layout for Next.js App Router
 * Required for App Router pages to work alongside Pages Router
 *
 * SEO pages are located at /seo/services/[slug]
 */

import '../styles/globals.css';
import 'highlight.js/styles/atom-one-light.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

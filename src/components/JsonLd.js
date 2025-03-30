import { useRouter } from "next/router";

const JsonLd = ({ data }) => {
  const router = useRouter();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const createPersonSchema = (name = "Karthik Nishanth") => {
  // Updated default name
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    url: "https://karthiknish.com",
    jobTitle: "Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance", // Or your company name if applicable
    },
    sameAs: [
      // Updated social links
      "https://twitter.com/karthiknish", // Replace with actual handle if different
      "https://github.com/karthiknish",
      "https://www.linkedin.com/in/karthik-nishanth/",
    ],
    address: {
      // More specific location
      "@type": "PostalAddress",
      addressCountry: "GB", // Use ISO 3166-1 alpha-2 country code
      addressLocality: "Liverpool", // Use city
      // postalCode: "L1 XXX", // Optional: Add postal code if desired
    },
    nationality: {
      // Optional but good
      "@type": "Country",
      name: "United Kingdom",
    },
  };
};

export const createWebsiteSchema = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://karthiknish.com"; // Use env var
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Karthik Nishanth | Full Stack Developer", // Updated name
    alternateName: "Karthik Nishanth Portfolio", // Updated name
    url: siteUrl, // Use dynamic URL
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog/search?q={search_term_string}`, // Use dynamic URL
      "query-input": "required name=search_term_string",
    },
  };
};

export const createServiceSchema = (service) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: service.title,
    description: service.description,
    provider: {
      // Use Person schema reference
      "@type": "Person",
      name: "Karthik Nishanth", // Updated name
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://karthiknish.com", // Use env var
    },
    areaServed: {
      // More specific
      "@type": "Country",
      name: "GB", // Use ISO code
    },
    offers: {
      // Optional, but good if applicable
      "@type": "Offer",
      availability: "https://schema.org/OnlineOnly", // Assuming services are offered online/remotely
      areaServed: {
        "@type": "Country",
        name: "GB",
      },
    },
  };
};

export const createBlogPostingSchema = (post) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://karthiknish.com";
  const wordCount = post.content?.split(/\s+/).length || 0;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description, // Use description field from model
    image: post.imageUrl, // Use imageUrl field from model
    author: {
      // Use consistent author details
      "@type": "Person",
      name: "Karthik Nishanth",
      url: siteUrl,
    },
    publisher: {
      // Publisher can be Person or Organization
      "@type": "Person", // Change to Organization if you have one
      name: "Karthik Nishanth",
      url: siteUrl,
      // logo: { // Optional: Add logo if publisher is Organization
      //   "@type": "ImageObject",
      //   "url": `${siteUrl}/Logo.png`
      // }
    },
    datePublished: post.createdAt
      ? new Date(post.createdAt).toISOString()
      : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : post.createdAt
      ? new Date(post.createdAt).toISOString()
      : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`, // Use dynamic URL
    },
    keywords: post.tags?.join(", "), // Keep keywords
    articleBody: post.content, // Add article body
    wordCount: wordCount, // Add word count
    inLanguage: "en-GB", // Keep language
  };
};

export const createBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export default JsonLd;

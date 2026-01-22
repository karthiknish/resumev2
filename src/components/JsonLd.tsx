import React from "react";

interface JsonLdProps {
  data: Record<string, any>;
}

const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const createPersonSchema = (name = "Karthik Nishanth") => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    url: "https://karthiknish.com",
    jobTitle: "Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    sameAs: [
      "https://twitter.com/karthiknish",
      "https://github.com/karthiknish",
      "https://www.linkedin.com/in/karthik-nishanth/",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "GB",
      addressLocality: "Liverpool",
    },
    nationality: {
      "@type": "Country",
      name: "United Kingdom",
    },
  };
};

export const createWebsiteSchema = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://karthiknish.com";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Karthik Nishanth | Full Stack Developer",
    alternateName: "Karthik Nishanth Portfolio",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/blog/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
};

export const createServiceSchema = (service: { title: string; description: string }) => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Person",
      name: "Karthik Nishanth",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://karthiknish.com",
    },
    areaServed: {
      "@type": "Country",
      name: "GB",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/OnlineOnly",
      areaServed: {
        "@type": "Country",
        name: "GB",
      },
    },
  };
};

export const createBlogPostingSchema = (post: any) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://karthiknish.com";
  const wordCount = post.content?.split(/\s+/).length || 0;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.imageUrl,
    author: {
      "@type": "Person",
      name: "Karthik Nishanth",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Karthik Nishanth",
      url: siteUrl,
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
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.tags?.join(", "),
    articleBody: post.content,
    wordCount: wordCount,
    inLanguage: "en-GB",
  };
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const createBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item: BreadcrumbItem, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export default JsonLd;

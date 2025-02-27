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

export const createPersonSchema = (name = "Your Name") => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: name,
    url: "https://www.yourdomain.co.uk",
    jobTitle: "Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    sameAs: [
      "https://twitter.com/yourtwitterhandle",
      "https://github.com/yourgithubhandle",
      "https://www.linkedin.com/in/yourlinkedinhandle/",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "United Kingdom",
      addressRegion: "London",
      postalCode: "WC1X XXX", // Replace with real UK postal code
    },
    nationality: {
      "@type": "Country",
      name: "United Kingdom",
    },
  };
};

export const createWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Your Name | Full Stack Developer",
    alternateName: "Your Name Portfolio",
    url: "https://www.yourdomain.co.uk",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.yourdomain.co.uk/blog/search?q={search_term_string}",
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
      "@type": "Person",
      name: "Your Name",
      url: "https://www.yourdomain.co.uk",
    },
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      areaServed: "United Kingdom",
    },
  };
};

export const createBlogPostingSchema = (post) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      "@type": "Person",
      name: "Your Name",
      url: "https://www.yourdomain.co.uk",
    },
    publisher: {
      "@type": "Person",
      name: "Your Name",
      url: "https://www.yourdomain.co.uk",
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.yourdomain.co.uk/blog/${post.slug}`,
    },
    keywords: post.tags?.join(", "),
    inLanguage: "en-GB",
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

import React from "react";
import { FaPaintBrush } from "react-icons/fa";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const seo = {
  title: "Website Reskin & Modernization - Karthik Nishanth",
  description:
    "Transform your outdated website into a high-performing conversion machine without the cost of a full rebuild.",
  canonical: "https://karthiknish.com/services/website-reskin",
};

const hero = {
  icon: <FaPaintBrush className="h-6 w-6" />,
  eyebrow: "Service",
  title: "Breathe new life into your digital presence",
  description:
    "Your content is valuable, but your design might be holding you back. I help you revitalize your brand and user experience while preserving your investment in existing functionality.",
  primaryAction: {
    label: "Start a reskin",
    href: "/contact?subject=Website%20Reskin%20Project",
  },
  secondaryAction: {
    label: "Explore all services",
    href: "/services",
  },
};

const highlights = [
  {
    title: "Cost Efficient",
    description:
      "Achieve a modern, high-end look at a fraction of the cost and time of a complete platform rebuild.",
  },
  {
    title: "Content Preserved",
    description:
      "We keep what works—your copy, SEO authority, and core features—while drastically improving the wrapper.",
  },
  {
    title: "Performance First",
    description:
      "Modern code and optimization standards baked into the redesign for faster load times and better rankings.",
  },
];

const keyFeatures = [
  "Stunning visual redesign aligned with your brand voice",
  "Fully responsive layout for perfect cross-device viewing",
  "Improved User Experience (UX) to guide visitor actions",
  "Modern UI components and smooth interactive elements",
  "Enhanced accessibility and inclusive design standards",
  "SEO improvements for better organic search visibility",
  "Integration with modern, high-performance web stacks",
  "Optimized Lighthouse scores and performance benchmarks",
];

const process = [
  {
    title: "Design Audit",
    description:
      "A thorough review of your current site to identify UI friction points and opportunities for visual elevation.",
  },
  {
    title: "Visual Refresh",
    description:
      "Implementing a modern design system with refined typography, spacing, and brand-aligned aesthetics.",
  },
  {
    title: "Optimization",
    description:
      "Fine-tuning code and assets to ensure the new look is matched by superior performance and SEO support.",
  },
];

const outcomes = [
  "A revitalized, modern look that builds instant trust",
  "Significant improvements in performance and SEO scores",
  "Increased user engagement and conversion pathways",
  "Faster turnaround than a traditional full-site rebuild",
  "A future-proofed technical foundation that's easy to scale",
];

const toolset = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "Framer Motion",
  "GSAP",
  "Vercel",
  "Lighthouse Audit",
  "SEO Pro",
];

const cta = {
  heading: "Ready to revitalize your online presence?",
  body: "Let's turn your outdated website into a high-performing conversion machine that reflects the quality of your work.",
  primaryAction: {
    label: "Request a design audit",
    href: "/contact?subject=Website%20Reskin%20Audit",
  },
  secondaryAction: {
    label: "← Back to services",
    href: "/services",
  },
};

export default function WebsiteReskinService() {
  return (
    <div className="pt-12 md:pt-20">
      <ServicePageLayout
        seo={seo}
        hero={hero}
        highlights={highlights}
        keyFeatures={keyFeatures}
        process={process}
        outcomes={outcomes}
        toolset={toolset}
        cta={cta}
      />
    </div>
  );
}

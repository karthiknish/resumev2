import React from "react";
import { FaGlobe } from "react-icons/fa";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const seo = {
  title: "Professional Brochure Websites - Karthik Nishanth",
  description:
    "Establish your online presence with a stunning, custom-built website that showcases your services and builds credibility.",
  canonical: "https://karthiknish.com/services/brochure-websites",
};

const hero = {
  icon: <FaGlobe className="h-6 w-6" />,
  eyebrow: "Service",
  title: "Digital cornerstones for growing businesses",
  description:
    "A brochure website is your digital business card, available 24/7. I ensure your site is visually appealing, performant, and easy for your potential clients to navigate.",
  primaryAction: {
    label: "Start your website",
    href: "/contact?subject=Brochure%20Website%20Project",
  },
  secondaryAction: {
    label: "View all services",
    href: "/services",
  },
};

const highlights = [
  {
    title: "Brand Alignment",
    description:
      "Every design choice is made to reflect your unique brand identity and professional values.",
  },
  {
    title: "Conversion Focused",
    description:
      "Strategic layouts and clear calls-to-action designed to turn visitors into inquiries.",
  },
  {
    title: "Instant Credibility",
    description:
      "Make a powerful first impression with high-end aesthetics and flawless performance.",
  },
];

const keyFeatures = [
  "Unique custom design reflecting your brand identity",
  "Mobile-first responsive layout for all screen sizes",
  "Basic SEO optimization to improve search engine visibility",
  "Clear calls-to-action to encourage user engagement",
  "Fast loading times and optimized performance",
  "Secure contact forms and lead capture functionality",
  "Social media integration and professional email setup",
  "Clean, well-structured code for easy maintenance",
];

const process = [
  {
    title: "Brand Discovery",
    description:
      "We start by understanding your brand identity, target audience, and business goals to ensure the design hits the mark.",
  },
  {
    title: "Design & Develop",
    description:
      "I build a premium, responsive showcase that effectively communicates your value proposition and services.",
  },
  {
    title: "Launch & Optimize",
    description:
      "Deployment to high-performance hosting with SEO best practices and performance benchmarks met.",
  },
];

const outcomes = [
  "A stunning, responsive brochure website that builds trust",
  "Optimized performance and SEO baseline foundation",
  "Clear lead generation pathways and contact integration",
  "Social proof and service showcases that drive engagement",
  "Full ownership and easy-to-manage technical setup",
];

const toolset = [
  "Next.js",
  "React",
  "Tailwind CSS",
  "Framer Motion",
  "Vercel",
  "Google Analytics",
  "SEO Tools",
  "Postmark / Resend",
];

const cta = {
  heading: "Ready to establish your professional online presence?",
  body: "Let's create a stunning brochure website that showcases your business and attracts new customers with style.",
  primaryAction: {
    label: "Discuss your project",
    href: "/contact?subject=Brochure%20Website%20Inquiry",
  },
  secondaryAction: {
    label: "← Back to services",
    href: "/services",
  },
};

export default function BrochureWebsiteService() {
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

import React from "react";
import { FaStore } from "react-icons/fa";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const seo = {
  title: "E-commerce Solutions - Karthik Nishanth",
  description:
    "Build a powerful online store that drives sales and growth with a seamless shopping experience for your customers.",
  canonical: "https://karthiknish.com/services/ecommerce-solutions",
};

const hero = {
  icon: <FaStore className="h-6 w-6" />,
  eyebrow: "Service",
  title: "Custom storefronts that drive high-volume growth",
  description:
    "From product catalogs to secure checkouts, I build scalable eCommerce engines that combine high-end aesthetics with robust transaction logic.",
  primaryAction: {
    label: "Start your store",
    href: "/contact?subject=Ecommerce%20Project%20Inquiry",
  },
  secondaryAction: {
    label: "View all services",
    href: "/services",
  },
};

const highlights = [
  {
    title: "Checkout Mastery",
    description:
      "Reduced friction pathways designed to maximize conversion rates and delight shoppers.",
  },
  {
    title: "Secure & Scalable",
    description:
      "PCI-compliant architectures built to handle peak traffic and protect your customer data.",
  },
  {
    title: "Inventory Power",
    description:
      "Modern management backends that give you total control over products, orders, and fulfillment.",
  },
];

const keyFeatures = [
  "Intuitive product catalog & categorization systems",
  "Secure payment gateway integration (Stripe, PayPal, etc.)",
  "Advanced user accounts & order tracking dashboard",
  "Mobile-first responsive design for any shopping device",
  "Real-time inventory mapping and stock management",
  "Automated shipping logic and tax calculation engines",
  "Customer reviews, ratings, and social proof integration",
  "Rich analytics pipelines for sales and reporting",
];

const process = [
  {
    title: "Store Strategy",
    description:
      "We map out your product flows, categories, and customer journeys to ensure a conversion-led shopping experience.",
  },
  {
    title: "Secure Build",
    description:
      "Implementing robust transaction logic, secure handling of customer data, and high-performance frontend interfaces.",
  },
  {
    title: "Fulfillment Sync",
    description:
      "Integrating shipping, tax, and notification systems to create a seamless end-to-end operational workflow.",
  },
];

const outcomes = [
  "A high-performing, secure eCommerce platform built to sell",
  "Increased conversion rates through frictionless checkout flows",
  "Automated inventory and order management procedures",
  "Scalable technical architecture ready for high traffic",
  "Actionable sales data and customer insight dashboards",
];

const toolset = [
  "Next.js",
  "React",
  "Node.js",
  "MongoDB / PostgreSQL",
  "Stripe & PayPal",
  "Tailwind CSS",
  "Framer Motion",
  "Redis Caching",
];

const cta = {
  heading: "Ready to dominate the digital marketplace?",
  body: "Let's build the powerful online store your brand deserves—optimized for performance and engineered for sales.",
  primaryAction: {
    label: "Discuss your storefront",
    href: "/contact?subject=Ecommerce%20Storefront%20Inquiry",
  },
  secondaryAction: {
    label: "← Back to services",
    href: "/services",
  },
};

export default function EcommerceSolutionsService() {
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

// Converted to TypeScript - migrated
import React from "react";
import { FaRocket } from "react-icons/fa";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const seo = {
  title: "Web Performance Optimization Services - Karthik Nishanth",
  description:
    "Full-stack performance engineering focused on Core Web Vitals, latency, and resilient delivery pipelines.",
  canonical: "https://karthiknish.com/services/performance-optimization",
};

const hero = {
  icon: <FaRocket className="h-6 w-6" />,
  eyebrow: "Service",
  title: "Performance that keeps users engaged",
  description:
    "Diagnose and resolve bottlenecks across the stack—front to back—to deliver experiences that feel instant and trustworthy.",
  primaryAction: {
    label: "Book a performance audit",
    href: "/contact?subject=Performance%20Audit",
  },
  secondaryAction: {
    label: "See the full service lineup",
    href: "/services",
  },
};

const highlights = [
  {
    title: "Visibility first",
    description:
      "Observability dashboards that surface degradations early and keep stakeholders aligned on improvements.",
  },
  {
    title: "Holistic tuning",
    description:
      "From bundle budgets to server response, every layer is measured, optimized, and validated against KPIs.",
  },
  {
    title: "Sustainable gains",
    description:
      "Workflows, alerts, and documentation that ensure teams maintain performance long after the engagement ends.",
  },
];

const keyFeatures = [
  "Core Web Vitals audits with prioritized remediation plans",
  "Bundle analysis, code splitting, and lazy-loading strategies",
  "Edge caching, CDN configuration, and content invalidation workflows",
  "Server-side profiling, database tuning, and queue optimisation",
  "Image/CDN pipelines with modern formats and responsive assets",
  "Third-party script governance and impact reporting",
  "Synthetic and real-user monitoring integration",
  "Performance budgets embedded into CI/CD pipelines",
];

const process = [
  {
    title: "Baseline & instrumentation",
    description:
      "Establish KPIs, set up measuring tools, and map the user journeys that matter most to your business.",
  },
  {
    title: "Optimization sprints",
    description:
      "Execute targeted improvements with before/after reporting, code reviews, and knowledge transfer for your team.",
  },
  {
    title: "Operational handoff",
    description:
      "Document guardrails, dashboards, and alerting so performance remains a habit not a one-off project.",
  },
];

const outcomes = [
  "Performance scorecards with quantifiable business impact",
  "Updated infrastructure configs, caching policies, and deployment scripts",
  "Component-level guidelines for designers and engineers",
  "Monitoring dashboards and alert thresholds owned by your team",
  "Executive summary communicating results to stakeholders",
];

const toolset = [
  "Lighthouse & PageSpeed Insights",
  "WebPageTest & Sitespeed.io",
  "Chrome DevTools & React Profiler",
  "New Relic & Datadog",
  "AWS CloudFront & Fastly",
  "Redis & Varnish",
  "Webpack Bundle Analyzer",
  "GitHub Actions & Canary Deploys",
];

const cta = {
  heading: "Let’s make slow load times a thing of the past",
  body: "Schedule a performance consultation and we’ll put together a plan that protects both UX and conversion goals.",
  primaryAction: {
    label: "Request a performance review",
    href: "/contact?subject=Performance%20Optimization%20Review",
  },
  secondaryAction: {
    label: "Review other services",
    href: "/services",
  },
};

export default function PerformanceOptimizationService() {
  return (
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
  );
}


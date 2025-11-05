import React from "react";
import { FaCode } from "react-icons/fa";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const seo = {
  title: "Frontend Development Services - Karthik Nishanth",
  description:
    "Frontend engineering that blends aesthetics, accessibility, and performance for modern web experiences.",
  canonical: "https://karthiknish.com/services/frontend-development",
};

const hero = {
  icon: <FaCode className="h-6 w-6" />,
  eyebrow: "Service",
  title: "Frontend engineering that feels effortless",
  description:
    "Ship interfaces your users love and your team can maintain. From design handoff to production, I build performant, accessible, and future-friendly frontends.",
  primaryAction: {
    label: "Plan a discovery call",
    href: "/contact?subject=Frontend%20Development%20Discovery",
  },
  secondaryAction: {
    label: "Browse all services",
    href: "/services",
  },
};

const highlights = [
  {
    title: "Interfaces that convert",
    description:
      "Collaborative design-to-code workflows that keep marketing, design, and engineering aligned at every iteration.",
  },
  {
    title: "Performance-first builds",
    description:
      "Render pipelines tuned for Core Web Vitals, edge caching strategies, and predictable deploys you can trust.",
  },
  {
    title: "Accessible by default",
    description:
      "Every component ships with sensible defaults, semantic markup, and assistive tech support baked in from the start.",
  },
];

const keyFeatures = [
  "Responsive layouts that adapt gracefully to every viewport",
  "Design system implementation across web properties",
  "SPA and hybrid routing with Next.js and React",
  "Progressive Web Apps with offline support and installability",
  "Performance budgets, tracing, and continual improvements",
  "State management tailored to your team (Redux, Zustand, SWR)",
  "Animation and micro-interaction design with Framer Motion",
  "WCAG-compliant patterns, focus management, and keyboard flows",
];

const process = [
  {
    title: "Discovery & audit",
    description:
      "Assess existing UI, technical debt, and design assets to uncover quick wins and longer-term opportunities.",
  },
  {
    title: "Design handoff & alignment",
    description:
      "Translate Figma files into component specs, accessibility notes, and delivery timelines your stakeholders can review asynchronously.",
  },
  {
    title: "Build, test, iterate",
    description:
      "Ship in weekly increments with visual regression testing, performance reporting, and feedback loops that keep teams aligned.",
  },
];

const outcomes = [
  "Reusable component library mapped to your brand system",
  "Production-ready pages deployed to your hosting of choice",
  "Lighthouse and Core Web Vitals improvements with before/after reporting",
  "Documented patterns for accessibility, state, and content workflows",
  "Team onboarding materials to keep momentum after hand-off",
];

const toolset = [
  "React & Next.js",
  "TypeScript",
  "Tailwind CSS & shadcn/ui",
  "Framer Motion",
  "Storybook & Chromatic",
  "Playwright & Testing Library",
  "Vercel & Netlify",
  "Segment & GA4 instrumentation",
];

const cta = {
  heading: "Need a frontend lead who ships without the fire drills?",
  body: "Let’s scope the next milestone together and build a frontend foundation your team can scale.",
  primaryAction: {
    label: "Book a consultation",
    href: "/contact?subject=Frontend%20Development%20Consultation",
  },
  secondaryAction: {
    label: "See other services",
    href: "/services",
  },
};

export default function FrontendDevelopmentService() {
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

// Converted to TypeScript - migrated
import React from "react";
import { FaMobileAlt } from "react-icons/fa";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const seo = {
  title: "Mobile App Development Services - Karthik Nishanth",
  description:
    "Cross-platform mobile apps with native polish, rapid delivery, and reliable lifecycle support.",
  canonical: "https://karthiknish.com/services/mobile-app-development",
};

const hero = {
  icon: <FaMobileAlt className="h-6 w-6" />,
  eyebrow: "Service",
  title: "Mobile experiences built for real-world usage",
  description:
    "Deliver performant, device-aware applications that feel right at home on iOS and Android while sharing a unified codebase.",
  primaryAction: {
    label: "Request a mobile roadmap",
    href: "/contact?subject=Mobile%20App%20Roadmap",
  },
  secondaryAction: {
    label: "View service menu",
    href: "/services",
  },
};

const highlights = [
  {
    title: "Native look and feel",
    description:
      "Interfaces tailored to each platform with shared logic underneath, so users never notice the difference.",
  },
  {
    title: "Lifecycle coverage",
    description:
      "From prototypes to store submissions and post-launch updates, every phase of your app has a plan.",
  },
  {
    title: "Data confidence",
    description:
      "Offline sync, secure storage, and analytics pipelines give you insight without sacrificing performance.",
  },
];

const keyFeatures = [
  "React Native and Expo builds targeting iOS and Android",
  "UX flows optimized for touch, gestures, and accessibility",
  "Offline-first architecture with background sync",
  "Push notifications, deep links, and in-app messaging",
  "Native module integration for camera, payments, and sensors",
  "Automated testing across devices and CI pipelines",
  "App store preparation, submission, and release management",
  "Iterative delivery with analytics-driven improvements",
];

const process = [
  {
    title: "Product framing",
    description:
      "Clarify user journeys, success metrics, and technical constraints to ensure the build aligns with business goals.",
  },
  {
    title: "Build & integrate",
    description:
      "Implement features in weekly slices with continuous QA, stakeholder demos, and flexible prioritisation.",
  },
  {
    title: "Launch & evolve",
    description:
      "Guide you through store approvals, monitoring, and fast follow releases based on real-world usage.",
  },
];

const outcomes = [
  "Store-ready binaries with documented release procedures",
  "Analytics dashboards highlighting engagement and retention",
  "Incident response playbook covering crashes and hotfixes",
  "Performance benchmarks and device compatibility matrix",
  "Team handover session with ongoing maintenance options",
];

const toolset = [
  "React Native & Expo",
  "TypeScript",
  "React Navigation",
  "Redux Toolkit & Zustand",
  "Realm & SQLite",
  "Firebase & Supabase",
  "App Center & EAS",
  "RevenueCat & Stripe",
];

const cta = {
  heading: "Let’s build the mobile app your users keep coming back to",
  body: "From proof-of-concept to scale, I’ll help you ship an experience that feels native, stable, and delightful.",
  primaryAction: {
    label: "Start a mobile engagement",
    href: "/contact?subject=Mobile%20App%20Engagement",
  },
  secondaryAction: {
    label: "Compare service tiers",
    href: "/services",
  },
};

export default function MobileAppDevelopmentService() {
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


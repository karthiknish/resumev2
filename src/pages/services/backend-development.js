import React from "react";
import { FaServer } from "react-icons/fa";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const seo = {
  title: "Backend Development Services - Karthik Nishanth",
  description:
    "Scalable backend systems engineered for reliability, security, and developer happiness.",
  canonical: "https://karthiknish.com/services/backend-development",
};

const hero = {
  icon: <FaServer className="h-6 w-6" />,
  eyebrow: "Service",
  title: "Backend platforms that scale without drama",
  description:
    "Architect and implement services that stay resilient under load, integrate cleanly with your product, and give your team confidence to ship faster.",
  primaryAction: {
    label: "Schedule a technical audit",
    href: "/contact?subject=Backend%20Development%20Audit",
  },
  secondaryAction: {
    label: "Explore the services catalog",
    href: "/services",
  },
};

const highlights = [
  {
    title: "API foundations",
    description:
      "Schema design, versioning strategies, and developer-first documentation to keep integrations effortless.",
  },
  {
    title: "Operational excellence",
    description:
      "Monitoring, alerting, and tracing wired in from day one so issues surface before they impact users.",
  },
  {
    title: "Security baked in",
    description:
      "Authentication flows, permissions, and threat modeling aligned with compliance needs and best practices.",
  },
];

const keyFeatures = [
  "REST and GraphQL services designed for clear contracts",
  "Authentication, authorization, and session management",
  "Data modeling across relational and document databases",
  "Event-driven systems with queues, streams, and workers",
  "Infrastructure-as-code and repeatable deployments",
  "Automated testing suites and contract validation",
  "Continuous delivery pipelines and preview environments",
  "Observability dashboards with actionable metrics",
];

const process = [
  {
    title: "Architecture planning",
    description:
      "Map business requirements to a service architecture with trade-off discussions your stakeholders can understand.",
  },
  {
    title: "Build & harden",
    description:
      "Implement domain logic, data flows, and security layers with pairing sessions and async updates for your team.",
  },
  {
    title: "Deploy & support",
    description:
      "Roll out with staged releases, load testing, and runbooks so handover feels seamless instead of stressful.",
  },
];

const outcomes = [
  "Documented services your engineers can extend confidently",
  "Production deployments with monitoring, alerts, and dashboards",
  "Performance benchmarks and scalability headroom reports",
  "Security reviews with actionable remediation plans",
  "Internal onboarding guide for future contributors",
];

const toolset = [
  "Node.js & TypeScript",
  "Express, Fastify, NestJS",
  "PostgreSQL, MySQL, MongoDB",
  "Redis & in-memory caching",
  "Apache Kafka, RabbitMQ",
  "Docker & Kubernetes",
  "AWS (ECS, Lambda, RDS)",
  "Terraform & GitHub Actions",
];

const cta = {
  heading: "Ready to shore up the backbone of your product?",
  body: "Let’s design an architecture that moves as fast as your roadmap without compromising reliability.",
  primaryAction: {
    label: "Start a backend project",
    href: "/contact?subject=Backend%20Development%20Project",
  },
  secondaryAction: {
    label: "Compare service offerings",
    href: "/services",
  },
};

export default function BackendDevelopmentService() {
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

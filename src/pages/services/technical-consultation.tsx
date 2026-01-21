// Converted to TypeScript - migrated
import React from "react";
import { FaTools } from "react-icons/fa";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const seo = {
  title: "Technical Consultation Services - Karthik Nishanth",
  description:
    "Independent technical leadership to de-risk architecture decisions, roadmap delivery, and engineering culture.",
  canonical: "https://karthiknish.com/services/technical-consultation",
};

const hero = {
  icon: <FaTools className="h-6 w-6" />,
  eyebrow: "Service",
  title: "Strategic technical guidance without the hiring overhead",
  description:
    "Partner with a hands-on lead who can untangle legacy systems, align stakeholders, and chart a path your team can follow.",
  primaryAction: {
    label: "Schedule a strategy session",
    href: "/contact?subject=Technical%20Strategy%20Session",
  },
  secondaryAction: {
    label: "View all services",
    href: "/services",
  },
};

const highlights = [
  {
    title: "Objective insights",
    description:
      "Unbiased assessments grounded in real-world delivery, not vendor quotas or one-size-fits-all playbooks.",
  },
  {
    title: "Execution ready",
    description:
      "Recommendations come with implementation plans, staffing considerations, and risk mitigation strategies.",
  },
  {
    title: "Team enablement",
    description:
      "Workshops, documentation, and tooling help your engineers internalize improvements long after the engagement concludes.",
  },
];

const keyFeatures = [
  "Architecture reviews with actionable remediation plans",
  "Technology stack comparisons tailored to budget and timelines",
  "Codebase audits covering quality, security, and maintainability",
  "Process design for async collaboration, sprint cadence, and QA",
  "Roadmapping for product-market milestones and technical debt",
  "Due diligence for mergers, acquisitions, and investor reporting",
  "Team skills assessment and upskilling initiatives",
  "Vendor and tool selection with ROI modelling",
];

const process = [
  {
    title: "Discovery & alignment",
    description:
      "Interview stakeholders, review artifacts, and surface the goals and constraints shaping your technology decisions.",
  },
  {
    title: "Analysis & recommendations",
    description:
      "Deliver a prioritized plan covering architecture, tooling, process, and people, calibrated to your organisation’s reality.",
  },
  {
    title: "Enable & support",
    description:
      "Run working sessions, pair with teams, and monitor adoption so the strategy translates into sustainable practice.",
  },
];

const outcomes = [
  "Executive-ready briefing distilling risks, options, and trade-offs",
  "Detailed implementation roadmap with sequencing and owners",
  "Decision logs and design docs stored in your knowledge base",
  "Playbooks and checklists for recurring processes and ceremonies",
  "Follow-up checkpoints to keep accountability and momentum",
];

const toolset = [
  "Architecture modelling (C4, ADRs)",
  "AWS, GCP & Azure solution design",
  "Confluence & Notion knowledge hubs",
  "Linear, Jira, and Shortcut workflows",
  "GitHub Actions & CircleCI",
  "Terraform & Pulumi",
  "SonarQube & Snyk scanning",
  "Miro & FigJam facilitation",
];

const cta = {
  heading: "Need a sounding board for your next technical leap?",
  body: "Book a consultation and I’ll help you evaluate options, align stakeholders, and plot a confident path forward.",
  primaryAction: {
    label: "Partner on strategy",
    href: "/contact?subject=Technical%20Consultation%20Partnership",
  },
  secondaryAction: {
    label: "Browse other specialties",
    href: "/services",
  },
};

export default function TechnicalConsultationService() {
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


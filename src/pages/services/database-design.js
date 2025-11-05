import React from "react";
import { FaDatabase } from "react-icons/fa";
import ServicePageLayout from "@/components/services/ServicePageLayout";

const seo = {
  title: "Database Design & Management Services - Karthik Nishanth",
  description:
    "Design, optimize, and operate data platforms that scale with your product and keep critical workloads resilient.",
  canonical: "https://karthiknish.com/services/database-design",
};

const hero = {
  icon: <FaDatabase className="h-6 w-6" />,
  eyebrow: "Service",
  title: "Data architectures that stay fast as you grow",
  description:
    "Whether you’re refactoring a legacy system or launching greenfield functionality, I’ll help you design data foundations that stay reliable under pressure.",
  primaryAction: {
    label: "Request a data consultation",
    href: "/contact?subject=Database%20Consultation",
  },
  secondaryAction: {
    label: "Return to services",
    href: "/services",
  },
};

const highlights = [
  {
    title: "Purpose-built schemas",
    description:
      "Model data around business workflows to reduce complexity and unlock faster iteration across teams.",
  },
  {
    title: "Operational excellence",
    description:
      "Backups, failover, and observability built-in so data incidents become rare and recoverable.",
  },
  {
    title: "Cloud ready",
    description:
      "Managed database services, infrastructure-as-code, and automation to keep environments consistent across regions.",
  },
];

const keyFeatures = [
  "Relational schema design with normalization where it matters",
  "NoSQL modelling for high-throughput and flexible schemas",
  "Query profiling, indexing strategies, and performance tuning",
  "Data migration planning, dry runs, and cutover support",
  "Backup, retention, and disaster recovery workflows",
  "Security hardening, encryption, and access governance",
  "Data warehousing and analytics pipelines",
  "Documentation and onboarding for ongoing maintenance",
];

const process = [
  {
    title: "Assess & benchmark",
    description:
      "Review current data flows, pain points, and SLAs. Capture metrics to define what good looks like for your organization.",
  },
  {
    title: "Design & implement",
    description:
      "Create migration-safe schemas, stored procedures, and automation with pairing sessions for your team.",
  },
  {
    title: "Enable & monitor",
    description:
      "Roll out monitoring dashboards, runbooks, and training so operations stay smooth long after delivery.",
  },
];

const outcomes = [
  "Entity relationship diagrams and data dictionaries",
  "Performance reports with before/after benchmarks",
  "Infrastructure configs (Terraform/CloudFormation) checked into your repos",
  "Automated backup, retention, and restore procedures",
  "Knowledge transfer workshops and future roadmap recommendations",
];

const toolset = [
  "PostgreSQL & MySQL",
  "SQL Server & Oracle",
  "MongoDB & DynamoDB",
  "Amazon RDS & Aurora",
  "BigQuery & Snowflake",
  "Airflow & dbt",
  "Prisma & Sequelize",
  "Grafana & Prometheus",
];

const cta = {
  heading: "Let’s make your data infrastructure a competitive advantage",
  body: "Reach out and we’ll chart a data architecture plan that balances velocity, reliability, and cost.",
  primaryAction: {
    label: "Start a database project",
    href: "/contact?subject=Database%20Design%20Project",
  },
  secondaryAction: {
    label: "Explore more services",
    href: "/services",
  },
};

export default function DatabaseDesignService() {
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

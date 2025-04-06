import React from "react";
import Head from "next/head";
import Link from "next/link";
import { CheckCircle } from "lucide-react"; // Import relevant icon
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Hardcoded data for this specific sample project
const project = {
  id: "startup-infrastructure",
  title: "Startup Infrastructure",
  meta: "10x Scale",
  description:
    "Designed and implemented a highly scalable cloud infrastructure for a fast-growing startup, enabling them to handle exponential user growth and maintain high availability.",
  longDescription:
    "The challenge was to migrate the startup's existing monolithic application to a scalable, resilient cloud architecture on AWS. We designed a microservices-based system using Docker containers orchestrated with Kubernetes (EKS). Key components included load balancers, auto-scaling groups, managed databases (RDS), and a CI/CD pipeline using Jenkins and GitHub Actions. This new infrastructure allowed the startup to scale seamlessly from 10,000 to over 100,000 active users while improving deployment frequency and system stability.",
  icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
  status: "Updated",
  tags: [
    "Architecture",
    "Scaling",
    "AWS",
    "Kubernetes",
    "Docker",
    "CI/CD",
    "Microservices",
  ],
  // image: "/path/to/startup-infra-image.png",
  extlink: "#", // Placeholder link
};

export default function StartupInfrastructureProject() {
  return (
    <>
      <Head>
        <title>{project.title} - Project Details</title>
        <meta name="description" content={project.description} />
      </Head>
      <PageContainer>
        <div className="min-h-screen bg-black text-white p-8 md:p-16">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-4">
                <span className="mr-4">{project.icon}</span>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {project.title}
                </h1>
              </div>
              <div className="mb-6">
                <Badge
                  variant="outline"
                  className="text-emerald-400 border-emerald-400 mr-2"
                >
                  {project.status}
                </Badge>
                <span className="text-sm text-gray-400">{project.meta}</span>
              </div>

              <Separator className="my-6 bg-gray-700" />

              {/* Optional Image Section */}
              {/* {project.image && (
                <div className="mb-8">
                  <Image src={project.image} alt={project.title} width={800} height={450} className="rounded-lg shadow-lg" />
                </div>
              )} */}

              <h2 className="text-2xl font-semibold text-emerald-400 mb-3">
                Project Overview
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                {project.longDescription || project.description}
              </p>

              {/* --- Added Sections Start --- */}
              <h2 className="text-2xl font-semibold text-emerald-400 mt-8 mb-3">
                Challenges Faced
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                The startup's rapid growth exposed critical limitations in their
                initial setup:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                <li>
                  <strong>Scalability Issues:</strong> The monolithic
                  architecture couldn't handle increasing user traffic
                  efficiently.
                </li>
                <li>
                  <strong>Deployment Bottlenecks:</strong> Manual, infrequent
                  deployments were slow, risky, and hindered feature velocity.
                </li>
                <li>
                  <strong>Availability Concerns:</strong> Infrastructure
                  struggled during peak loads, leading to potential downtime.
                </li>
                <li>
                  <strong>Inefficient Scaling:</strong> Lack of automated
                  scaling resulted in either over-provisioning or performance
                  degradation.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-emerald-400 mt-8 mb-3">
                Solutions Implemented
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                We engineered a modern, cloud-native infrastructure on AWS:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                <li>
                  <strong>Microservices Migration:</strong> Decomposed the
                  monolith into microservices deployed on AWS EKS (Kubernetes).
                </li>
                <li>
                  <strong>Containerization:</strong> Utilized Docker for
                  consistent application packaging and deployment.
                </li>
                <li>
                  <strong>Auto-Scaling:</strong> Implemented auto-scaling groups
                  for EC2 instances and RDS read replicas.
                </li>
                <li>
                  <strong>CI/CD Automation:</strong> Built a robust CI/CD
                  pipeline using Jenkins & GitHub Actions for automated builds,
                  tests, and deployments.
                </li>
                <li>
                  <strong>Managed Services:</strong> Leveraged AWS managed
                  services (RDS, ELB, S3) to enhance reliability and reduce
                  operational overhead.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-emerald-400 mt-8 mb-3">
                Key Results
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                The new infrastructure delivered transformative results for the
                startup:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
                <li>
                  <strong>Seamless Scaling:</strong> Effortlessly handled a 10x
                  increase in active users without performance issues.
                </li>
                <li>
                  <strong>High Availability:</strong> Achieved and maintained
                  99.95% system uptime.
                </li>
                <li>
                  <strong>Faster Deployments:</strong> Reduced deployment times
                  significantly, enabling faster feature releases.
                </li>
                <li>
                  <strong>Cost Optimization:</strong> Lowered overall
                  infrastructure costs through efficient, automated resource
                  scaling.
                </li>
              </ul>
              {/* --- Added Sections End --- */}

              <h2 className="text-2xl font-semibold text-emerald-400 mb-3">
                Key Technologies & Skills
              </h2>
              <div className="flex flex-wrap gap-2 mb-12">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap gap-4">
                {project.extlink && project.extlink !== "#" && (
                  <Link
                    href={project.extlink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md transition-colors"
                  >
                    View Details/Demo → {/* Changed CTA */}
                  </Link>
                )}
                <Link
                  href="/#projects"
                  className="inline-block px-6 py-3 border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold rounded-md transition-colors"
                >
                  ← Back to Projects
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}

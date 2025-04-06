import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaTools } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

// Data specific to this service
const service = {
  icon: <FaTools className="text-5xl mb-4" style={{ color: "#3178C6" }} />,
  title: "Technical Consultation",
  description:
    "Providing expert advice and strategic guidance on technology stack selection, software architecture design, development best practices, and project planning.",
  features: [
    "Technology stack evaluation and recommendations",
    "Software architecture design and review",
    "Code reviews and quality assurance guidance",
    "Implementation of development best practices",
    "Technical documentation and specification writing",
    "Project feasibility analysis and roadmap planning",
    "Team training and upskilling",
    "Troubleshooting complex technical challenges",
  ],
};

export default function TechnicalConsultationService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta
          name="description"
          content={`Expert ${service.title} by Karthik Nishanth. ${service.description}`}
        />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/technical-consultation"
        />
      </Head>
      <PageContainer>
        <div className="min-h-screen p-8 md:p-16 max-w-4xl mx-auto">
          <FadeIn>
            <div className="flex items-center mb-6">
              {service.icon}
              <h1 className="text-4xl md:text-5xl font-bold text-white ml-4">
                {service.title}
              </h1>
            </div>
            <div className="w-24 h-1 bg-blue-600 mb-8 rounded-full"></div>{" "}
            {/* Adjusted color */}
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              {service.description} Leverage my technical expertise to make
              informed decisions for your project. Whether you're starting a new
              venture or scaling an existing one, I provide strategic insights
              to ensure technical success.
            </p>
            <h2 className="text-3xl font-semibold text-blue-400 mb-4">
              Key Features
            </h2>{" "}
            {/* Adjusted color */}
            <ul className="space-y-3 mb-12">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="bg-blue-600 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    {" "}
                    {/* Adjusted color */}
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-gray-300">{feature}</p>
                </li>
              ))}
            </ul>
            {/* --- New Sections Start --- */}
            <h2 className="text-3xl font-semibold text-blue-400 mt-12 mb-4">
              The Challenge
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Making the right technical decisions early on is crucial for
              project success. Choosing the wrong technology, architecture, or
              process can lead to costly rework, delays, and technical debt.
              Navigating the ever-evolving tech landscape requires experience
              and strategic insight.
            </p>
            <h2 className="text-3xl font-semibold text-blue-400 mt-12 mb-4">
              My Solution & Approach
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              I offer tailored technical consultation to guide you through
              critical decisions. Whether you need help selecting the optimal
              tech stack, designing a scalable architecture, improving your
              development workflow, or conducting code reviews, I provide
              unbiased, expert recommendations based on your specific goals and
              constraints. My focus is on practical, actionable advice that
              leads to tangible results.
            </p>
            <h2 className="text-3xl font-semibold text-blue-400 mt-12 mb-4">
              Consultation Areas
            </h2>
            <div className="flex flex-wrap gap-2 mb-12">
              {[
                "Tech Stack Selection",
                "Architecture Design",
                "Cloud Strategy (AWS/Firebase)",
                "DevOps Practices",
                "Code Quality & Review",
                "Agile Methodologies",
                "Project Planning",
                "Feasibility Studies",
                "Technical Due Diligence",
                "Team Training",
              ].map((area) => (
                <span
                  key={area}
                  className="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
            <h2 className="text-3xl font-semibold text-blue-400 mt-12 mb-4">
              Why Choose My Consultation Services?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
              <li>
                <span className="font-semibold text-white">
                  Experienced Guidance:
                </span>{" "}
                Benefit from years of hands-on development experience.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Objective Recommendations:
                </span>{" "}
                Unbiased advice focused on your best interests.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Strategic Insight:
                </span>{" "}
                Aligning technical decisions with business goals.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Risk Mitigation:
                </span>{" "}
                Avoid common pitfalls and costly mistakes.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Actionable Plans:
                </span>{" "}
                Clear steps and roadmaps for implementation.
              </li>
            </ul>
            {/* --- New Sections End --- */}
            <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg">
              {" "}
              {/* Adjusted gradient */}
              <h2 className="text-3xl font-bold text-white mb-4">
                Need Technical Guidance?
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Let's discuss your technical challenges and find the best path
                forward.
              </p>
              <Link
                href="/contact?subject=Technical%20Consultation%20Inquiry" // Pre-fill subject
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors mr-4" // Adjusted color
              >
                Get Expert Advice →
              </Link>
              <Link
                href="/services"
                className="inline-block px-8 py-3 border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold rounded-md transition-colors"
              >
                ← Back to Services
              </Link>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaCode } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

// Data specific to this service (can be expanded)
const service = {
  icon: <FaCode className="text-5xl mb-4" style={{ color: "#5BD3F3" }} />,
  title: "Frontend Development",
  description:
    "Creating responsive, interactive, and visually appealing user interfaces using modern frameworks like React, Next.js, and Vue.js.",
  features: [
    "Responsive web design for all devices",
    "Building fast Single Page Applications (SPAs)",
    "Developing offline-capable Progressive Web Apps (PWAs)",
    "Ensuring Cross-browser compatibility",
    "Optimizing frontend performance for speed",
    "State management solutions (Redux, Zustand, Context API)",
    "UI/UX implementation from designs (Figma, Sketch, etc.)",
    "Accessibility (WCAG) best practices",
  ],
  // Add more detailed sections like: Process, Technologies Used, Case Studies (optional)
};

export default function FrontendDevelopmentService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta
          name="description"
          content={`Expert ${service.title} services by Karthik Nishanth. ${service.description}`}
        />
        {/* Add other relevant meta tags (keywords, OG tags, canonical) */}
        <link
          rel="canonical"
          href="https://karthiknish.com/services/frontend-development"
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
            <div className="w-24 h-1 bg-blue-500 mb-8 rounded-full"></div>

            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              {service.description} Dive deep into creating seamless user
              experiences with cutting-edge frontend technologies. I focus on
              building interfaces that are not only beautiful but also
              performant and accessible.
            </p>

            <h2 className="text-3xl font-semibold text-blue-400 mb-4">
              Key Features
            </h2>
            <ul className="space-y-3 mb-12">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="bg-blue-500 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
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
              Many businesses struggle with outdated, slow, or non-responsive
              user interfaces that fail to engage users and convert visitors.
              Poor frontend experiences can lead to high bounce rates and lost
              opportunities.
            </p>

            <h2 className="text-3xl font-semibold text-blue-400 mt-12 mb-4">
              My Solution & Approach
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              I focus on building modern, performant, and user-centric
              frontends. My process involves understanding your target audience,
              translating designs into pixel-perfect code, ensuring
              responsiveness across all devices, and optimizing for speed and
              accessibility. I prioritize clean code, maintainability, and
              collaboration throughout the development cycle.
            </p>
            {/* Add more details about your specific process if desired */}

            <h2 className="text-3xl font-semibold text-blue-400 mt-12 mb-4">
              Technologies I Use
            </h2>
            <div className="flex flex-wrap gap-2 mb-12">
              {[
                "React",
                "Next.js",
                "Vue.js",
                "JavaScript (ES6+)",
                "TypeScript",
                "HTML5",
                "CSS3",
                "Tailwind CSS",
                "Sass/SCSS",
                "Framer Motion",
                "Redux",
                "Zustand",
              ].map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-700 text-blue-300 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            <h2 className="text-3xl font-semibold text-blue-400 mt-12 mb-4">
              Why Choose My Frontend Services?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
              <li>
                <span className="font-semibold text-white">
                  User-Centric Design:
                </span>{" "}
                Interfaces built with your users in mind.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Modern Technology:
                </span>{" "}
                Leveraging the latest frameworks for optimal results.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Performance Focused:
                </span>{" "}
                Fast load times and smooth interactions.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Responsive & Accessible:
                </span>{" "}
                Great experience on all devices, for all users.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Collaborative Process:
                </span>{" "}
                Transparent communication and partnership.
              </li>
            </ul>

            {/* --- New Sections End --- */}

            {/* Placeholder for Case Studies/Portfolio Links */}
            {/*
            <h2 className="text-3xl font-semibold text-blue-400 mt-12 mb-4">Featured Frontend Projects</h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">[Link to relevant portfolio items or case studies here...]</p>

            <h2 className="text-3xl font-semibold text-blue-400 mb-4">Technologies I Use</h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">[List specific frontend technologies like React, Next.js, Vue, Tailwind CSS, etc.]</p>
            */}

            <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Elevate Your User Interface?
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Let's build a frontend that delights your users and drives
                results.
              </p>
              <Link
                href="/contact?subject=Frontend%20Development%20Inquiry" // Pre-fill subject
                className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors mr-4"
              >
                Discuss Your Project →
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

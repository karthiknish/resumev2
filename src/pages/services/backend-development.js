import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaServer } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

// Data specific to this service
const service = {
  icon: <FaServer className="text-5xl mb-4" style={{ color: "#5B9853" }} />,
  title: "Backend Development",
  description:
    "Building robust, scalable, and secure server-side applications and APIs using Node.js, Express, and other modern technologies.",
  features: [
    "RESTful API development and integration",
    "GraphQL API implementation",
    "Real-time communication with WebSockets",
    "Authentication & authorization (JWT, OAuth)",
    "Serverless function development (AWS Lambda, Firebase Functions)",
    "Microservices architecture design and implementation",
    "Database integration (SQL & NoSQL)",
    "Third-party API integrations",
  ],
};

export default function BackendDevelopmentService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta
          name="description"
          content={`Reliable ${service.title} services by Karthik Nishanth. ${service.description}`}
        />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/backend-development"
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
            <div className="w-24 h-1 bg-green-500 mb-8 rounded-full"></div>{" "}
            {/* Adjusted color */}
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              {service.description} I build the powerful engines that drive
              modern web applications, focusing on security, scalability, and
              maintainability. From complex APIs to efficient data processing, I
              ensure your backend infrastructure is solid.
            </p>
            <h2 className="text-3xl font-semibold text-green-400 mb-4">
              Key Features
            </h2>{" "}
            {/* Adjusted color */}
            <ul className="space-y-3 mb-12">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="bg-green-500 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
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
            <h2 className="text-3xl font-semibold text-green-400 mt-12 mb-4">
              The Challenge
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Applications often need more than just a pretty face. They require
              robust server-side logic, secure data handling, and the ability to
              scale efficiently. Building a reliable backend can be complex and
              critical for success.
            </p>
            <h2 className="text-3xl font-semibold text-green-400 mt-12 mb-4">
              My Solution & Approach
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              I design and develop scalable, secure, and maintainable backend
              systems tailored to your specific needs. My approach involves
              choosing the right architecture (monolith, microservices,
              serverless), implementing clean APIs, ensuring data integrity, and
              optimizing for performance. I focus on writing testable and
              well-documented code.
            </p>
            <h2 className="text-3xl font-semibold text-green-400 mt-12 mb-4">
              Technologies I Use
            </h2>
            <div className="flex flex-wrap gap-2 mb-12">
              {[
                "Node.js",
                "Express.js",
                "NestJS",
                "TypeScript",
                "JavaScript (ES6+)",
                "Python (Flask/Django)",
                "REST APIs",
                "GraphQL",
                "PostgreSQL",
                "MongoDB",
                "Redis",
                "Docker",
                "AWS (Lambda, EC2, S3)",
                "Firebase",
              ].map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-700 text-green-300 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
            <h2 className="text-3xl font-semibold text-green-400 mt-12 mb-4">
              Why Choose My Backend Services?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
              <li>
                <span className="font-semibold text-white">Scalability:</span>{" "}
                Architectures designed to grow with your user base.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Security Focused:
                </span>{" "}
                Implementing best practices to protect your data.
              </li>
              <li>
                <span className="font-semibold text-white">Performance:</span>{" "}
                Optimized APIs and database interactions for speed.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Maintainability:
                </span>{" "}
                Clean, well-documented code for future development.
              </li>
              <li>
                <span className="font-semibold text-white">Reliability:</span>{" "}
                Building robust systems you can depend on.
              </li>
            </ul>
            {/* --- New Sections End --- */}
            <div className="text-center mt-16 p-8 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg">
              {" "}
              {/* Adjusted gradient */}
              <h2 className="text-3xl font-bold text-white mb-4">
                Need a Powerful Backend?
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Let's build the robust foundation your application needs to
                succeed.
              </p>
              <Link
                href="/contact?subject=Backend%20Development%20Inquiry" // Pre-fill subject
                className="inline-block px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition-colors mr-4" // Adjusted color
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

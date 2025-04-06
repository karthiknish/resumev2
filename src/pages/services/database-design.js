import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaDatabase } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

// Data specific to this service
const service = {
  icon: <FaDatabase className="text-5xl mb-4" style={{ color: "#FF9900" }} />,
  title: "Database Design & Management",
  description:
    "Designing, implementing, and managing efficient, scalable database solutions using both SQL and NoSQL technologies like PostgreSQL and MongoDB.",
  features: [
    "Relational database schema design (PostgreSQL, MySQL)",
    "NoSQL data modeling (MongoDB, DynamoDB)",
    "Database performance tuning and query optimization",
    "Data migration strategies and execution",
    "Backup and recovery planning",
    "Database security best practices",
    "Cloud database solutions (AWS RDS, MongoDB Atlas)",
    "Data warehousing concepts",
  ],
};

export default function DatabaseDesignService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta
          name="description"
          content={`Efficient ${service.title} services by Karthik Nishanth. ${service.description}`}
        />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/database-design"
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
            <div className="w-24 h-1 bg-orange-500 mb-8 rounded-full"></div>{" "}
            {/* Adjusted color */}
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              {service.description} Data is the backbone of any application. I
              design robust database structures that ensure data integrity,
              performance, and scalability, choosing the right technology (SQL
              or NoSQL) for your specific needs.
            </p>
            <h2 className="text-3xl font-semibold text-orange-400 mb-4">
              Key Features
            </h2>{" "}
            {/* Adjusted color */}
            <ul className="space-y-3 mb-12">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="bg-orange-500 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
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
            <h2 className="text-3xl font-semibold text-orange-400 mt-12 mb-4">
              The Challenge
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Poor database design can lead to slow performance, data
              inconsistencies, and difficulties in scaling your application.
              Choosing the right database technology and structuring data
              effectively is crucial for long-term success.
            </p>
            <h2 className="text-3xl font-semibold text-orange-400 mt-12 mb-4">
              My Solution & Approach
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              I analyze your application's data requirements to design optimal
              database schemas, whether relational (SQL) or non-relational
              (NoSQL). My approach focuses on normalization (for SQL), efficient
              data modeling, query optimization, indexing strategies, and
              ensuring data security and integrity. I also assist with data
              migration and choosing appropriate cloud database solutions.
            </p>
            <h2 className="text-3xl font-semibold text-orange-400 mt-12 mb-4">
              Technologies I Use
            </h2>
            <div className="flex flex-wrap gap-2 mb-12">
              {[
                "PostgreSQL",
                "MySQL",
                "MongoDB",
                "Firebase Firestore",
                "AWS RDS",
                "AWS DynamoDB",
                "SQL",
                "NoSQL",
                "Database Indexing",
                "Query Optimization",
                "Data Modeling Tools",
              ].map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-700 text-orange-300 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
            <h2 className="text-3xl font-semibold text-orange-400 mt-12 mb-4">
              Why Choose My Database Services?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
              <li>
                <span className="font-semibold text-white">
                  Optimized Performance:
                </span>{" "}
                Databases designed for speed and efficiency.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Scalable Designs:
                </span>{" "}
                Structures that can handle future growth.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Data Integrity:
                </span>{" "}
                Ensuring your data remains accurate and consistent.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Technology Agnostic:
                </span>{" "}
                Expertise in both SQL and NoSQL solutions.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Security Conscious:
                </span>{" "}
                Implementing best practices for data protection.
              </li>
            </ul>
            {/* --- New Sections End --- */}
            <div className="text-center mt-16 p-8 bg-gradient-to-r from-orange-900/30 to-yellow-900/30 rounded-lg">
              {" "}
              {/* Adjusted gradient */}
              <h2 className="text-3xl font-bold text-white mb-4">
                Need a Solid Data Foundation?
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Let's design a database solution that powers your application
                effectively.
              </p>
              <Link
                href="/contact?subject=Database%20Design%20Inquiry" // Pre-fill subject
                className="inline-block px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors mr-4" // Adjusted color
              >
                Discuss Your Data Needs →
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

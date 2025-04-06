import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

// Data specific to this service
const service = {
  icon: <FaRocket className="text-5xl mb-4" style={{ color: "#DD4B25" }} />,
  title: "Performance Optimization",
  description:
    "Improving the speed, efficiency, and overall user experience of web applications through comprehensive optimization techniques.",
  features: [
    "Website load time analysis and reduction",
    "Code splitting and bundle size optimization",
    "Lazy loading implementation for assets and components",
    "Effective caching strategies (browser, CDN, server-side)",
    "Image optimization and modern format delivery (WebP, AVIF)",
    "Critical Rendering Path optimization",
    "Server response time improvement",
    "Core Web Vitals enhancement",
  ],
};

export default function PerformanceOptimizationService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta
          name="description"
          content={`Boost your application speed with ${service.title} services by Karthik Nishanth. ${service.description}`}
        />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/performance-optimization"
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
            <div className="w-24 h-1 bg-red-500 mb-8 rounded-full"></div>{" "}
            {/* Adjusted color */}
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              {service.description} In today's fast-paced digital world,
              performance is crucial. I analyze and optimize every aspect of
              your application, from frontend rendering to backend responses,
              ensuring a lightning-fast experience for your users.
            </p>
            <h2 className="text-3xl font-semibold text-red-400 mb-4">
              Key Features
            </h2>{" "}
            {/* Adjusted color */}
            <ul className="space-y-3 mb-12">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="bg-red-500 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
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
            <h2 className="text-3xl font-semibold text-red-400 mt-12 mb-4">
              The Challenge
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Slow-loading websites and applications frustrate users, negatively
              impact SEO rankings, and reduce conversion rates. Identifying and
              fixing performance bottlenecks across the entire stack requires
              specialized expertise.
            </p>
            <h2 className="text-3xl font-semibold text-red-400 mt-12 mb-4">
              My Solution & Approach
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              I take a holistic approach to performance optimization. This
              involves profiling frontend and backend code, analyzing network
              requests, optimizing assets (images, fonts, scripts), implementing
              effective caching, and fine-tuning server configurations. I focus
              on measurable improvements, particularly targeting Core Web Vitals
              and overall user-perceived performance.
            </p>
            <h2 className="text-3xl font-semibold text-red-400 mt-12 mb-4">
              Areas of Optimization
            </h2>
            <div className="flex flex-wrap gap-2 mb-12">
              {[
                "Frontend Rendering",
                "JavaScript Execution",
                "Asset Loading",
                "Image Compression",
                "Caching Strategies",
                "Server Response Time",
                "Database Queries",
                "CDN Configuration",
                "Code Splitting",
                "Lazy Loading",
              ].map((area) => (
                <span
                  key={area}
                  className="bg-gray-700 text-red-300 px-3 py-1 rounded-full text-sm"
                >
                  {area}
                </span>
              ))}
            </div>
            <h2 className="text-3xl font-semibold text-red-400 mt-12 mb-4">
              Why Choose My Optimization Services?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
              <li>
                <span className="font-semibold text-white">
                  Measurable Results:
                </span>{" "}
                Focus on improving key performance metrics (LCP, FID, CLS).
              </li>
              <li>
                <span className="font-semibold text-white">
                  Improved User Experience:
                </span>{" "}
                Faster load times lead to happier users.
              </li>
              <li>
                <span className="font-semibold text-white">Better SEO:</span>{" "}
                Site speed is a crucial ranking factor for search engines.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Increased Conversions:
                </span>{" "}
                Faster sites often see higher conversion rates.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Holistic Approach:
                </span>{" "}
                Optimizing both frontend and backend components.
              </li>
            </ul>
            {/* --- New Sections End --- */}
            <div className="text-center mt-16 p-8 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg">
              {" "}
              {/* Adjusted gradient */}
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Speed Up Your Application?
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Let's analyze your application and implement strategies for
                maximum performance.
              </p>
              <Link
                href="/contact?subject=Performance%20Optimization%20Inquiry" // Pre-fill subject
                className="inline-block px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md transition-colors mr-4" // Adjusted color
              >
                Optimize Your Application →
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

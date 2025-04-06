import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaMobileAlt } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

// Data specific to this service
const service = {
  icon: <FaMobileAlt className="text-5xl mb-4" style={{ color: "#E535AB" }} />,
  title: "Mobile App Development",
  description:
    "Developing high-performance, cross-platform mobile applications using React Native that work seamlessly on both iOS and Android devices.",
  features: [
    "Cross-platform development (iOS & Android)",
    "Native-like performance and user experience",
    "Offline data storage and synchronization",
    "Push notification implementation",
    "Integration with device hardware (camera, GPS, etc.)",
    "App store submission and deployment assistance",
    "Maintenance and updates for mobile apps",
    "Performance monitoring and optimization",
  ],
};

export default function MobileAppDevelopmentService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta
          name="description"
          content={`Cross-platform ${service.title} using React Native by Karthik Nishanth. ${service.description}`}
        />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/mobile-app-development"
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
            <div className="w-24 h-1 bg-pink-500 mb-8 rounded-full"></div>{" "}
            {/* Adjusted color */}
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              {service.description} Reach your users wherever they are with
              beautiful and functional mobile apps. Using React Native, I build
              applications that offer a native look and feel while maintaining a
              single codebase for efficiency.
            </p>
            <h2 className="text-3xl font-semibold text-pink-400 mb-4">
              Key Features
            </h2>{" "}
            {/* Adjusted color */}
            <ul className="space-y-3 mb-12">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="bg-pink-500 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
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
            <h2 className="text-3xl font-semibold text-pink-400 mt-12 mb-4">
              The Challenge
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Reaching users on mobile requires navigating the complexities of
              different platforms (iOS and Android), ensuring native
              performance, and providing engaging user experiences. Building
              separate native apps can be costly and time-consuming.
            </p>
            <h2 className="text-3xl font-semibold text-pink-400 mt-12 mb-4">
              My Solution & Approach
            </h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              I specialize in cross-platform development using React Native,
              allowing us to build beautiful, high-performance apps for both iOS
              and Android from a single codebase. This approach saves time and
              resources while delivering a truly native feel. My process
              includes UI/UX design implementation, robust state management, API
              integration, and thorough testing.
            </p>
            <h2 className="text-3xl font-semibold text-pink-400 mt-12 mb-4">
              Technologies I Use
            </h2>
            <div className="flex flex-wrap gap-2 mb-12">
              {[
                "React Native",
                "Expo",
                "JavaScript (ES6+)",
                "TypeScript",
                "Redux",
                "Zustand",
                "Firebase",
                "REST APIs",
                "GraphQL",
                "Native Modules",
              ].map((tech) => (
                <span
                  key={tech}
                  className="bg-gray-700 text-pink-300 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
            <h2 className="text-3xl font-semibold text-pink-400 mt-12 mb-4">
              Why Choose My Mobile App Services?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
              <li>
                <span className="font-semibold text-white">
                  Cross-Platform Efficiency:
                </span>{" "}
                One codebase for both iOS and Android.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Native Performance:
                </span>{" "}
                Smooth animations and responsive interfaces.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Faster Development:
                </span>{" "}
                Quicker time-to-market compared to native development.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Cost-Effective:
                </span>{" "}
                Reduced development and maintenance costs.
              </li>
              <li>
                <span className="font-semibold text-white">
                  Full App Lifecycle Support:
                </span>{" "}
                From idea to app store deployment.
              </li>
            </ul>
            {/* --- New Sections End --- */}
            <div className="text-center mt-16 p-8 bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-lg">
              {" "}
              {/* Adjusted gradient */}
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Build Your Mobile App?
              </h2>
              <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                Let's turn your app idea into a reality for users on iOS and
                Android.
              </p>
              <Link
                href="/contact?subject=Mobile%20App%20Development%20Inquiry" // Pre-fill subject
                className="inline-block px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md transition-colors mr-4" // Adjusted color
              >
                Discuss Your App Idea →
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

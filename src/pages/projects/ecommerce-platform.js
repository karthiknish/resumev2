import React from "react";
import Head from "next/head";
import Link from "next/link";
import { TrendingUp } from "lucide-react"; // Import relevant icon
import PageContainer from "@/components/PageContainer"; // Assuming PageContainer exists
import { FadeIn } from "@/components/animations/MotionComponents"; // Assuming MotionComponents exist
import { Separator } from "@/components/ui/separator"; // Assuming Separator exists
import { Badge } from "@/components/ui/badge"; // Assuming Badge exists

// Hardcoded data for this specific sample project
const project = {
  id: "ecommerce-platform",
  title: "E-commerce Platform",
  meta: "35% Growth",
  description:
    "This project involved advanced UX design and performance optimization for a major e-commerce client, resulting in significantly increased conversions and user engagement. We focused on streamlining the checkout process, improving product discovery, and enhancing mobile responsiveness.",
  // Added a longer description field
  longDescription:
    "The primary goal was to overhaul the existing user experience which suffered from high cart abandonment rates and slow load times. We conducted user research, created new user flows, and implemented A/B testing for key features. Performance optimization involved code splitting, image optimization (WebP/AVIF), CDN integration, and server-side rendering improvements with Next.js. The tech stack leveraged React, Next.js, Tailwind CSS, and integrated with Stripe for payments and Algolia for search.",
  icon: <TrendingUp className="w-8 h-8 text-blue-500" />, // Larger icon
  status: "Live",
  tags: [
    "UX",
    "Performance",
    "Analytics",
    "E-commerce",
    "React",
    "Next.js",
    "Stripe",
    "Algolia",
  ], // Expanded tags
  // Add image if available, or a placeholder
  // image: "/path/to/ecommerce-image.png",
  extlink: "#", // Placeholder link
};

export default function EcommercePlatformProject() {
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
                  className="text-blue-400 border-blue-400 mr-2"
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

              <h2 className="text-2xl font-semibold text-blue-400 mb-3">
                Project Overview
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                {project.longDescription || project.description}
              </p>

              {/* --- Added Sections Start --- */}
              <h2 className="text-2xl font-semibold text-blue-400 mt-8 mb-3">
                Challenges Faced
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                The platform struggled with several key issues hindering growth:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                <li>
                  <strong>Complex Checkout:</strong> High cart abandonment rate
                  due to a confusing and lengthy checkout process.
                </li>
                <li>
                  <strong>Performance Bottlenecks:</strong> Slow page load times
                  impacting user experience and SEO rankings.
                </li>
                <li>
                  <strong>Inconsistent UI/UX:</strong> A disjointed experience
                  across different devices and browsers.
                </li>
                <li>
                  <strong>Poor Product Discovery:</strong> Users found it
                  difficult to search and find relevant products quickly.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-blue-400 mt-8 mb-3">
                Solutions Implemented
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                We implemented a multi-faceted approach to address the core
                challenges:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-8 text-lg">
                <li>
                  <strong>Checkout Redesign:</strong> Streamlined the checkout
                  flow into fewer steps with clearer calls-to-action.
                </li>
                <li>
                  <strong>Performance Overhaul:</strong> Utilized Next.js SSR,
                  code splitting, optimized images (WebP/AVIF), and CDN caching.
                </li>
                <li>
                  <strong>Responsive UI:</strong> Rebuilt the frontend using
                  Tailwind CSS for a consistent, mobile-first experience.
                </li>
                <li>
                  <strong>Enhanced Search:</strong> Integrated Algolia for
                  lightning-fast, typo-tolerant product search.
                </li>
                <li>
                  <strong>Data-Driven Design:</strong> Conducted A/B testing on
                  critical UI components to validate improvements.
                </li>
              </ul>

              <h2 className="text-2xl font-semibold text-blue-400 mt-8 mb-3">
                Key Results
              </h2>
              <p className="text-gray-400 mb-4 text-md">
                The implemented solutions delivered significant, measurable
                improvements:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 mb-12 text-lg">
                <li>
                  <strong>Conversion Rate:</strong> Achieved a 35% increase in
                  overall conversion rate within 3 months post-launch.
                </li>
                <li>
                  <strong>Load Time:</strong> Reduced average page load time by
                  over 50%, improving Core Web Vitals.
                </li>
                <li>
                  <strong>Cart Abandonment:</strong> Decreased cart abandonment
                  rate by 20% due to the simplified checkout.
                </li>
                <li>
                  <strong>Mobile Engagement:</strong> Saw a 40% increase in
                  session duration for mobile users.
                </li>
              </ul>
              {/* --- Added Sections End --- */}

              <h2 className="text-2xl font-semibold text-blue-400 mb-3">
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
                    className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
                  >
                    View Live Project →
                  </Link>
                )}
                <Link
                  href="/#projects" // Link back to home section or projects page
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

import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaPaintBrush } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

// Data specific to this service
const service = {
  icon: <FaPaintBrush className="text-5xl mb-4 text-brand-secondary" />,
  title: "Website Reskin & Modernization",
  description:
    "Transform your outdated website into a high-performing conversion machine that impresses visitors and drives results without the cost and time of a full rebuild.",
  features: [
    "Stunning Visual Redesign aligned with your brand identity",
    "Fully Responsive layout for perfect viewing on all devices",
    "Performance Optimization for faster load times and better SEO",
    "Improved User Experience (UX) to guide visitors and increase engagement",
    "Modern UI components and interactive elements",
    "Enhanced accessibility and usability",
    "SEO improvements for better search rankings",
    "Integration with modern web technologies",
  ],
};

export default function WebsiteReskinService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta
          name="description"
          content={`Professional ${service.title} services by Karthik Nishanth. ${service.description}`}
        />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/website-reskin"
        />
      </Head>
      <PageContainer>
        <div className="min-h-screen p-8 md:p-16 max-w-4xl mx-auto">
          <FadeIn>
            <div className="flex items-center mb-6">
              {service.icon}
              <h1 className="text-4xl md:text-5xl font-bold text-foreground ml-4">
                {service.title}
              </h1>
            </div>
            <div className="w-24 h-1 bg-brand-secondary mb-8 rounded-full"></div>

            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              {service.description} A professional website reskin revitalizes
              your online presence, enhances user experience, and boosts
              conversions while preserving your existing content and
              functionality.
            </p>

            <h2 className="text-3xl font-semibold text-brand-secondary mb-4">
              Key Features
            </h2>
            <ul className="space-y-3 mb-12">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="bg-brand-secondary p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-primary-foreground"
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
                  <p className="text-muted-foreground">{feature}</p>
                </li>
              ))}
            </ul>

            {/* --- New Sections Start --- */}

            <h2 className="text-3xl font-semibold text-brand-secondary mt-12 mb-4">
              The Challenge
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Many businesses struggle with outdated websites that no longer
              reflect their brand's quality or effectively drive results. These
              websites may have poor user experience, slow loading times, or
              designs that look dated, leading to high bounce rates and missed
              opportunities.
            </p>

            <h2 className="text-3xl font-semibold text-brand-secondary mt-12 mb-4">
              My Solution & Approach
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              I specialize in website reskinning that breathes new life into
              existing sites. My process begins with a thorough audit of your
              current website to identify areas for improvement. I then create a
              modern design that aligns with your brand identity while preserving
              your valuable content and functionality. The result is a
              revitalized online presence that makes a powerful first impression
              and drives better engagement.
            </p>

            <h2 className="text-3xl font-semibold text-brand-secondary mt-12 mb-4">
              Technologies I Use
            </h2>
            <div className="flex flex-wrap gap-2 mb-12">
              {[
                "Next.js",
                "React",
                "Tailwind CSS",
                "Framer Motion",
                "GSAP",
                "Vercel",
                "Lighthouse",
                "SEO Tools",
              ].map((tech) => (
                <span
                  key={tech}
                  className="bg-secondary text-brand-secondary px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            <h2 className="text-3xl font-semibold text-brand-secondary mt-12 mb-4">
              Why Choose My Website Reskin Services?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-12 text-lg">
              <li>
                <span className="font-semibold text-foreground">
                  Cost-Effective Solution:
                </span>{" "}
                Achieve a modern look at a fraction of the cost of a full rebuild.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Preserve Existing Content:
                </span>{" "}
                Keep your valuable content and functionality while updating the design.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Faster Turnaround:
                </span>{" "}
                Get your updated website online more quickly than a complete rebuild.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Improved Performance:
                </span>{" "}
                Modern code and optimization techniques for better speed and SEO.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Enhanced User Experience:
                </span>{" "}
                Intuitive design that guides visitors and increases conversions.
              </li>
            </ul>

            {/* --- New Sections End --- */}

            <div className="text-center mt-16 p-8 bg-gradient-to-r from-brand-secondary/20 to-primary/20 rounded-lg">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Revitalize Your Website?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Let's transform your outdated website into a high-performing
                conversion machine.
              </p>
              <Link
                href="/contact?subject=Website%20Reskin%20Inquiry"
                className="inline-block px-8 py-3 bg-brand-secondary hover:bg-brand-secondary/90 text-primary-foreground font-semibold rounded-md transition-colors mr-4"
              >
                Discuss Your Project →
              </Link>
              <Link
                href="/services"
                className="inline-block px-8 py-3 border border-border hover:bg-secondary text-muted-foreground font-semibold rounded-md transition-colors"
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
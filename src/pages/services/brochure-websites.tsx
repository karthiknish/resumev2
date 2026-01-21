// Converted to TypeScript - migrated
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaGlobe } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

// Data specific to this service
const service = {
  icon: <FaGlobe className="text-5xl mb-4 text-brand-secondary" />,
  title: "Professional Brochure Websites",
  description:
    "Establish your online presence with a stunning, custom-built website that showcases your services, builds credibility, and attracts new customers.",
  features: [
    "Unique Custom Design reflecting your brand identity",
    "Mobile-First Responsive layout for all screen sizes",
    "Basic SEO Optimization to improve search engine visibility",
    "Clear Calls-to-Action to encourage user engagement",
    "Fast loading times and optimized performance",
    "Contact forms and lead capture functionality",
    "Integration with social media platforms",
    "Professional email setup with your domain",
  ],
};

export default function BrochureWebsiteService() {
  return (
    <>
      <Head>
        <title>{`${service.title} - Karthik Nishanth`}</title>
        <meta
          name="description"
          content={`Professional ${service.title} services by Karthik Nishanth. ${service.description}`}
        />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/brochure-websites"
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
              {service.description} A brochure website is your digital business
              card, available 24/7. I ensure your brochure site is not just
              visually appealing but also functional, fast, and easy for
              potential clients to navigate.
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
              Many businesses operate without a professional online presence or
              rely on outdated websites that fail to represent their brand
              effectively. This can lead to missed opportunities, reduced
              credibility, and an inability to reach potential customers who are
              searching for their services online.
            </p>

            <h2 className="text-3xl font-semibold text-brand-secondary mt-12 mb-4">
              My Solution & Approach
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              I create stunning brochure websites that serve as powerful digital
              showcases for your business. My process involves understanding your
              brand identity, target audience, and business goals. I then design
              and develop a website that effectively communicates your value
              proposition, showcases your services, and encourages visitor
              engagement. Every website I build is optimized for performance,
              mobile responsiveness, and search engines.
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
                "Vercel",
                "Google Analytics",
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
              Why Choose My Brochure Website Services?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-12 text-lg">
              <li>
                <span className="font-semibold text-foreground">
                  Professional Design:
                </span>{" "}
                Visually appealing websites that reflect your brand identity.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Mobile Optimization:
                </span>{" "}
                Seamless experience on all devices, from desktops to smartphones.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Fast Performance:
                </span>{" "}
                Optimized loading times for better user experience and SEO.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  SEO Friendly:
                </span>{" "}
                Built with search engine optimization best practices.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Easy Maintenance:
                </span>{" "}
                Clean, well-structured code that's easy to update and manage.
              </li>
            </ul>

            {/* --- New Sections End --- */}

            <div className="text-center mt-16 p-8 bg-gradient-to-r from-brand-secondary/20 to-primary/20 rounded-lg">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Establish Your Online Presence?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Let's create a stunning brochure website that showcases your
                business and attracts new customers.
              </p>
              <Link
                href="/contact?subject=Brochure%20Website%20Inquiry"
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

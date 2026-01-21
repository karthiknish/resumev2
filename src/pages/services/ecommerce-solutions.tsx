// Converted to TypeScript - migrated
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaStore } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";

// Data specific to this service
const service = {
  icon: <FaStore className="text-5xl mb-4 text-brand-secondary" />,
  title: "E-commerce Solutions",
  description:
    "Build a powerful online store that drives sales and growth with a seamless shopping experience for your customers and easy management for you.",
  features: [
    "Intuitive Product Catalog & Management System",
    "Secure Payment Gateway Integration (Stripe, PayPal, etc.)",
    "User Accounts & Order Management System",
    "Mobile-Optimized Design for shopping on any device",
    "Inventory tracking and management",
    "Shipping and tax calculation automation",
    "Customer reviews and rating system",
    "Analytics and sales reporting dashboard",
  ],
};

export default function EcommerceSolutionsService() {
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
          href="https://karthiknish.com/services/ecommerce-solutions"
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
              {service.description} From product catalogs to secure checkouts,
              I build everything you need to succeed in the competitive online
              marketplace.
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
              Many businesses struggle with complex, expensive e-commerce
              platforms that are difficult to manage or lack essential features.
              Others try to build their own solutions without proper expertise,
              resulting in security vulnerabilities, poor user experience, or
              scalability issues.
            </p>

            <h2 className="text-3xl font-semibold text-brand-secondary mt-12 mb-4">
              My Solution & Approach
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              I build custom e-commerce solutions tailored to your specific
              business needs. My approach combines modern web technologies with
              proven e-commerce best practices to create secure, scalable, and
              user-friendly online stores. I focus on creating intuitive shopping
              experiences that convert visitors into customers while providing
              you with the tools you need to efficiently manage your store.
            </p>

            <h2 className="text-3xl font-semibold text-brand-secondary mt-12 mb-4">
              Technologies I Use
            </h2>
            <div className="flex flex-wrap gap-2 mb-12">
              {[
                "Next.js",
                "React",
                "Node.js",
                "MongoDB",
                "Stripe",
                "PayPal",
                "Tailwind CSS",
                "Framer Motion",
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
              Why Choose My E-commerce Solutions?
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-12 text-lg">
              <li>
                <span className="font-semibold text-foreground">
                  Custom Solutions:
                </span>{" "}
                Tailored to your specific business requirements and goals.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Security Focused:
                </span>{" "}
                PCI-compliant payment processing and robust security measures.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Scalable Architecture:
                </span>{" "}
                Built to grow with your business and handle increased traffic.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  User Experience:
                </span>{" "}
                Intuitive design that guides customers through the purchase process.
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Easy Management:
                </span>{" "}
                Admin dashboard for effortless product and order management.
              </li>
            </ul>

            {/* --- New Sections End --- */}

            <div className="text-center mt-16 p-8 bg-gradient-to-r from-brand-secondary/20 to-primary/20 rounded-lg">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Start Selling Online?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Let's build a powerful e-commerce store that drives sales and
                grows your business.
              </p>
              <Link
                href="/contact?subject=Ecommerce%20Solutions%20Inquiry"
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

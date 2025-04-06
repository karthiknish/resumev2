import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  FaGlobe,
  FaBullhorn,
  FaSearch,
  FaMobileAlt,
  FaPaintBrush,
} from "react-icons/fa"; // Added more icons
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Data specific to this service
const service = {
  icon: <FaGlobe className="w-10 h-10 text-teal-400" />, // Adjusted color
  title: "Professional Brochure Websites",
  headline:
    "Establish Your Online Presence with a Stunning, Custom-Built Website",
  description:
    "Need a professional online 'shop window' for your business? A brochure website is the perfect solution to showcase your services, build credibility, and attract new customers. I create beautiful, fast, and SEO-friendly websites tailored specifically to your brand.",
  features: [
    {
      icon: <FaPaintBrush className="text-green-400" />,
      text: "Unique Custom Design reflecting your brand identity.",
    },
    {
      icon: <FaMobileAlt className="text-green-400" />,
      text: "Mobile-First Responsive layout for all screen sizes.",
    },
    {
      icon: <FaSearch className="text-green-400" />,
      text: "Basic SEO Optimization to improve search engine visibility.",
    },
    {
      icon: <FaBullhorn className="text-green-400" />,
      text: "Clear Calls-to-Action to encourage user engagement.",
    },
  ],
  benefits: [
    "Build trust and establish credibility with a professional online presence.",
    "Clearly communicate your services, values, and contact information.",
    "Attract local customers searching for your services online.",
    "Provide a central hub for your marketing efforts.",
    "Cost-effective solution compared to complex web applications.",
  ],
  cta: "Get Your Professional Website",
  ctaLink: "/contact?subject=Brochure%20Website%20Inquiry",
};

export default function BrochureWebsiteService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta name="description" content={service.headline} />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/brochure-websites"
        />
      </Head>
      <PageContainer className="mt-10">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white p-8 md:p-16">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block p-4 bg-gray-800 rounded-full mb-4">
                  {service.icon}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-calendas">
                  {service.title}
                </h1>
                <p className="text-xl md:text-2xl text-teal-300 font-medium">
                  {service.headline}
                </p>
              </div>

              <Separator className="my-8 bg-gray-700" />

              <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h2 className="text-3xl font-semibold text-white mb-4">
                    Need an Online Showcase?
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {service.description} It's your digital business card,
                    available 24/7. I ensure your brochure site is not just
                    visually appealing but also functional, fast, and easy for
                    potential clients to navigate.
                  </p>
                </div>
                <div className="space-y-4">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                    >
                      <span className="mr-3 flex-shrink-0">{feature.icon}</span>
                      <span className="text-gray-200">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-semibold text-white mb-4 text-center">
                Why Invest in a Brochure Website?
              </h2>
              <ul className="list-none space-y-3 mb-12 text-center">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-gray-300 text-lg">
                    ✓ {benefit}
                  </li>
                ))}
              </ul>

              <Separator className="my-8 bg-gray-700" />

              <div className="text-center mt-12 p-8 bg-gradient-to-r from-teal-900/30 to-green-900/30 rounded-lg">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Make Your Mark Online?
                </h2>
                <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                  Let's create a professional brochure website that represents
                  your business perfectly. Contact me to get started.
                </p>
                <Link
                  href={service.ctaLink}
                  className="inline-block px-8 py-3 bg-teal-500 hover:bg-teal-600 text-black font-semibold rounded-md transition-colors mr-4"
                >
                  {service.cta} →
                </Link>
                <Link
                  href="/services"
                  className="inline-block px-6 py-3 border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold rounded-md transition-colors mt-4 sm:mt-0"
                >
                  View Other Services
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}

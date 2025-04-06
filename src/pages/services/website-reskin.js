import React from "react";
import Head from "next/head";
import Link from "next/link";
import { FaPaintBrush, FaMobileAlt, FaRocket, FaSyncAlt } from "react-icons/fa"; // Added more icons
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Data specific to this service
const service = {
  icon: <FaPaintBrush className="w-10 h-10 text-cyan-400" />, // Adjusted color
  title: "Website Reskin & Modernization",
  headline:
    "Transform Your Outdated Website into a High-Performing Conversion Machine",
  description:
    "Is your current website failing to impress? Stuck with an old design that doesn't reflect your brand's quality or drive results? A professional website reskin revitalizes your online presence, enhances user experience, and boosts conversions without the cost and time of a full rebuild.",
  features: [
    {
      icon: <FaPaintBrush className="text-cyan-400" />,
      text: "Stunning Visual Redesign aligned with your brand identity.",
    },
    {
      icon: <FaMobileAlt className="text-cyan-400" />,
      text: "Fully Responsive layout for perfect viewing on all devices.",
    },
    {
      icon: <FaRocket className="text-cyan-400" />,
      text: "Performance Optimization for faster load times and better SEO.",
    },
    {
      icon: <FaSyncAlt className="text-cyan-400" />,
      text: "Improved User Experience (UX) to guide visitors and increase engagement.",
    },
  ],
  benefits: [
    "Make a powerful first impression that builds trust and credibility.",
    "Increase user engagement and reduce bounce rates.",
    "Improve search engine rankings with better performance and mobile-friendliness.",
    "Generate more leads and conversions with a user-focused design.",
    "Achieve a modern look at a fraction of the cost of a full rebuild.",
  ],
  cta: "Revitalize Your Website Today!",
  ctaLink: "/contact?subject=Website%20Reskin%20Inquiry",
};

export default function WebsiteReskinService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta name="description" content={service.headline} />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/website-reskin"
        />
      </Head>
      <PageContainer className="mt-10">
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white p-8 md:p-16">
          {" "}
          {/* Added gradient */}
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block p-4 bg-gray-800 rounded-full mb-4">
                  {service.icon}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-calendas">
                  {service.title}
                </h1>
                <p className="text-xl md:text-2xl text-cyan-300 font-medium">
                  {service.headline}
                </p>
              </div>

              <Separator className="my-8 bg-gray-700" />

              <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h2 className="text-3xl font-semibold text-white mb-4">
                    Is Your Website Holding You Back?
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {service.description} Don't let an outdated design cost you
                    valuable customers. I specialize in transforming existing
                    websites into modern, high-impact digital assets.
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
                Unlock Tangible Benefits
              </h2>
              <ul className="list-none space-y-3 mb-12 text-center">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-gray-300 text-lg">
                    ✓ {benefit}
                  </li>
                ))}
              </ul>

              <Separator className="my-8 bg-gray-700" />

              <div className="text-center mt-12 p-8 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready for a Website Transformation?
                </h2>
                <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                  Let's discuss how a website reskin can elevate your brand and
                  drive results. Get a free consultation today!
                </p>
                <Link
                  href={service.ctaLink}
                  className="inline-block px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-md transition-colors mr-4"
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

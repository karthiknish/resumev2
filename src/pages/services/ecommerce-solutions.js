import React from "react";
import Head from "next/head";
import Link from "next/link";
import {
  FaStore,
  FaShoppingCart,
  FaCreditCard,
  FaLock,
  FaMobileAlt,
} from "react-icons/fa"; // Added more icons
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Data specific to this service
const service = {
  icon: <FaStore className="w-10 h-10 text-lime-400" />, // Adjusted color
  title: "E-commerce Solutions",
  headline: "Build a Powerful Online Store That Drives Sales & Growth",
  description:
    "Ready to sell online? I build robust, secure, and user-friendly e-commerce websites that provide a seamless shopping experience for your customers and are easy for you to manage. From product catalogs to secure checkouts, get everything you need to succeed online.",
  features: [
    {
      icon: <FaShoppingCart className="text-green-400" />,
      text: "Intuitive Product Catalog & Management.",
    },
    {
      icon: <FaCreditCard className="text-green-400" />,
      text: "Secure Payment Gateway Integration (Stripe, PayPal, etc.).",
    },
    {
      icon: <FaLock className="text-green-400" />,
      text: "User Accounts & Order Management System.",
    },
    {
      icon: <FaMobileAlt className="text-green-400" />,
      text: "Mobile-Optimized Design for shopping on any device.",
    },
  ],
  benefits: [
    "Expand your reach and sell to customers anywhere, anytime.",
    "Provide a convenient and secure shopping experience.",
    "Streamline your sales process with integrated inventory and order management.",
    "Gain valuable insights into customer behavior and sales trends.",
    "Build a scalable platform that grows with your business.",
  ],
  cta: "Start Selling Online",
  ctaLink: "/contact?subject=Ecommerce%20Solutions%20Inquiry",
};

export default function EcommerceSolutionsService() {
  return (
    <>
      <Head>
        <title>{service.title} - Karthik Nishanth</title>
        <meta name="description" content={service.headline} />
        <link
          rel="canonical"
          href="https://karthiknish.com/services/ecommerce-solutions"
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
                <p className="text-xl md:text-2xl text-lime-300 font-medium">
                  {service.headline}
                </p>
              </div>

              <Separator className="my-8 bg-gray-700" />

              <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                <div>
                  <h2 className="text-3xl font-semibold text-white mb-4">
                    Ready to Launch Your Online Store?
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {service.description} I leverage powerful platforms and
                    custom development to create online stores that not only
                    look great but are also secure, scalable, and optimized for
                    conversions.
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
                Benefits of a Professional E-commerce Site
              </h2>
              <ul className="list-none space-y-3 mb-12 text-center">
                {service.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-gray-300 text-lg">
                    ✓ {benefit}
                  </li>
                ))}
              </ul>

              <Separator className="my-8 bg-gray-700" />

              <div className="text-center mt-12 p-8 bg-gradient-to-r from-lime-900/30 to-green-900/30 rounded-lg">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Turn Clicks into Customers
                </h2>
                <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                  Let's build an e-commerce platform that drives sales and grows
                  your business online. Get started today!
                </p>
                <Link
                  href={service.ctaLink}
                  className="inline-block px-8 py-3 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-md transition-colors mr-4"
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

import { motion } from "framer-motion";
import { FaPaintBrush, FaStore, FaGlobe } from "react-icons/fa";
import React from "react";
import Link from "next/link";
// Original service data
const services = [
  {
    icon: <FaPaintBrush className="w-8 h-8" />,
    title: "Website Reskin",
    description:
      "Give your existing website a fresh, modern look while maintaining its core functionality. Perfect for businesses looking to update their online presence.",
    features: [
      "Modern UI/UX redesign",
      "Mobile responsiveness",
      "Performance optimization",
      "Brand alignment",
    ],
    link: "/services/website-reskin", // Added link
  },
  {
    icon: <FaGlobe className="w-8 h-8" />,
    title: "Brochure Websites",
    description:
      "Professional, custom-built websites that effectively showcase your business, products, or services to potential customers.",
    features: [
      "Custom design & development",
      "SEO optimization",
      "Content management system",
      "Contact forms & integrations",
    ],
    link: "/services/brochure-websites", // Added link
  },
  {
    icon: <FaStore className="w-8 h-8" />,
    title: "E-commerce Solutions",
    description:
      "Full-featured online stores that help you sell products or services directly to your customers with a seamless shopping experience.",
    features: [
      "Secure payment integration",
      "Inventory management",
      "Order processing",
      "Customer accounts",
    ],
    link: "/services/ecommerce-solutions", // Added link
  },
];

export default function Services() {
  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-medium text-white font-calendas text-center">
        My Services
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            // --- New Styling ---
            className="group relative bg-gradient-to-br from-gray-900 via-gray-800/80 to-black p-6 rounded-xl shadow-lg border border-white/10 overflow-hidden transition-all duration-300 hover:shadow-blue-500/30 hover:border-blue-500/50 hover:-translate-y-1 block" // Added block for Link
          >
            <Link
              href={service.link || "#"}
              className="absolute inset-0 z-20"
              aria-label={`Learn more about ${service.title}`}
            ></Link>{" "}
            {/* Added Link overlay */}
            {/* Subtle background pattern on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:8px_8px] -z-10"></div>
            {/* Icon with background */}
            <div className="relative z-10 mb-4 inline-flex items-center justify-center p-3 rounded-full bg-gray-700/60 border border-white/10 group-hover:bg-blue-900/50 group-hover:border-blue-700 transition-colors duration-300">
              {React.cloneElement(service.icon, {
                className:
                  "w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300",
              })}
            </div>
            <h3 className="relative z-10 text-xl font-semibold text-white mb-3 font-calendas group-hover:text-blue-300 transition-colors duration-300">
              {service.title}
            </h3>
            <p className="relative z-10 text-gray-400 mb-4 text-sm group-hover:text-gray-300 transition-colors duration-300">
              {service.description}
            </p>
            {/* Features list removed for cleaner card on homepage, focus on title/desc */}
            {/* Optional: Add a subtle "Learn More" indicator - now part of the card content */}
            <div className="relative z-10 mt-4 text-right">
              {" "}
              {/* Aligned indicator */}
              <span className="text-xs text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                Learn More →
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

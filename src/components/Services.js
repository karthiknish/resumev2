import { motion } from "framer-motion";
import { FaPaintBrush, FaStore, FaGlobe } from "react-icons/fa";
import React from "react";
import Link from "next/link";
// Original service data
const services = [
  {
    icon: <FaPaintBrush className="w-8 h-8" />,
    // emoji removed
    title: "Website Reskin",
    description:
      "Give your existing website a fresh, modern look while maintaining its core functionality. Perfect for businesses looking to update their online presence.",
    features: [
      "Modern UI/UX redesign",
      "Mobile responsiveness",
      "Performance optimization",
      "Brand alignment",
    ],
    link: "/services/website-reskin",
    color: "bg-gradient-to-br from-pink-50 to-purple-50",
    borderColor: "border-pink-200 hover:border-pink-300",
    iconBg: "from-pink-100 to-purple-100",
    textColor: "text-pink-600",
  },
  {
    icon: <FaGlobe className="w-8 h-8" />,
    // emoji removed
    title: "Brochure Websites",
    description:
      "Professional, custom-built websites that effectively showcase your business, products, or services to potential customers.",
    features: [
      "Custom design & development",
      "SEO optimization",
      "Content management system",
      "Contact forms & integrations",
    ],
    link: "/services/brochure-websites",
    color: "bg-gradient-to-br from-blue-50 to-cyan-50",
    borderColor: "border-blue-200 hover:border-blue-300",
    iconBg: "from-blue-100 to-cyan-100",
    textColor: "text-blue-600",
  },
  {
    icon: <FaStore className="w-8 h-8" />,
    // emoji removed
    title: "E-commerce Solutions",
    description:
      "Full-featured online stores that help you sell products or services directly to your customers with a seamless shopping experience.",
    features: [
      "Secure payment integration",
      "Inventory management",
      "Order processing",
      "Customer accounts",
    ],
    link: "/services/ecommerce-solutions",
    color: "bg-gradient-to-br from-green-50 to-emerald-50",
    borderColor: "border-green-200 hover:border-green-300",
    iconBg: "from-green-100 to-emerald-100",
    textColor: "text-green-600",
  },
];

export default function Services() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2
          className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary to-brandSecondary bg-clip-text text-transparent mb-6 flex items-center justify-center gap-6"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          My Services
        </h2>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-medium">
          Transforming ideas into digital reality with modern, scalable
          solutions
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-10">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <Link href={service.link || "#"}>
              <div
                className={`h-full p-8 rounded-3xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer ${service.color} ${service.borderColor}`}
              >
                <div className="flex items-center mb-6">
                  <motion.div
                    className={`p-4 bg-gradient-to-r ${service.iconBg} rounded-2xl`}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {React.cloneElement(service.icon, {
                      className: `w-8 h-8 ${service.textColor}`,
                    })}
                  </motion.div>
                </div>
                <h3
                  className={`text-2xl font-bold mb-4 ${service.textColor} group-hover:text-purple-600 transition-colors`}
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {service.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * idx }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 text-gray-600"
                    >
                      <span className="text-brandSecondary text-xl">✓</span>
                      <span className="text-sm font-medium">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <span
                    className={`text-sm font-bold ${service.textColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    Learn More →
                  </span>
                  <motion.div
                    className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center mt-16"
      >
        <Link
          href="/contact"
          className="inline-block bg-gradient-to-r from-primary to-brandSecondary hover:from-primary/90 hover:to-brandSecondary/90 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          Discuss Your Project Needs
          <span className="ml-2">→</span>
        </Link>
      </motion.div>
    </section>
  );
}

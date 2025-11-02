import { motion } from "framer-motion";
import { FaPaintBrush, FaStore, FaGlobe } from "react-icons/fa";
import React from "react";
import Link from "next/link";
// Original service data
const services = [
  {
    icon: <FaPaintBrush className="w-7 h-7" />,
    title: "Website Reskin",
    description:
      "Give your existing website a calm, modern facelift while keeping the foundations that already work.",
    features: [
      "UI refresh aligned to your brand",
      "Accessibility & responsiveness",
      "Performance tuning",
      "Copy and content polish",
    ],
    link: "/services/website-reskin",
  },
  {
    icon: <FaGlobe className="w-7 h-7" />,
    title: "Brochure Websites",
    description:
      "Launch a trusted presence that explains who you are, what you do, and why people should work with you.",
    features: [
      "Strategy & copy support",
      "Custom visual design",
      "Search-friendly build",
      "CMS hand-off & training",
    ],
    link: "/services/brochure-websites",
  },
  {
    icon: <FaStore className="w-7 h-7" />,
    title: "E-commerce Solutions",
    description:
      "Build a resilient storefront with payments, fulfilment, and analytics baked in from day one.",
    features: [
      "Checkout & payments",
      "Catalogue + inventory",
      "Email & CRM automation",
      "Operations dashboards",
    ],
    link: "/services/ecommerce-solutions",
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
        <span className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-semibold mb-6 shadow-sm">
          Services
        </span>
        <h2 className="font-heading text-4xl md:text-5xl leading-tight text-slate-900">
          Offerings shaped around calm, reliable delivery
        </h2>
        <p className="mt-4 text-base text-slate-600 max-w-3xl mx-auto">
          Each engagement blends strategy, design, and engineering so you ship momentum—not just features.
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
              <div className="h-full rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group cursor-pointer">
                <div className="flex items-center mb-6">
                  <motion.div
                    className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700"
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ duration: 0.3 }}
                  >
                    {React.cloneElement(service.icon, {
                      className: "w-7 h-7",
                    })}
                  </motion.div>
                </div>
                <h3 className="font-heading text-2xl text-slate-900 mb-3 leading-snug">
                  {service.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 * idx }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 text-slate-500"
                    >
                      <span className="inline-flex h-2 w-2 rounded-full bg-slate-400" />
                      <span className="text-sm font-medium">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8 inline-flex items-center gap-2 text-slate-800 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
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
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-slate-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1"
        >
          Discuss your project needs
          <span>→</span>
        </Link>
      </motion.div>
    </section>
  );
}

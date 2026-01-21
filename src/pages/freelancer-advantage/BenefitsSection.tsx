// Converted to TypeScript - migrated
import React from "react";
import { motion } from "framer-motion";
import { FaDollarSign, FaComments, FaRocket, FaHandshake, FaLightbulb, FaBullseye } from "react-icons/fa";

const benefits = [
  {
    icon: FaDollarSign,
    title: "Lower Costs",
    description: "Freelancers have minimal overhead and no agency markup fees. You're paying for talent, not fancy office or project managers.",
  },
  {
    icon: FaComments,
    title: "Direct Communication",
    description: "No more message relay through account managers. Speak directly with person building your website for clearer communication.",
  },
  {
    icon: FaRocket,
    title: "Faster Delivery",
    description: "Freelancers don't have agency bureaucracy. Decisions and changes happen quickly, cutting project time by weeks or even months.",
  },
  {
    icon: FaHandshake,
    title: "Personal Attention",
    description: "Freelancers take on fewer clients than agencies, ensuring your project gets focused attention it deserves.",
  },
  {
    icon: FaLightbulb,
    title: "Creative Freedom",
    description: "Freelancers aren't bound by rigid agency processes, allowing for more creative approaches and innovative solutions to your challenges.",
  },
  {
    icon: FaBullseye,
    title: "Specialized Expertise",
    description: "Choose a freelancer with exact skill set your project needs, rather than getting assigned whoever is available at an agency.",
  },
];

const BenefitsSection = () => (
  <section id="benefits" className="py-20 md:py-32 bg-slate-50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
          <h2 className="font-heading text-5xl md:text-6xl text-slate-900 mb-6 flex items-center justify-center gap-6">
            Why Choose a Freelancer?
          </h2>
          <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
            Make smart choice for your business website by going direct to source
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="h-full p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group rounded-2xl bg-white"
          >
            <div className="flex items-center justify-between mb-6">
              <motion.div className="text-5xl" whileHover={{ scale: 1.2, rotate: 10 }} transition={{ duration: 0.3 }}>
                <benefit.icon className="text-slate-700" />
              </motion.div>
            </div>
            <h3 className="font-heading text-2xl text-slate-900 mb-4">{benefit.title}</h3>
            <p className="text-slate-600 leading-relaxed text-lg">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;


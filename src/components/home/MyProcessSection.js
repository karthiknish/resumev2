import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  PencilRuler,
  Code,
  TestTubeDiagonal,
  Rocket,
  Wrench,
} from "lucide-react"; // Icons for steps

const processSteps = [
  {
    icon: <Search size={28} className="text-slate-700" />,
    title: "1. Discovery & Planning",
    description:
      "We start by mapping the product goals, constraints, and edge cases so we’re clear on what success looks like before a single line of code.",
  },
  {
    icon: <PencilRuler size={28} className="text-slate-700" />,
    title: "2. Design & Prototyping",
    description:
      "We explore flows and interfaces collaboratively, validating the experience through fast prototypes before committing to build.",
  },
  {
    icon: <Code size={28} className="text-slate-700" />,
    title: "3. Development",
    description:
      "Implementation happens in focused iterations with transparent progress, thoughtful architecture, and clean, maintainable code.",
  },
  {
    icon: <TestTubeDiagonal size={28} className="text-slate-700" />,
    title: "4. Testing & QA",
    description:
      "We pressure-test the product with automated and manual checks to ensure performance, accessibility, and reliability across environments.",
  },
  {
    icon: <Rocket size={28} className="text-slate-700" />,
    title: "5. Deployment",
    description:
      "Ship confidently with streamlined release playbooks, infrastructure setup, and clearly documented hand-offs for your team.",
  },
  {
    icon: <Wrench size={28} className="text-slate-700" />,
    title: "6. Support & Maintenance",
    description:
      "Post-launch, we iterate on feedback, monitor health, and keep the experience sharp so your roadmap keeps moving forward.",
  },
];

const MyProcessSection = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-24 bg-background">
      <div className="absolute inset-0 -z-30">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-white/70 to-transparent" />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(226,232,240,0.35),_transparent_70%)]" />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12 space-y-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-heading text-3xl sm:text-4xl text-center text-slate-900"
        >
          My development process
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="flex flex-col items-center text-center p-7 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <div className="mb-6 p-4 rounded-full border border-slate-200 bg-slate-100">
                {step.icon}
              </div>
              <h3 className="font-heading text-lg text-slate-900 mb-2 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-slate-100 px-7 py-3 text-base font-semibold shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            Ready to start? Get in touch →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MyProcessSection;

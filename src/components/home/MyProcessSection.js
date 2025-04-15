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
    icon: <Search size={32} className="text-blue-400" />,
    title: "1. Discovery & Planning",
    description:
      "We start by deeply understanding your goals, target audience, and project requirements. We define the scope, features, and create a clear roadmap.",
  },
  {
    icon: <PencilRuler size={32} className="text-purple-400" />,
    title: "2. Design & Prototyping",
    description:
      "Based on the plan, I design intuitive user interfaces (UI) and user experiences (UX). Prototypes are created for feedback before development begins.",
  },
  {
    icon: <Code size={32} className="text-emerald-400" />,
    title: "3. Development",
    description:
      "Using modern technologies and best practices, I build your application with clean, efficient, and scalable code. Regular updates are provided.",
  },
  {
    icon: <TestTubeDiagonal size={32} className="text-yellow-400" />,
    title: "4. Testing & QA",
    description:
      "Rigorous testing is performed across different devices and browsers to ensure functionality, performance, security, and a bug-free experience.",
  },
  {
    icon: <Rocket size={32} className="text-red-400" />,
    title: "5. Deployment",
    description:
      "Once approved, I handle the deployment process, launching your application smoothly onto your chosen hosting environment or cloud platform.",
  },
  {
    icon: <Wrench size={32} className="text-orange-400" />,
    title: "6. Support & Maintenance",
    description:
      "Post-launch, I offer ongoing support and maintenance packages to ensure your application remains up-to-date, secure, and performs optimally.",
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
    <section className="bg-black py-16 md:py-24">
      <div className="container mx-auto px-4 space-y-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl text-center font-bold sm:text-4xl mb-12 md:mb-16 text-white font-calendas"
        >
          My Development Process
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {processSteps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="flex flex-col items-center text-center p-6 bg-gray-800/40 rounded-xl border border-gray-700/80"
            >
              <div className="mb-4 p-3 bg-gray-700/50 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 font-calendas">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
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
            className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors shadow-lg"
          >
            Ready to Start? Get in Touch →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MyProcessSection;

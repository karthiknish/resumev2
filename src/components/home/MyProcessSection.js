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
    <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16 md:py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-200/20 to-pink-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 space-y-12 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl text-center font-bold sm:text-4xl mb-12 md:mb-16 font-calendas"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            My Development Process
          </span>
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
              className="flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-purple-200 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all duration-300 group"
            >
              <div className="mb-6 p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full border-2 border-purple-200 group-hover:border-purple-300 transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 font-calendas" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
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
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Ready to Start? Get in Touch →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MyProcessSection;

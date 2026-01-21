// Converted to TypeScript - migrated
import React from "react";
import { motion } from "framer-motion";

const HeroSection = ({ onContactClick }) => (
  <section className="relative py-28 min-h-screen flex items-center justify-center overflow-hidden bg-white text-slate-900">
    <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.05),_transparent_62%)]" />
    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(236,72,153,0.05),_transparent_58%)]" />

    <motion.div
      className="absolute top-32 left-32 text-6xl opacity-10"
      animate={{
        y: [0, -30, 0],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute top-20 right-40 text-5xl opacity-10"
      animate={{
        y: [0, 20, 0],
        x: [0, 15, 0],
        rotate: [0, -15, 15, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1,
      }}
    />
    <motion.div
      className="absolute bottom-40 left-40 text-4xl opacity-10"
      animate={{
        rotate: [0, 360],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute bottom-32 right-32 text-5xl opacity-10"
      animate={{
        scale: [1, 1.3, 1],
        y: [0, -15, 0],
        rotate: [0, 20, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      }}
    />

    <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500 mb-8">
          <span>Freelancer Advantage</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-heading text-6xl md:text-8xl lg:text-9xl mb-8 leading-tight tracking-tight text-slate-900">
          <span className="text-slate-900">Direct. Fast.</span>
          <br />
          <span className="text-slate-500">Cost-Effective.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="text-2xl md:text-3xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
          Skip the agency markup and connect{" "}
          <motion.span className="inline-block text-slate-900 font-bold" whileHover={{ scale: 1.05 }}>
            directly with the talent
          </motion.span>{" "}
          building your website.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="text-lg text-slate-500 mb-12 flex items-center justify-center gap-3">
          <span>Get faster turnarounds, personalized attention, and exceptional results</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <motion.button className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-5 text-xl font-bold rounded-2xl shadow-xl transition-all duration-300 border-0 flex items-center gap-3" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} onClick={onContactClick}>
            Let's build something amazing
          </motion.button>

          <motion.a href="#benefits" className="bg-transparent border-2 border-slate-200 text-slate-900 hover:bg-slate-50 px-10 py-5 text-xl font-bold rounded-2xl transition-all duration-300 flex items-center gap-3" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
            See advantages
          </motion.a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.5 }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="text-4xl text-slate-300" />
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;


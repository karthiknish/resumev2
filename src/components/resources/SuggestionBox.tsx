// Converted to TypeScript - migrated
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "../animations/MotionComponents";

const SuggestionBox: React.FC = () => {
  return (
    <motion.div
      className="bg-white border border-slate-200 p-10 sm:p-12 md:p-14 rounded-3xl shadow-sm text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="font-heading text-3xl md:text-4xl text-slate-900 mb-6 flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <span>Suggest a resource</span>
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-3xl"
        >
          💡
        </motion.span>
      </motion.h2>
      
      <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
        Know a great resource that others would find helpful? Share it and I’ll take a look at adding it to the library of tools and guides.
        <motion.span
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-block ml-2"
        >
          🚀
        </motion.span>
      </p>
      
      <motion.div
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 px-7 py-3.5 bg-slate-900 text-slate-100 hover:bg-slate-800 font-semibold text-base rounded-2xl transition-all duration-200 shadow-sm hover:shadow-lg"
        >
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-lg"
          >
            📩
          </motion.span>
          Suggest a resource
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            →
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default SuggestionBox;


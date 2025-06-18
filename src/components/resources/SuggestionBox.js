import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "../animations/MotionComponents";

const SuggestionBox = () => {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-12 md:p-16 rounded-3xl shadow-2xl text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-black mb-8 flex items-center justify-center gap-4"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Suggest a Resource
        </span>
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
      
      <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
        Know a great resource that should be included here? I'm always looking to expand this collection with
        <span className="font-bold text-purple-600"> high-quality content</span>.
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
          className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black text-xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl"
        >
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-2xl"
          >
            📩
          </motion.span>
          Suggest Resource
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

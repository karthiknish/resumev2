import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FadeIn } from "../animations/MotionComponents";

const SuggestionBox = () => {
  return (
    <FadeIn>
      <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-blue-500/20 text-center">
        <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Suggest a Resource
        </h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
          Know a great resource that should be included here? I'm always looking
          to expand this collection with high-quality content.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
        >
          Suggest Resource →
        </Link>
      </div>
    </FadeIn>
  );
};

export default SuggestionBox;

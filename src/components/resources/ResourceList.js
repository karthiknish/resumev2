import React from "react";
import ResourceCard from "./ResourceCard";
import { motion } from "framer-motion";
import { HoverCard } from "../animations/MotionComponents";

const ResourceList = ({ resources, clearFilters }) => {
  if (resources.length === 0) {
    return (
      <motion.div
        className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-12 rounded-3xl shadow-xl text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-6xl mb-6"
        >
          🔍
        </motion.div>
        <h3 className="text-3xl font-black text-gray-800 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          No Resources Found
        </h3>
        <p className="text-gray-600 mb-8 text-xl font-medium">
          No resources found matching your search criteria.
        </p>
        <motion.button
          onClick={clearFilters}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="text-xl"
          >
            🔄
          </motion.span>
          Clear Filters
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {resources.map((resource, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <ResourceCard resource={resource} />
        </motion.div>
      ))}
    </div>
  );
};

export default ResourceList;

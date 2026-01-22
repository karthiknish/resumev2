// Converted to TypeScript - migrated
import React from "react";
import ResourceCard from "./ResourceCard";
import { motion } from "framer-motion";
import { HoverCard } from "../animations/MotionComponents";
import { Resource } from "@/data/resources";

interface ResourceListProps {
  resources: Resource[];
  clearFilters: () => void;
}

const ResourceList: React.FC<ResourceListProps> = ({ resources, clearFilters }) => {
  if (resources.length === 0) {
    return (
      <motion.div
        className="bg-white border border-slate-200 p-10 sm:p-12 rounded-3xl shadow-sm text-center"
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
        <h3 className="font-heading text-2xl sm:text-3xl text-slate-900 mb-4">
          No resources found
        </h3>
        <p className="text-slate-600 mb-8 text-base sm:text-lg font-medium">
          Try adjusting your filters or search to uncover more helpful tools.
        </p>
        <motion.button
          onClick={clearFilters}
          className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 text-slate-100 hover:bg-slate-800 font-semibold text-sm sm:text-base rounded-2xl transition-all duration-200 shadow-sm hover:shadow-lg"
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
            className="text-base"
          >
            🔄
          </motion.span>
          Clear filters
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


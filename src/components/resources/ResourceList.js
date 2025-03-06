import React from "react";
import ResourceCard from "./ResourceCard";
import { motion } from "framer-motion";
import { HoverCard } from "../animations/MotionComponents";

const ResourceList = ({ resources, clearFilters }) => {
  if (resources.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl shadow-2xl border border-blue-500/20 text-center">
        <p className="text-gray-300 mb-4 text-lg">
          No resources found matching your search criteria.
        </p>
        <button
          onClick={clearFilters}
          className="inline-block px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {resources.map((resource, index) => (
        <HoverCard key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ResourceCard key={index} resource={resource} />
          </motion.div>
        </HoverCard>
      ))}
    </div>
  );
};

export default ResourceList;

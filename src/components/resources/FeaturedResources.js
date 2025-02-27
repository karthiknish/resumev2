import React from "react";
import { motion } from "framer-motion";
import ResourceCard from "./ResourceCard";

const FeaturedResources = ({ resources }) => {
  // Filter to only feature non-code resources
  const featuredResources = resources.filter(
    (resource) => resource.featured && resource.category !== "code"
  );

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Featured Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredResources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ResourceCard resource={resource} featured={true} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedResources;

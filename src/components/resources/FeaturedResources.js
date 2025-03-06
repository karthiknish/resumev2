import React from "react";
import { motion } from "framer-motion";
import ResourceCard from "./ResourceCard";
import { HoverCard } from "../animations/MotionComponents";

const FeaturedResources = ({ resources }) => {
  // Filter to only feature non-code resources
  const featuredResources = resources.filter(
    (resource) => resource.featured && resource.category !== "code"
  );

  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Featured Resources
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredResources.map((resource, index) => (
          <HoverCard key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <ResourceCard resource={resource} featured={true} />
            </motion.div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

export default FeaturedResources;

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
    <div className="mb-16">
      <motion.h2
        className="font-heading text-3xl sm:text-4xl md:text-5xl text-slate-900 mb-10 flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <span>Featured resources</span>
      
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

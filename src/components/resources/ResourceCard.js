import React from "react";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

const ResourceCard = ({ resource, featured = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gray-900 rounded-lg p-6 ${
        featured ? "h-full flex flex-col" : ""
      }`}
    >
      <h3 className="text-xl font-bold text-white mb-3">{resource.title}</h3>
      <p className={`text-gray-300 mb-4 ${featured ? "flex-grow" : ""}`}>
        {resource.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {resource.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${
          featured
            ? "text-blue-400 hover:text-blue-300 flex items-center"
            : "inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
        }`}
      >
        {featured ? (
          <>
            Visit Resource <FaExternalLinkAlt className="ml-2" />
          </>
        ) : (
          "View Resource"
        )}
      </a>
    </motion.div>
  );
};

export default ResourceCard;

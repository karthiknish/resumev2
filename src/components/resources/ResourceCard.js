import React from "react";
import { motion } from "framer-motion";
import { FaExternalLinkAlt } from "react-icons/fa";

const ResourceCard = ({ resource, featured = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-8 rounded-3xl shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all duration-300 group ${
        featured
          ? "h-full flex flex-col"
          : ""
      }`}
    >
      <h3
        className="text-2xl md:text-3xl font-black mb-4 text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        {resource.title}
      </h3>
      <p
        className={`text-gray-700 mb-6 leading-relaxed text-lg font-medium ${
          featured ? "flex-grow" : ""
        }`}
      >
        {resource.description}
      </p>
      <div className="flex flex-wrap gap-3 mb-6">
        {resource.tags.map((tag, idx) => (
          <motion.span
            key={idx}
            className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full font-semibold border border-purple-200 hover:from-purple-200 hover:to-blue-200 transition-all duration-300 text-sm"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
      <motion.a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`${
          featured
            ? "inline-flex items-center gap-2 text-purple-600 hover:text-blue-600 font-bold text-lg transition-colors duration-300"
            : "inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
        }`}
        whileHover={{ scale: 1.05, x: featured ? 5 : 0 }}
        whileTap={{ scale: 0.95 }}
      >
        {featured ? (
          <>
            Visit Resource 
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaExternalLinkAlt className="text-sm" />
            </motion.div>
          </>
        ) : (
          <>
            <span>View Resource</span>
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FaExternalLinkAlt className="text-sm" />
            </motion.div>
          </>
        )}
      </motion.a>
    </motion.div>
  );
};

export default ResourceCard;

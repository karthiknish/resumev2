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
      className={`bg-white border border-slate-200 p-7 rounded-3xl shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200 group ${
        featured ? "h-full flex flex-col" : ""
      }`}
    >
      <h3
        className="font-heading text-2xl md:text-3xl text-slate-900 mb-4 group-hover:text-slate-700 transition-colors duration-200"
      >
        {resource.title}
      </h3>
      <p
        className={`text-slate-600 mb-6 leading-relaxed text-sm sm:text-base ${
          featured ? "flex-grow" : ""
        }`}
      >
        {resource.description}
      </p>
      <div className="flex flex-wrap gap-3 mb-6">
        {resource.tags.map((tag, idx) => (
          <motion.span
            key={idx}
            className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium border border-slate-200 transition-all duration-200 text-xs sm:text-sm"
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
            ? "inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 font-semibold text-base transition-colors duration-200"
            : "inline-flex items-center gap-2 border border-slate-200 text-slate-900 hover:text-slate-700 hover:border-slate-300 bg-white font-semibold py-2.5 px-5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-lg"
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

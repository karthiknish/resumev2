import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  paginate,
  filteredResourcesLength,
  indexOfFirstItem,
  indexOfLastItem,
}) => {
  return (
    <>
      {totalPages > 1 && (
        <motion.div
          className="flex justify-center items-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`mx-2 px-4 py-3 rounded-2xl font-bold text-lg border-2 transition-all duration-300 ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 shadow-lg hover:shadow-xl"
            }`}
            aria-label="Previous page"
            whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
            whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Page numbers */}
          <div className="flex gap-2">
            {/* First page */}
            {currentPage > 2 && (
              <motion.button
                onClick={() => paginate(1)}
                className="w-12 h-12 rounded-2xl font-bold text-lg border-2 bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                1
              </motion.button>
            )}

            {/* Ellipsis for large gaps */}
            {currentPage > 3 && (
              <span className="flex items-center px-3 text-gray-500 font-bold text-lg">
                ...
              </span>
            )}

            {/* Previous page (if not first) */}
            {currentPage > 1 && (
              <motion.button
                onClick={() => paginate(currentPage - 1)}
                className="w-12 h-12 rounded-2xl font-bold text-lg border-2 bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPage - 1}
              </motion.button>
            )}

            {/* Current page */}
            <motion.button
              onClick={() => paginate(currentPage)}
              className="w-12 h-12 rounded-2xl font-bold text-lg border-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-600 shadow-xl"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {currentPage}
            </motion.button>

            {/* Next page (if not last) */}
            {currentPage < totalPages && (
              <motion.button
                onClick={() => paginate(currentPage + 1)}
                className="w-12 h-12 rounded-2xl font-bold text-lg border-2 bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPage + 1}
              </motion.button>
            )}

            {/* Ellipsis for large gaps */}
            {currentPage < totalPages - 2 && (
              <span className="flex items-center px-3 text-gray-500 font-bold text-lg">
                ...
              </span>
            )}

            {/* Last page */}
            {currentPage < totalPages - 1 && (
              <motion.button
                onClick={() => paginate(totalPages)}
                className="w-12 h-12 rounded-2xl font-bold text-lg border-2 bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {totalPages}
              </motion.button>
            )}
          </div>

          <motion.button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`mx-2 px-4 py-3 rounded-2xl font-bold text-lg border-2 transition-all duration-300 ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 shadow-lg hover:shadow-xl"
            }`}
            aria-label="Next page"
            whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
            whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      )}

      {/* Results summary */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <div className="bg-white/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl px-6 py-3 inline-flex items-center gap-2 shadow-lg">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
            {/* Lucide icon: List */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="3" cy="6" r="1" />
              <circle cx="3" cy="12" r="1" />
              <circle cx="3" cy="18" r="1" />
            </svg>
          </span>
          <span className="text-primary font-semibold text-lg">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredResourcesLength)} of{" "}
            <span className="text-primary font-bold">
              {filteredResourcesLength}
            </span>{" "}
            resources
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default Pagination;

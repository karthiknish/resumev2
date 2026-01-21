// Converted to TypeScript - migrated
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
            className={`mx-2 px-4 py-2.5 rounded-2xl font-semibold text-sm sm:text-base border transition-all duration-200 ${
              currentPage === 1
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-slate-900 shadow-sm hover:shadow"
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
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base border bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow"
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
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base border bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentPage - 1}
              </motion.button>
            )}

            {/* Current page */}
            <motion.button
              onClick={() => paginate(currentPage)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base border bg-slate-900 text-slate-100 border-slate-900 shadow-sm"
            >
              {currentPage}
            </motion.button>

            {/* Next page (if not last) */}
            {currentPage < totalPages && (
              <motion.button
                onClick={() => paginate(currentPage + 1)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-semibold text-sm sm:text-base border bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow"
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
            className={`mx-2 px-4 py-2.5 rounded-2xl font-semibold text-sm sm:text-base border transition-all duration-200 ${
              currentPage === totalPages
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-slate-900 shadow-sm hover:shadow"
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
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-2.5 inline-flex items-center gap-2 shadow-sm">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700">
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
          <span className="text-slate-600 font-medium text-sm sm:text-base">
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


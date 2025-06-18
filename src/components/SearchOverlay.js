import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";
import { Loader2 } from "lucide-react";

// Define the component as a const
const SearchOverlay = ({
  toggleSearch,
  searchInputRef,
  searchQuery,
  handleSearchChange,
  isSearching,
  searchResults,
  handleResultClick,
  debouncedSearchQuery,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-black/95 to-blue-900/95 backdrop-blur-lg z-[110] flex flex-col items-center justify-start pt-20 sm:pt-28 p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative Color Splashes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-88 h-88 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      {/* Close Button */}
      <motion.button
        onClick={toggleSearch}
        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-[111] p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
        aria-label="Close Search"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaTimesCircle size={30} />
      </motion.button>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-2xl mb-6"
      >
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search articles and bytes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-6 py-4 rounded-full bg-white/90 backdrop-blur-sm text-gray-800 text-xl border-2 border-purple-200 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-200 placeholder:text-gray-500 font-medium shadow-xl transition-all duration-300"
          autoFocus
        />
      </motion.div>

      {/* Search Results Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl flex-grow overflow-y-auto pb-10 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {(searchResults.length > 0 || isSearching) &&
          debouncedSearchQuery.trim().length >= 2 && (
            <div className="space-y-4">
              {isSearching && (
                <div className="p-6 text-purple-600 text-center flex justify-center items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200 shadow-lg">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-500" /> 
                  <span className="font-semibold text-lg">Searching...</span>
                </div>
              )}
              {!isSearching &&
                searchResults.map((result) => (
                  <Link
                    href={
                      result.type === "blog"
                        ? `/blog/${result.slug}`
                        : `/bytes#${result._id}`
                    }
                    key={result._id}
                    onClick={handleResultClick}
                    className="block p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200 hover:bg-white hover:border-purple-300 hover:shadow-xl transition-all duration-300 group"
                  >
                    <p className="font-bold text-gray-900 truncate text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                      {result.type === "blog" ? result.title : result.headline}
                      <span className="ml-2 text-xs uppercase font-semibold text-purple-600 bg-gradient-to-r from-purple-100 to-blue-100 px-2 py-1 rounded-full border border-purple-200">
                        {result.type}
                      </span>
                    </p>
                    {result.type === "blog" && result.description && (
                      <p className="text-sm text-gray-600 truncate mt-2 leading-relaxed">
                        {result.description}
                      </p>
                    )}
                    {result.type === "byte" && result.body && (
                      <p className="text-sm text-gray-600 truncate mt-2 leading-relaxed">
                        {result.body}
                      </p>
                    )}
                  </Link>
                ))}
              {!isSearching &&
                searchResults.length === 0 &&
                debouncedSearchQuery.trim().length >= 2 && (
                  <div className="p-8 text-center bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200 shadow-lg">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-4xl mb-4"
                    >
                      🔍
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      No results found
                    </h3>
                    <p className="text-gray-600">
                      No results found for &quot;<span className="font-semibold text-purple-600">{debouncedSearchQuery}</span>&quot;.
                    </p>
                  </div>
                )}
            </div>
          )}
        {/* Prompt to search if input is short */}
        {!isSearching &&
          debouncedSearchQuery.trim().length > 0 &&
          debouncedSearchQuery.trim().length < 2 && (
            <div className="p-6 text-center bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200 shadow-lg">
              <span className="text-2xl mb-2 block">⌨️</span>
              <p className="text-gray-600 font-medium">
                Keep typing to search...
              </p>
            </div>
          )}
        {/* Initial state prompt */}
        {!isSearching && debouncedSearchQuery.trim().length === 0 && (
          <div className="p-8 text-center bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-purple-200 shadow-lg">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-4xl mb-4"
            >
              🔍
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Start your search
            </h3>
            <p className="text-gray-600">
              Search for blog posts or bytes to discover content.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Wrap the component with React.memo for performance optimization and export as default
export default React.memo(SearchOverlay);

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
      className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[110] flex flex-col items-center justify-start pt-20 sm:pt-28 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close Button */}
      <motion.button
        onClick={toggleSearch}
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-[111]"
        aria-label="Close Search"
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
          className="w-full px-6 py-4 rounded-full bg-gray-800 text-white text-xl border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                <div className="p-4 text-gray-400 text-center flex justify-center items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Searching...
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
                    className="block p-5 bg-gray-800/60 rounded-lg hover:bg-gray-700/80 transition-colors group"
                  >
                    <p className="font-semibold text-white truncate text-lg group-hover:text-blue-400 transition-colors">
                      {result.type === "blog" ? result.title : result.headline}
                      <span className="ml-2 text-xs uppercase font-normal text-gray-400 bg-gray-700 px-1.5 py-0.5 rounded">
                        {result.type}
                      </span>
                    </p>
                    {result.type === "blog" && result.description && (
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {result.description}
                      </p>
                    )}
                    {result.type === "byte" && result.body && (
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {result.body}
                      </p>
                    )}
                  </Link>
                ))}
              {!isSearching &&
                searchResults.length === 0 &&
                debouncedSearchQuery.trim().length >= 2 && (
                  <div className="p-4 text-gray-400 text-center">
                    No results found for &quot;{debouncedSearchQuery}&quot;.
                  </div>
                )}
            </div>
          )}
        {/* Prompt to search if input is short */}
        {!isSearching &&
          debouncedSearchQuery.trim().length > 0 &&
          debouncedSearchQuery.trim().length < 2 && (
            <div className="p-4 text-gray-500 text-center">
              Keep typing to search...
            </div>
          )}
        {/* Initial state prompt */}
        {!isSearching && debouncedSearchQuery.trim().length === 0 && (
          <div className="p-4 text-gray-500 text-center">
            Search for blog posts or bytes.
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Wrap the component with React.memo for performance optimization and export as default
export default React.memo(SearchOverlay);

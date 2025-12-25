import React, { useEffect } from "react";
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
  // Handle Escape key to close overlay
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        toggleSearch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return (
    <motion.div
      className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[110] flex flex-col items-center justify-start pt-20 sm:pt-28 p-4 relative overflow-hidden min-h-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(30,41,59,0.6),_transparent_70%)]" />
      {/* Close Button */}
      <motion.button
        onClick={toggleSearch}
        className="absolute top-6 right-6 text-slate-200 hover:text-white transition-colors z-[111] p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
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
          className="w-full px-6 py-4 rounded-full bg-white/95 text-slate-900 text-xl border border-slate-200 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200 placeholder:text-slate-500 font-medium shadow-sm transition-all duration-300"
          autoFocus
        />
      </motion.div>

      {/* Search Results Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl flex-1 min-h-0 overflow-y-auto pb-10 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
      >
        {(searchResults.length > 0 || isSearching) &&
          debouncedSearchQuery.trim().length >= 2 && (
            <div className="space-y-4">
              {isSearching && (
                <div className="p-6 text-slate-600 text-center flex justify-center items-center gap-3 bg-white/90 rounded-2xl border border-slate-200 shadow-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
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
                    className="block p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-400 hover:shadow-lg transition-all duration-300 group"
                  >
                    <p className="font-heading text-lg text-slate-900 truncate group-hover:text-slate-700 transition-colors duration-300">
                      {result.type === "blog" ? result.title : result.headline}
                      <span className="ml-2 text-xs uppercase font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                        {result.type}
                      </span>
                    </p>
                    {result.type === "blog" && result.description && (
                      <p className="text-sm text-slate-600 truncate mt-2 leading-relaxed">
                        {result.description}
                      </p>
                    )}
                    {result.type === "byte" && result.body && (
                      <p className="text-sm text-slate-600 truncate mt-2 leading-relaxed">
                        {result.body}
                      </p>
                    )}
                  </Link>
                ))}
              {!isSearching &&
                searchResults.length === 0 &&
                debouncedSearchQuery.trim().length >= 2 && (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-heading text-xl text-slate-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-slate-600">
                      No results found for &quot;<span className="font-semibold text-slate-400">{debouncedSearchQuery}</span>&quot;.
                    </p>
                  </div>
                )}
            </div>
          )}
        {/* Prompt to search if input is short */}
        {!isSearching &&
          debouncedSearchQuery.trim().length > 0 &&
          debouncedSearchQuery.trim().length < 2 && (
            <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-2xl mb-2 block">⌨️</span>
              <p className="text-slate-600 font-medium">
                Keep typing to search...
              </p>
            </div>
          )}
        {/* Initial state prompt */}
        {!isSearching && debouncedSearchQuery.trim().length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            
            <h3 className="font-heading text-xl text-slate-900 mb-2">
              Start your search
            </h3>
            <p className="text-slate-600">
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

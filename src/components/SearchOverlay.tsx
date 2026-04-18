import React, { useEffect, useRef, MouseEvent, KeyboardEvent, ChangeEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimesCircle } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { SearchResult } from "@/types";

interface SearchOverlayProps {
  toggleSearch: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchQuery: string;
  handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isSearching: boolean;
  searchResults: SearchResult[];
  handleResultClick: () => void;
  debouncedSearchQuery: string;
}

const SearchOverlay = ({
  toggleSearch,
  searchInputRef,
  searchQuery,
  handleSearchChange,
  isSearching,
  searchResults,
  handleResultClick,
  debouncedSearchQuery,
}: SearchOverlayProps) => {
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleSearch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Site search"
      className="fixed inset-0 z-[110] flex min-h-0 flex-col items-center justify-start overflow-hidden bg-background/95 p-4 pt-20 backdrop-blur-xl sm:pt-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-mesh-search" aria-hidden />
      <motion.button
        onClick={toggleSearch}
        className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors z-[111] p-2 rounded-full bg-muted/90 backdrop-blur-sm hover:bg-muted"
        aria-label="Close Search"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaTimesCircle size={30} />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-2xl mb-6"
      >
        <input
          ref={searchInputRef}
          type="text"
          id="site-search"
          name="q"
          placeholder="Search articles and bytes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-6 py-4 rounded-full bg-card text-foreground text-xl border border-border focus:outline-none focus:border-ring focus:ring-4 focus:ring-ring/20 placeholder:text-muted-foreground font-medium shadow-sm transition-all duration-300"
          autoFocus
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl flex-1 min-h-0 overflow-y-auto pb-10 scrollbar-thin"
      >
        {(searchResults.length > 0 || isSearching) &&
          debouncedSearchQuery.trim().length >= 2 && (
            <div className="space-y-4">
              {isSearching && (
                <div className="p-6 text-muted-foreground text-center flex justify-center items-center gap-3 bg-card/95 rounded-2xl border border-border shadow-sm">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="font-semibold text-lg">Searching...</span>
                </div>
              )}
              {!isSearching &&
                searchResults.map((result) => (
                  <Link
                    href={
                      result.type === "blog"
                        ? `/blog/${result.slug}`
                        : `/bytes#${result.id}`
                    }
                    key={result.id}
                    onClick={handleResultClick}
                    className="block p-6 bg-card rounded-2xl border border-border hover:border-ring/40 hover:shadow-lg transition-all duration-300 group"
                  >
                    <p className="font-heading text-lg text-foreground truncate group-hover:text-muted-foreground transition-colors duration-300">
                      {result.title}
                      <span className="ml-2 text-xs uppercase font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full border border-border">
                        {result.type}
                      </span>
                    </p>
                    {result.description && (
                      <p className="text-sm text-muted-foreground truncate mt-2 leading-relaxed">
                        {result.description}
                      </p>
                    )}
                  </Link>
                ))}
              {!isSearching &&
                searchResults.length === 0 &&
                debouncedSearchQuery.trim().length >= 2 && (
                  <div className="p-8 text-center bg-card rounded-2xl border border-border shadow-sm">
                    <h3 className="font-heading text-xl text-foreground mb-2">
                      No results found
                    </h3>
                    <p className="text-muted-foreground">
                      No results found for &quot;<span className="font-semibold text-muted-foreground/80">{debouncedSearchQuery}</span>&quot;.
                    </p>
                  </div>
                )}
            </div>
          )}
        {!isSearching &&
          debouncedSearchQuery.trim().length > 0 &&
          debouncedSearchQuery.trim().length < 2 && (
            <div className="p-6 text-center bg-card rounded-2xl border border-border shadow-sm">
              <span className="text-2xl mb-2 block">⌨️</span>
              <p className="text-muted-foreground font-medium">
                Keep typing to search...
              </p>
            </div>
          )}
        {!isSearching && debouncedSearchQuery.trim().length === 0 && (
          <div className="p-8 text-center bg-card rounded-2xl border border-border shadow-sm">
            <h3 className="font-heading text-xl text-foreground mb-2">
              Start your search
            </h3>
            <p className="text-muted-foreground">
              Search for blog posts or bytes to discover content.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default React.memo(SearchOverlay);

// src/components/admin/PexelsImageSearch.js
import React, { useState, useCallback } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input"; // Assuming shadcn input
import { Button } from "@/components/ui/button";
import { Loader2, Search, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function PexelsImageSearch({ onImageSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // For potential pagination later
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const searchPexels = useCallback(
    async (searchPage = 1) => {
      if (!searchTerm.trim()) {
        setError("Please enter a search term.");
        return;
      }

      setIsLoading(true);
      setError(null);
      if (searchPage === 1) {
        setPhotos([]);
        setTotalResults(0);
      }

      try {
        const url = `/api/pexels/search?query=${encodeURIComponent(
          searchTerm
        )}&page=${searchPage}&per_page=12`;
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const data = await response.json();

        if (response.ok && data.success) {
          const newPhotos = data.photos || [];
          setPhotos((prevPhotos) =>
            searchPage === 1 ? newPhotos : [...prevPhotos, ...newPhotos]
          );
          setPage(data.page);
          setTotalResults(data.total_results);
          setHasSearched(true);
          if (newPhotos.length === 0 && searchPage === 1) {
            setError("No images found for this search term.");
          }
        } else {
          setError(data.message || "Failed to fetch images");
          setPhotos([]);
          setTotalResults(0);
        }
      } catch (err) {
        setError(err.message || "Error searching images.");
        setPhotos([]); // Clear photos on error
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm]
  ); // Dependency: searchTerm

  const triggerSearch = () => {
    setPage(1);
    searchPexels(1);
  };

  const handleImageClick = (photo) => {
    if (photo && photo.src && photo.src.large) {
      const url = photo.src.large;
      const alt = photo.alt;
      onImageSelect(url, alt);
    } else {
      setError("Selected image data is invalid.");
    }
  };

  const handleLoadMore = () => {
    searchPexels(page + 1);
  };

  // Basic check if more images might be available
  const hasMore = photos.length < totalResults;

  return (
    <div className="space-y-5 p-5 bg-card border border-primary/15 rounded-xl shadow-lg relative">
      <div
        role="search"
        className="flex flex-col sm:flex-row gap-3 sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70 py-3 px-3 -mx-3 -mt-3 z-10 rounded-t-xl border-b border-primary/10"
      >
        <div className="flex-grow flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground hidden sm:block" />
          <Input
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                triggerSearch();
              }
            }}
            placeholder="Search photos (e.g. 'sunset skyline')"
            className="flex-grow bg-background border-input focus-visible:ring-primary text-sm"
            aria-label="Search Pexels images"
            autoComplete="off"
          />
        </div>
        <div className="flex gap-2">
          <Button
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
            type="button"
            disabled={isLoading || !searchTerm.trim()}
            onClick={triggerSearch}
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
          >
            {isLoading && page === 1 ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Search
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] tracking-wide uppercase font-medium text-muted-foreground">
        <div>
          {hasSearched && !isLoading && (
            <span>
              Showing {photos.length}{" "}
              {photos.length === 1 ? "result" : "results"}
              {totalResults > photos.length && ` of ~${totalResults}`}
            </span>
          )}
        </div>
        {error && <span className="text-destructive font-medium">{error}</span>}
      </div>

      <AnimatePresence mode="popLayout">
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {photos.map((photo) => (
              <motion.button
                key={photo.id}
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.18 }}
                className="group relative rounded-lg overflow-hidden shadow-sm ring-1 ring-border/60 hover:ring-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 bg-muted/20"
                onClick={() => handleImageClick(photo)}
                aria-label={`Select image by ${photo.photographer}`}
              >
                <div className="aspect-[4/3] bg-muted/40">
                  <img
                    src={photo.src.landscape || photo.src.medium}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 text-[10px] font-medium">
                  <span className="px-1.5 py-0.5 rounded bg-black/60 text-white truncate max-w-[70%]">
                    {photo.photographer}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    Select
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && page > 1 && (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
        </div>
      )}

      {!isLoading && photos.length === 0 && !error && hasSearched && (
        <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
          <ImageOff className="w-12 h-12 mb-3 text-muted-foreground/60" />
          <span className="text-sm">
            No results for "{searchTerm}". Try different keywords.
          </span>
        </div>
      )}

      {hasMore && !isLoading && (
        <div className="text-center pt-2">
          <Button
            type="button"
            onClick={handleLoadMore}
            variant="outline"
            size="sm"
            className="hover:bg-primary/10 border-primary/30"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default PexelsImageSearch;

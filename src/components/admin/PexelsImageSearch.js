// src/components/admin/PexelsImageSearch.js
import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ImageOff, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

function PexelsImageSearch({ onImageSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to fetch photos (search or curated)
  const fetchPhotos = useCallback(
    async (query, pageNum = 1) => {
      setIsLoading(true);
      setError(null);
      
      // If it's a new search (page 1), clear existing photos immediately for better UX
      // unless we want to keep them while loading (which is often better).
      // Let's keep them but show a loading indicator overlay or similar if needed.
      // For now, we'll just append or replace.
      
      try {
        // Construct URL: if query is empty, the API now handles it as "curated"
        const url = `/api/pexels/search?query=${encodeURIComponent(
          query || ""
        )}&page=${pageNum}&per_page=12`;
        
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        const data = await response.json();

        if (response.ok && data.success) {
          const newPhotos = data.photos || [];
          setPhotos((prev) =>
            pageNum === 1 ? newPhotos : [...prev, ...newPhotos]
          );
          setPage(data.page);
          setTotalResults(data.total_results || 0);
          setHasSearched(!!query); // Only mark as "searched" if there was a query
          
          if (newPhotos.length === 0 && pageNum === 1) {
            if (query) {
              setError("No images found for this search term.");
            } else {
              setError("No curated images found.");
            }
          }
        } else {
          throw new Error(data.message || "Failed to fetch images");
        }
      } catch (err) {
        console.error("Pexels fetch error:", err);
        setError(err.message || "Error fetching images.");
        if (pageNum === 1) setPhotos([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load (Curated)
  useEffect(() => {
    fetchPhotos("", 1);
  }, [fetchPhotos]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!searchTerm.trim()) return;
    fetchPhotos(searchTerm, 1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchPhotos("", 1); // Reset to curated
  };

  const handleLoadMore = () => {
    fetchPhotos(searchTerm, page + 1);
  };

  const handleImageClick = (photo) => {
    if (photo && photo.src && photo.src.large) {
      onImageSelect(photo.src.large, photo.alt);
    } else {
      toast.error("Invalid image data");
    }
  };

  // Skeleton Loader Component
  const PhotoSkeleton = () => (
    <div className="rounded-xl overflow-hidden aspect-[4/3] bg-muted animate-pulse relative">
      <div className="absolute bottom-2 left-2 right-2 h-4 bg-muted-foreground/20 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header / Search Bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4 border-b border-border">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search photos (e.g. 'minimalist desk')"
              className="pl-9 pr-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button type="submit" disabled={isLoading && page === 1}>
            {isLoading && page === 1 ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </form>
        
        {/* Status Bar */}
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {searchTerm ? (
              <>
                <Search className="h-3 w-3" />
                <span>Results for "{searchTerm}"</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Curated Picks</span>
              </>
            )}
          </div>
          {photos.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {photos.length} photos
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto min-h-[300px] p-6">
        {error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6 rounded-xl border border-dashed border-destructive/20 bg-destructive/5">
            <ImageOff className="h-10 w-10 text-destructive/50 mb-3" />
            <p className="text-sm font-medium text-destructive">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchPhotos(searchTerm, 1)}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {photos.map((photo) => (
                <motion.button
                  layout
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleImageClick(photo)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <img
                    src={photo.src.large}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-medium truncate w-full text-left">
                      {photo.photographer}
                    </p>
                    <span className="mt-1 inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase tracking-wide self-start">
                      Select
                    </span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
            
            {/* Loading Skeletons (Append when loading more) */}
            {isLoading && (
              <>
                {[...Array(6)].map((_, i) => (
                  <PhotoSkeleton key={`skeleton-${i}`} />
                ))}
              </>
            )}
          </div>
        )}

        {/* Load More */}
        {!isLoading && photos.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              onClick={handleLoadMore}
              className="text-muted-foreground hover:text-foreground"
            >
              Load More Photos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PexelsImageSearch;

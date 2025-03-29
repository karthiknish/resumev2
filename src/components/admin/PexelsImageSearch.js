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

  const searchPexels = useCallback(
    async (searchPage = 1) => {
      if (!searchTerm.trim()) {
        console.log("[PexelsSearch] Search term empty, returning.");
        setError("Please enter a search term.");
        return;
      }
      console.log(
        `[PexelsSearch] Starting search for: "${searchTerm}", Page: ${searchPage}`
      );
      setIsLoading(true);
      setError(null);
      if (searchPage === 1) {
        console.log("[PexelsSearch] Resetting photos for new search (page 1).");
        setPhotos([]);
        setTotalResults(0);
      } else {
        console.log("[PexelsSearch] Loading more results (page > 1).");
      }

      try {
        console.log("[PexelsSearch] Making API call to /api/pexels/search...");
        const response = await axios.get("/api/pexels/search", {
          params: {
            query: searchTerm,
            page: searchPage,
            per_page: 12, // Load 12 images per page
          },
        });

        console.log("[PexelsSearch] API Response Status:", response.status);
        console.log("[PexelsSearch] API Response Data:", response.data); // Log full data

        if (response.data.success) {
          console.log("[PexelsSearch] Success branch entered."); // Log success branch
          const newPhotos = response.data.photos || [];
          console.log(
            `[PexelsSearch] Success: Received ${newPhotos.length} photos.`
          );
          setPhotos((prevPhotos) => {
            const updatedPhotos =
              searchPage === 1 ? newPhotos : [...prevPhotos, ...newPhotos];
            console.log(
              "[PexelsSearch] Updating photos state. New count:",
              updatedPhotos.length
            );
            return updatedPhotos;
          });
          setPage(response.data.page);
          setTotalResults(response.data.total_results);
          console.log(
            `[PexelsSearch] State updated: page=${response.data.page}, totalResults=${response.data.total_results}`
          );
          if (newPhotos.length === 0 && searchPage === 1) {
            console.log("[PexelsSearch] No results found for the search term.");
            setError("No images found for this search term.");
          }
        } else {
          console.error(
            "[PexelsSearch] API call reported !success:",
            response.data.message
          );
          throw new Error(response.data.message || "Failed to fetch images");
        }
      } catch (err) {
        console.error(
          "[PexelsSearch] Caught error during API call or processing:",
          err
        );
        setError(
          err.response?.data?.message ||
            err.message ||
            "Error searching images."
        );
        setPhotos([]); // Clear photos on error
        setTotalResults(0);
      } finally {
        console.log("[PexelsSearch] Setting isLoading to false.");
        setIsLoading(false);
      }
    },
    [searchTerm]
  ); // Dependency: searchTerm

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("[PexelsSearch] handleSearchSubmit triggered.");
    setPage(1); // Reset page on new search
    searchPexels(1);
  };

  const handleImageClick = (photo) => {
    console.log(
      "[PexelsSearch] handleImageClick START. Photo data:",
      JSON.stringify(photo)
    ); // Log stringified data
    if (photo && photo.src && photo.src.large) {
      const url = photo.src.large;
      const alt = photo.alt;
      console.log(`[PexelsSearch] Valid photo data. URL: ${url}, Alt: ${alt}`);
      console.log("[PexelsSearch] Calling onImageSelect...");
      onImageSelect(url, alt);
      console.log("[PexelsSearch] onImageSelect called.");
    } else {
      console.error(
        "[PexelsSearch] Clicked photo data is missing src.large property:",
        JSON.stringify(photo) // Log stringified data
      );
      setError("Selected image data is invalid."); // Inform user
    }
    console.log("[PexelsSearch] handleImageClick END.");
  };

  const handleLoadMore = () => {
    console.log("[PexelsSearch] handleLoadMore triggered.");
    searchPexels(page + 1);
  };

  // Basic check if more images might be available
  const hasMore = photos.length < totalResults;

  return (
    // Remove max-height and overflow from here
    <div className="space-y-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <form
        onSubmit={handleSearchSubmit}
        className="flex gap-2 sticky top-0 bg-gray-800 py-2 z-10" // Removed comment from className
      >
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Pexels for images..."
          className="flex-grow bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
        <Button
          type="submit"
          disabled={isLoading || !searchTerm.trim()}
          variant="secondary"
        >
          {isLoading && page === 1 ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Search
        </Button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <AnimatePresence>
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Removed max-h and overflow from here, moved to parent div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          >
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="aspect-video rounded overflow-hidden cursor-pointer relative group"
                onClick={() => handleImageClick(photo)} // Updated onClick handler
              >
                <img
                  src={photo.src.landscape || photo.src.medium} // Prefer landscape, fallback to medium
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 bg-black/50 rounded">
                    Select
                  </p>
                </div>
                {/* Pexels Attribution */}
                <a
                  href={photo.photographer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()} // Prevent image selection when clicking link
                  className="absolute bottom-1 right-1 text-white text-[10px] bg-black/60 px-1 py-0.5 rounded opacity-80 hover:opacity-100 transition-opacity text-decoration-none"
                  title={`Photo by ${photo.photographer} on Pexels`}
                >
                  {photo.photographer}
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && page > 1 && (
        <div className="text-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto" />
        </div>
      )}

      {!isLoading && photos.length === 0 && !error && searchTerm && (
        <div className="text-center py-6 text-gray-500 flex flex-col items-center">
          <ImageOff className="w-10 h-10 mb-2" />
          <span>
            No results found for "{searchTerm}". Try a different search.
          </span>
        </div>
      )}

      {/* Basic Load More Button - Can be enhanced later */}
      {hasMore && !isLoading && (
        <div className="text-center mt-4">
          <Button
            onClick={handleLoadMore} // Use specific handler
            variant="outline"
            size="sm"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default PexelsImageSearch;

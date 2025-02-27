import { useState, useEffect } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Card } from "@/components/ui/card";

// Import resource data
import resourcesData from "@/data/resources";

// Import components
import FeaturedResources from "@/components/resources/FeaturedResources";
import ResourceFilters from "@/components/resources/ResourceFilters";
import ResourceList from "@/components/resources/ResourceList";
import Pagination from "@/components/resources/Pagination";
import SuggestionBox from "@/components/resources/SuggestionBox";
import UkSeo from "@/components/UkSeo";
import JsonLd, { createWebsiteSchema } from "@/components/JsonLd";

export default function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  // Filter resources based on search term and active category
  const filteredResources = resourcesData.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      activeCategory === "all" ||
      resource.category === activeCategory ||
      (activeCategory === "uk" && resource.tags.includes("uk"));

    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  useEffect(() => {
    setTotalPages(Math.ceil(filteredResources.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredResources.length, itemsPerPage]);

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top of resource list
      document
        .getElementById("resource-list")
        .scrollIntoView({ behavior: "smooth" });
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory("all");
  };

  // Schema data
  const websiteSchema = createWebsiteSchema();

  return (
    <>
      <UkSeo
        title="Web Development Resources | UK Developer Tools & Tutorials"
        description="A curated collection of web development resources for UK developers, featuring tools, tutorials, and community resources optimised for the British tech ecosystem."
        keywords="UK web development resources, British developer tools, UK coding tutorials, London tech community, React UK resources"
      />

      <JsonLd data={websiteSchema} />

      <div className="min-h-screen bg-black/95 p-8 relative">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="border-none bg-black/60 backdrop-blur-sm p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-white mb-6 font-calendas">
                UK Developer Resources
              </h1>

              <p className="text-gray-300 mb-8 font-calendas max-w-3xl">
                A curated collection of tools, tutorials, articles, and
                resources that I find valuable in my development work across the
                UK. These resources are tailored for the British tech ecosystem,
                with special attention to UK-specific tools and communities.
              </p>

              {/* Featured Resources Section */}
              <FeaturedResources resources={resourcesData} />

              {/* Search and Filter Section */}
              <div className="mb-8" id="resource-list">
                <ResourceFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                />

                {/* Resource List */}
                {filteredResources.length > 0 ? (
                  <>
                    <ResourceList resources={currentItems} />

                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      paginate={paginate}
                      filteredResourcesLength={filteredResources.length}
                      indexOfFirstItem={indexOfFirstItem}
                      indexOfLastItem={indexOfLastItem}
                    />
                  </>
                ) : (
                  <ResourceList resources={[]} clearFilters={clearFilters} />
                )}
              </div>

              {/* Suggestion Box */}
              <SuggestionBox />
            </motion.div>
          </Card>
        </div>
      </div>
    </>
  );
}

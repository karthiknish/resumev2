import React from "react";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { FadeIn, HoverCard } from "../components/animations/MotionComponents";
import PageContainer from "@/components/PageContainer";

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
      <Head>
        <title>
          Web Development Resources | UK Developer Tools & Tutorials
        </title>
        <meta
          name="description"
          content="A curated collection of web development resources for UK developers, featuring tools, tutorials, and community resources optimised for the British tech ecosystem."
        />
      </Head>
      <PageContainer>
        <JsonLd data={websiteSchema} />

        <div className="min-h-screen p-8 md:p-16 max-w-6xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <div className="text-center mb-10">
                <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  UK Developer Resources
                </h1>
                <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
                <p className="text-gray-300 mb-8 max-w-3xl mx-auto text-lg">
                  A curated collection of tools, tutorials, articles, and
                  resources that I find valuable in my development work across
                  the UK. These resources are tailored for the British tech
                  ecosystem, with special attention to UK-specific tools and
                  communities.
                </p>
              </div>

              {/* Featured Resources Section */}
              <FeaturedResources resources={resourcesData} />
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
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
          </FadeIn>

          <FadeIn delay={0.4}>
            {/* Suggestion Box */}

            <SuggestionBox />
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="mt-16 text-center space-y-4">
              <p className="text-xl text-gray-300">
                Looking for personalized development help?
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition-colors"
              >
                Get in Touch →
              </Link>
            </div>
          </FadeIn>
        </div>
      </PageContainer>
    </>
  );
}

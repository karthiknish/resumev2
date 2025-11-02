import React from "react";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
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

        <div
          className="relative min-h-screen bg-background py-24 md:py-32"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_65%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(226,232,240,0.25),_transparent_70%)]" />
          <div className="relative max-w-7xl mx-auto px-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-semibold mb-8 shadow-sm"
              >
                <span>Curated developer resources</span>
              </motion.div>

              <h1
                className="font-heading text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight text-slate-900"
              >
                Dev resources
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium mb-12">
                A hand-picked library of tools, tutorials, and reference materials that keep projects shipping smoothly—from discovery to launch.
              </p>
            </motion.div>

            {/* Featured Resources Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <FeaturedResources resources={resourcesData} />
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
              className="mb-16"
              id="resource-list"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white border border-slate-200 p-6 sm:p-7 rounded-3xl shadow-sm mb-12">
                <ResourceFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                />
              </div>

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
            </motion.div>

            {/* Suggestion Box */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <SuggestionBox />
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-950 text-slate-100 p-10 sm:p-12 md:p-16 rounded-3xl shadow-xl text-center relative overflow-hidden"
            >
              <motion.h2
                className="font-heading text-3xl sm:text-4xl md:text-5xl text-white mb-6 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Need personalised help?
              </motion.h2>

              <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed font-medium relative z-10">
                Want a second pair of eyes on your stack or roadmap? Let’s talk through your goals and map the next steps together.
              </p>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 hover:text-slate-700 font-semibold text-base rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg"
                >
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-lg"
                  >
                    →
                  </motion.span>
                  Discuss your project
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Start
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

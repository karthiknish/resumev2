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
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <PageContainer>
        <JsonLd data={websiteSchema} />

        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-24 md:py-32" style={{ fontFamily: "Inter, sans-serif" }}>
          <div className="max-w-7xl mx-auto px-6">
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
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full text-purple-700 text-sm font-semibold mb-8 shadow-lg"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-xl"
                >
                  📚
                </motion.span>
                <span>Curated Developer Resources</span>
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="text-xl"
                >
                  🇬🇧
                </motion.span>
              </motion.div>
              
              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Dev Resources
                </span>
                <motion.span
                  animate={{
                    rotate: [0, 20, -20, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="inline-block ml-4 text-yellow-400"
                >
                  🛠️
                </motion.span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-700 max-w-5xl mx-auto leading-relaxed font-medium mb-12">
                A curated collection of{" "}
                <motion.span
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  tools, tutorials, and resources
                </motion.span>{" "}
                that I find valuable in my development work across the UK.
                <motion.span
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block ml-2"
                >
                  🎨
                </motion.span>
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
              <div className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 p-8 rounded-3xl shadow-xl mb-12">
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
              className="bg-gradient-to-br from-purple-600 to-blue-600 p-12 md:p-16 rounded-3xl shadow-2xl text-center relative overflow-hidden"
            >
              {/* Floating Elements */}
              <motion.div
                className="absolute top-10 left-10 text-6xl opacity-20"
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 360],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                📚
              </motion.div>
              <motion.div
                className="absolute bottom-10 right-20 text-5xl opacity-20"
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, -45, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                ✨
              </motion.div>
              
              <motion.h2
                className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Need Personalized Help?
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block ml-4 text-yellow-300"
                >
                  🤝
                </motion.span>
              </motion.h2>
              
              <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-4xl mx-auto leading-relaxed font-medium relative z-10">
                Looking for personalized development help or have questions about any of these resources?
                <span className="font-bold text-white"> Let's connect! </span>
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 px-12 py-6 bg-white text-purple-600 hover:text-blue-600 font-black text-xl rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-2xl"
                  >
                    💬
                  </motion.span>
                  Get in Touch
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
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

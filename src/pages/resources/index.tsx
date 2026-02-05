import React, { useState, useMemo } from "react";
import Head from "next/head";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PageContainer from "@/components/PageContainer";
import { FadeIn } from "@/components/animations/MotionComponents";
import resources, { categories } from "@/data/resources";
import ResourceFilters from "@/components/resources/ResourceFilters";
import ResourceList from "@/components/resources/ResourceList";
import FeaturedResources from "@/components/resources/FeaturedResources";
import Pagination from "@/components/resources/Pagination";

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Filter resources based on search term and category
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        activeCategory === "all" || resource.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResources.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory("all");
    setCurrentPage(1);
  };

  return (
    <>
      <Head>
        <title>Resources - Tools, Tutorials & Guides | Karthik Nishanth</title>
        <meta
          name="description"
          content="A curated collection of design and development resources, tools, and tutorials to help you build better products."
        />
        <link rel="canonical" href="https://karthiknish.com/resources" />
      </Head>

      <PageContainer>
        <div className="min-h-screen bg-slate-50/50">
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-32">
            <div className="absolute inset-0 -z-30">
              <Image
                src="/hero-back.jpeg"
                alt="Abstract background"
                fill
                priority
                className="object-cover opacity-20"
              />
            </div>
            <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-white/80 to-transparent" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.1),_transparent_50%)]" />

            <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12 text-center">
              <FadeIn>
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-900/5 border border-slate-900/10 rounded-full text-slate-600 text-sm font-semibold mb-8">
                  <span className="text-lg">📚</span>
                  <span>Knowledge Hub</span>
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl leading-tight text-slate-900 mb-8">
                  Resources for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">modern builders</span>
                </h1>

                <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
                  A hand-picked collection of tools, tutorials, and snippets I use daily to design and develop high-performance applications.
                </p>
              </FadeIn>
            </div>
          </section>

          {/* Main Content */}
          <section className="pb-24">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
              <FeaturedResources resources={resources} />

              <div id="browse" className="scroll-mt-24 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-visible">
                  <div>
                    <h2 className="font-heading text-3xl text-slate-900 mb-2">Browse all</h2>
                    <p className="text-slate-500 font-medium italic">Showing {filteredResources.length} total resources</p>
                  </div>
                </div>

                <ResourceFilters
                  searchTerm={searchTerm}
                  setSearchTerm={(term) => {
                    setSearchTerm(term);
                    setCurrentPage(1);
                  }}
                  activeCategory={activeCategory}
                  setActiveCategory={(cat) => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={(count) => {
                    setItemsPerPage(count);
                    setCurrentPage(1);
                  }}
                />

                <div className="mt-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${searchTerm}-${activeCategory}-${currentPage}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ResourceList
                        resources={currentItems}
                        clearFilters={clearFilters}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {filteredResources.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate}
                    filteredResourcesLength={filteredResources.length}
                    indexOfFirstItem={indexOfFirstItem}
                    indexOfLastItem={indexOfLastItem}
                  />
                )}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.1),_transparent_50%)]" />
            
            <div className="relative max-w-4xl mx-auto px-6 text-center">
              <FadeIn>
                <h2 className="font-heading text-3xl md:text-5xl mb-8">
                  Suggest a resource
                </h2>
                <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto">
                  Found something amazing that should be on this list? I'm always looking for high-quality tools and guides to share with the community.
                </p>
                <div className="flex justify-center">
                  <motion.a
                    href="/contact"
                    className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-lg hover:shadow-white/10 transition-all cursor-pointer"
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send me a message
                  </motion.a>
                </div>
              </FadeIn>
            </div>
          </section>
        </div>
      </PageContainer>
    </>
  );
}

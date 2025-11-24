"use client";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image"; // Import next/image
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed ReactMarkdown import as we'll render plain text snippet
import { FaSearch } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/dbConnect";

function Index({ initialPosts = [], categories = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [allPosts, setAllPosts] = useState([]);

  // Pagination state
  const router = useRouter();
  const initialPage =
    typeof window !== "undefined" && router.query.page
      ? Math.max(1, parseInt(router.query.page, 10) || 1)
      : 1;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const POSTS_PER_PAGE = 10;

  // Initialize directly from props, ensuring date conversion
  useEffect(() => {
    setAllPosts(
      initialPosts.map((post) => ({
        ...post,
        createdAtDate: new Date(post.createdAt),
      }))
    );
  }, [initialPosts]);

  const filteredAndSortedContent = useMemo(() => {
    let filtered = [...allPosts];
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }
    if (searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerSearchTerm) ||
          (post.description && // Search description
            post.description.toLowerCase().includes(lowerSearchTerm))
      );
    }
    filtered.sort((a, b) => {
      return sortOrder === "asc"
        ? a.createdAtDate - b.createdAtDate
        : b.createdAtDate - a.createdAtDate;
    });
    return filtered;
  }, [allPosts, searchTerm, selectedCategory, sortOrder]);

  // Paginated posts
  const totalPages = Math.ceil(
    filteredAndSortedContent.length / POSTS_PER_PAGE
  );
  const paginatedPosts = filteredAndSortedContent.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Sync currentPage with ?page= param in URL
  useEffect(() => {
    const pageParam = parseInt(router.query.page, 10);
    if (!isNaN(pageParam) && pageParam > 0 && pageParam <= totalPages) {
      setCurrentPage(pageParam);
    } else {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.page, totalPages]);

  // Update URL when page changes
  useEffect(() => {
    if (router.query.page !== String(currentPage)) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, page: currentPage },
        },
        undefined,
        { shallow: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Reset to page 1 when filters/search change (and update URL)
  useEffect(() => {
    setCurrentPage(1);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, page: 1 },
      },
      undefined,
      { shallow: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategory, sortOrder]);

  // Scroll to top when currentPage changes
  useEffect(() => {
    // Only scroll if the router is ready and the page has actually changed
    // Avoids scrolling on initial load if page is already 1
    if (router.isReady) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, router.isReady]); // Add router.isReady dependency

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (category) => setSelectedCategory(category);
  const handleSortChange = (value) => setSortOrder(value);

  return (
    <>
      <Head>
        <title>Blog - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Read the latest articles on web development, technology, and more by Karthik Nishanth."
        />
        <meta
          name="keywords"
          content="blog, web development, technology, full stack, cloud, react, nodejs, karthik, nishanth, liverpool, uk"
        />
        <meta name="author" content="Karthik Nishanth" />

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
        <div className="min-h-screen overflow-hidden">
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 -z-30">
              <Image
                src="/hero-back.jpeg"
                alt="Abstract glass background"
                fill
                priority
                sizes="100vw"
                className="object-cover darken-[rgba(0,0,0,0.5)] object-center"
              />
            </div>
            <div className="absolute inset-0 -z-20 bg-white/85 backdrop-blur-sm" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_transparent_62%)]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(236,72,153,0.1),_transparent_58%)]" />

            <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12 pt-24 pb-10 md:pt-32 md:pb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-slate-600 text-sm font-semibold mb-6 shadow-sm">
                  <span>Welcome to the journal</span>
                </div>

                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl leading-tight text-slate-900">
                  Exploring the craft of cross-platform products
                </h1>

                <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                  Essays and notes on product strategy, engineering systems, and the lessons learned while shipping ambitious software with founders and teams.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-16 md:py-20 bg-background">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-card/90 backdrop-blur-sm p-4 sm:p-5 rounded-xl shadow-sm border border-border mb-8"
              >
              <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 items-start xl:items-center">
                {/* Category Filter Dropdown */}
                <div className="w-full xl:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="text-muted-foreground font-medium text-xs sm:text-sm uppercase tracking-[0.18em] whitespace-nowrap">
                    Filter by:
                  </span>
                  <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-full sm:w-48 lg:w-56 h-10 rounded-lg border border-border bg-background/80 px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent/40 hover:text-foreground focus:ring-primary/40">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 border border-border text-foreground rounded-xl shadow-lg">
                      <SelectItem
                        value="All"
                        className="text-sm sm:text-base font-medium hover:bg-accent/40"
                      >
                        All Categories
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="text-sm sm:text-base font-medium hover:bg-accent/40"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="hidden xl:flex flex-grow" />
                {/* Search and Sort */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center w-full xl:w-auto">
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full sm:w-auto items-center rounded-lg border border-border bg-background/80 shadow-sm overflow-hidden"
                  >
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search posts..."
                      className="w-full bg-transparent px-3 sm:px-3.5 py-2.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <motion.button
                      type="button"
                      className="bg-primary text-primary-foreground px-3 sm:px-4 py-2.5 flex items-center justify-center hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FaSearch className="text-sm sm:text-base" />
                    </motion.button>
                  </form>
                  <Select
                    onValueChange={handleSortChange}
                    defaultValue={sortOrder}
                  >
                    <SelectTrigger className="w-full sm:w-[200px] lg:w-[220px] h-10 rounded-lg border border-border bg-background/80 px-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent/40 hover:text-foreground focus:ring-primary/40">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover/95 border border-border text-foreground rounded-xl shadow-lg">
                      <SelectItem
                        value="desc"
                        className="text-sm sm:text-base font-medium hover:bg-accent/40"
                      >
                        Newest First
                      </SelectItem>
                      <SelectItem
                        value="asc"
                        className="text-sm sm:text-base font-medium hover:bg-accent/40"
                      >
                        Oldest First
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>

            {/* Display Search/Filter Status */}
            {(searchTerm.trim() !== "" || selectedCategory !== "All") && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 text-center"
              >
                <p className="text-slate-600 text-lg font-medium bg-white inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200">
                  Showing {filteredAndSortedContent.length} posts
                  {searchTerm.trim() !== "" && ` matching "${searchTerm}"`}
                  {selectedCategory !== "All" && ` in ${selectedCategory}`}
                </p>
              </motion.div>
            )}

            {/* Post List */}
            {filteredAndSortedContent.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  {paginatedPosts.map((post, index) => (
                    <Link key={post._id} href={`/blog/${post.slug}`} className="block">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        className="group block"
                      >
                        <Card className="h-full bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200 overflow-hidden">
                            <div className="h-64 overflow-hidden relative">
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority={index < 2}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              {post.category &&
                                post.category !== "Uncategorized" && (
                                  <span className="absolute top-4 left-4 bg-white text-primary text-sm font-bold px-3 py-1.5 rounded-full shadow-lg border border-primary/20 z-20">
                                    {post.category}
                                  </span>
                                )}
                            </div>
                            <div className="p-8">
                              <h2
                                className="font-heading text-2xl text-slate-900 mb-4 leading-snug"
                              >
                                {post.title}
                              </h2>
                              <p className="text-slate-600 mb-6 line-clamp-3 text-base leading-relaxed">
                                {post.description}
                              </p>
                              <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                  <span className="text-sm font-medium">
                                    {post.createdAtDate.toLocaleDateString(
                                      "en-US",
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  {post.tags &&
                                    post.tags.slice(0, 3).map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex items-center bg-slate-100 text-slate-600 font-medium px-3 py-1 rounded-full text-xs"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                </div>
                                <div className="mt-4 inline-flex items-center gap-2 text-gray-900 font-semibold text-lg">
                                  Read more
                                </div>
                              </div>
                            </div>
                        </Card>
                      </motion.div>
                    </Link>
                  ))}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-16 px-2"
                  >
                    <button
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-base sm:text-lg border transition-colors duration-200 ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>

                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i + 1}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-semibold text-base sm:text-lg border transition-colors duration-200 ${
                            currentPage === i + 1
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-base sm:text-lg border transition-colors duration-200 ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      }`}
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </button>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-20"
              >
                <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm max-w-2xl mx-auto">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-6xl mb-6"
                  ></motion.div>
                  <h3
                    className="font-heading text-2xl text-slate-900 mb-4"
                  >
                    No posts found
                  </h3>
                  <p className="text-slate-600 text-base">
                    Try adjusting your search or filters to find what you're
                    looking for!
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </PageContainer>
    </>
  );
}

export async function getStaticProps() {
  console.log("[getStaticProps /blog] Running..."); // Add log
  try {
    await dbConnect();
    console.log("[getStaticProps /blog] DB Connected.");
    // Fetch ONLY necessary fields, EXCLUDE content
    const posts = await Blog.find({ isPublished: true })
      .select("title slug createdAt description imageUrl tags category") // <-- EXCLUDED content
      .sort({ createdAt: -1 })
      .lean();
    console.log(`[getStaticProps /blog] Fetched ${posts.length} posts.`);

    const categories = await Blog.distinct("category", { isPublished: true });
    console.log(
      `[getStaticProps /blog] Fetched categories: ${categories.join(", ")}`
    );

    return {
      props: {
        initialPosts: JSON.parse(JSON.stringify(posts)),
        categories: JSON.parse(JSON.stringify(categories)),
      },
      revalidate: 3600,
    };
  } catch (err) {
    console.error("[getStaticProps /blog] Error fetching data:", err);
    return { props: { initialPosts: [], categories: [] }, revalidate: 60 }; // Shorter revalidate on error
  }
}

export default Index;

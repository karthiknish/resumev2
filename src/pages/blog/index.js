"use client";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
import Router, { useRouter } from "next/router";
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState(null);

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

  // Handle card click with loader
  const handleCardClick = (slug) => {
    setSelectedSlug(slug);
    setIsTransitioning(true);
    Router.push(`/blog/${slug}`).then(() => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });
  };

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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-24 md:py-32 relative overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
          {/* Decorative Color Splashes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-88 h-88 bg-gradient-to-tl from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
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
                  📝
                </motion.span>
                <span>Welcome to my blog</span>
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
                  ✨
                </motion.span>
              </motion.div>
              
              <h1
                className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 leading-tight tracking-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Blog & Insights
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
                  💡
                </motion.span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
                Exploring the latest in{" "}
                <motion.span
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  technology, development,
                </motion.span>{" "}
                and creative innovation
                <motion.span
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block ml-2"
                >
                  🚀
                </motion.span>
              </p>
            </motion.div>

            {/* Filters and Sorting Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-2 border-purple-200 mb-12"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Category Filter Dropdown */}
                <div className="w-full md:w-auto flex items-center gap-3">
                  <span className="text-gray-700 font-semibold text-lg whitespace-nowrap">
                    🏷️ Filter by:
                  </span>
                  <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-56 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 text-gray-800 font-medium rounded-2xl px-6 py-4 text-lg hover:border-purple-300 transition-all duration-300">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-purple-200 text-gray-800 rounded-2xl shadow-xl">
                      <SelectItem value="All" className="text-lg font-medium hover:bg-purple-50">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category} className="text-lg font-medium hover:bg-purple-50">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-grow"></div> {/* Spacer */}
                {/* Search and Sort */}
                <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex w-full md:w-auto"
                  >
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder="Search posts..."
                      className="px-6 py-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-l-blue-200 border-t-blue-200 border-b-blue-200 border-r-0 rounded-l-2xl text-gray-800 font-medium text-lg placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 w-full md:w-auto flex-grow transition-all duration-300"
                    />
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-4 rounded-r-2xl flex items-center justify-center hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaSearch className="text-xl" />
                    </motion.div>
                  </form>
                  <Select
                    onValueChange={handleSortChange}
                    defaultValue={sortOrder}
                  >
                    <SelectTrigger className="w-full md:w-[220px] bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-gray-800 font-medium rounded-2xl px-6 py-4 text-lg hover:border-green-300 transition-all duration-300">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-green-200 text-gray-800 rounded-2xl shadow-xl">
                      <SelectItem value="desc" className="text-lg font-medium hover:bg-green-50">📅 Newest First</SelectItem>
                      <SelectItem value="asc" className="text-lg font-medium hover:bg-green-50">📆 Oldest First</SelectItem>
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
                <p className="text-gray-600 text-lg font-medium bg-white/60 backdrop-blur-sm inline-flex items-center gap-2 px-6 py-3 rounded-full border border-purple-200">
                  <span className="text-2xl">🔍</span>
                  Showing {filteredAndSortedContent.length} posts
                  {searchTerm.trim() !== "" && ` matching "${searchTerm}"`}
                  {selectedCategory !== "All" &&
                    ` in ${selectedCategory}`}
                </p>
              </motion.div>
            )}

            {/* Post List */}
            {filteredAndSortedContent.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  {paginatedPosts.map((post, index) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="cursor-pointer group block"
                      onClick={() => handleCardClick(post.slug)}
                    >
                      <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                        <a className="block h-full">
                          <Card className="h-full bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-3xl shadow-lg hover:shadow-2xl hover:border-purple-300 transition-all duration-300 overflow-hidden">
                            <div className="h-64 overflow-hidden relative">
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              {post.category &&
                                post.category !== "Uncategorized" && (
                                  <motion.span
                                    className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    {post.category}
                                  </motion.span>
                                )}
                            </div>
                            <div className="p-8">
                              <h2
                                className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300 leading-tight"
                                style={{ fontFamily: "Space Grotesk, sans-serif" }}
                              >
                                {post.title}
                              </h2>
                              <p className="text-gray-700 mb-6 line-clamp-3 text-lg leading-relaxed">
                                {post.description}
                              </p>
                              <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-gray-500">
                                  <motion.span
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }}
                                    className="text-xl"
                                  >
                                    📅
                                  </motion.span>
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
                                        className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm px-3 py-1 rounded-full font-medium border border-purple-200"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                </div>
                                <motion.div
                                  className="mt-4 inline-flex items-center gap-2 text-purple-600 font-bold text-lg group-hover:text-blue-600 transition-colors"
                                  whileHover={{ x: 5 }}
                                >
                                  Read more
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
                                </motion.div>
                              </div>
                            </div>
                          </Card>
                        </a>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex justify-center items-center gap-3 mt-16"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-2xl font-bold text-lg border-2 transition-all duration-300 ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400"
                      }`}
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      ← Previous
                    </motion.button>
                    
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <motion.button
                          key={i + 1}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-12 h-12 rounded-2xl font-bold text-lg border-2 transition-all duration-300 ${
                            currentPage === i + 1
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-600 shadow-lg"
                              : "bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600"
                          }`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </motion.button>
                      ))}
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-6 py-3 rounded-2xl font-bold text-lg border-2 transition-all duration-300 ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                          : "bg-white text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400"
                      }`}
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next →
                    </motion.button>
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
                <div className="bg-gradient-to-br from-cyan-50/90 via-white/85 to-blue-50/90 backdrop-blur-sm rounded-3xl p-12 border-2 border-purple-200 shadow-xl max-w-2xl mx-auto">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-6xl mb-6"
                  >
                    🔍
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    No posts found
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Try adjusting your search or filters to find what you're looking for!
                  </p>
                </div>
              </motion.div>
            )}
          </div>
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

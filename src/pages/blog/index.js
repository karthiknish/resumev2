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

  useEffect(() => {
    const processedData = initialPosts.map((post) => {
      const originalContent = post.content || "";
      console.log("originalContent:", originalContent);
      const limit = 250;
      let limitedContentWithEllipsis = originalContent;

      if (originalContent.length > limit) {
        let lastSpace = originalContent.substring(0, limit).lastIndexOf(" ");
        if (lastSpace === -1) lastSpace = limit;
        limitedContentWithEllipsis =
          originalContent.substring(0, lastSpace) + "...";
      }

      return {
        ...post,
        // Ensure description exists, fallback to limited content if needed for display
        description:
          post.description ||
          limitedContentWithEllipsis.substring(0, 160) +
            (originalContent.length > 160 ? "..." : ""), // Use actual description or shorter snippet
        limitedContent: limitedContentWithEllipsis, // Keep the potentially longer snippet for display
        createdAtDate: new Date(post.createdAt),
      };
    });
    setAllPosts(processedData);
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
          (post.description &&
            post.description.toLowerCase().includes(lowerSearchTerm)) || // Search description
          (post.content && post.content.toLowerCase().includes(lowerSearchTerm))
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
      </Head>
      <PageContainer className="mt-10">
        <Card className="border-none bg-black/60 backdrop-blur-sm p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <h1 className="text-3xl font-bold text-white font-calendas">
                From the Blog
              </h1>
            </div>

            {/* Filters and Sorting Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
              {/* Category Filter Dropdown */}
              <div className="w-full md:w-auto flex items-center gap-2">
                <span className="text-gray-400 text-sm mr-2 whitespace-nowrap">
                  Filter by:
                </span>
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-48 bg-black/40 border-gray-700 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="All">All</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
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
                    placeholder="Filter posts..."
                    className="px-3 py-2 bg-black/40 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto flex-grow"
                  />
                  <div className="bg-gray-600 text-white px-3 py-2 rounded-r-md flex items-center justify-center">
                    <FaSearch />
                  </div>
                </form>
                <Select
                  onValueChange={handleSortChange}
                  defaultValue={sortOrder}
                >
                  <SelectTrigger className="w-full md:w-[180px] bg-black/40 border-gray-700 text-white">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="desc">Date Descending</SelectItem>
                    <SelectItem value="asc">Date Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Display Search/Filter Status */}
            {(searchTerm.trim() !== "" || selectedCategory !== "All") && (
              <div className="mb-6 text-gray-400 text-sm">
                {" "}
                Showing {filteredAndSortedContent.length} posts{" "}
                {searchTerm.trim() !== "" && ` matching "${searchTerm}"`}{" "}
                {selectedCategory !== "All" &&
                  ` in category "${selectedCategory}"`}
                .{" "}
              </div>
            )}

            {/* Post List */}
            {filteredAndSortedContent.length > 0 ? (
              <>
                <div className="space-y-12">
                  {paginatedPosts.map((post) => (
                    <div
                      key={post._id}
                      className="cursor-pointer group block"
                      onClick={() => handleCardClick(post.slug)}
                    >
                      <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                        <a className="block">
                          <div className="flex flex-col lg:flex-row items-center gap-8 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl shadow-xl border border-gray-800 hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-full lg:w-1/2 h-64 lg:h-96 overflow-hidden rounded-xl relative shadow-lg">
                              <Image
                                src={post.imageUrl}
                                alt={post.title}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 group-hover:scale-105"
                              />
                              {post.category &&
                                post.category !== "Uncategorized" && (
                                  <span className="absolute top-4 left-4 bg-purple-700/80 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider z-10">
                                    {post.category}
                                  </span>
                                )}
                            </div>
                            <div className="lg:w-1/2 flex flex-col justify-between h-full py-4">
                              <div>
                                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors font-calendas leading-tight">
                                  {post.title}
                                </h2>
                                <p className="text-gray-300 mb-4 font-calendas line-clamp-3 text-base leading-relaxed">
                                  {post.description}
                                </p>
                              </div>
                              <div className="flex flex-col gap-2 mt-2">
                                <span className="text-xs text-gray-400 flex items-center gap-2">
                                  <svg
                                    className="w-4 h-4 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M8 7V3m8 4V3m-9 8h10m-12 8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12z"
                                    />
                                  </svg>
                                  {post.createdAtDate.toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {post.tags &&
                                    post.tags.slice(0, 3).map((tag) => (
                                      <span
                                        key={tag}
                                        className="bg-gray-700 text-xs text-gray-200 px-2 py-0.5 rounded-full font-medium"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                </div>
                                <span>
                                  <span className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors text-sm">
                                    Read more →
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </div>
                  ))}
                </div>
                {isTransitioning && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <svg
                      className="animate-spin h-16 w-16 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                  </div>
                )}
                {console.log(totalPages)}
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-5 py-2 rounded-full font-semibold text-base border-2 border-blue-600"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        size="lg"
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        className={`px-5 py-2 rounded-full font-semibold text-base border-2 ${
                          currentPage === i + 1
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-5 py-2 rounded-full font-semibold text-base border-2 border-blue-600"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No posts found matching your criteria.
              </div>
            )}
          </motion.div>
        </Card>
      </PageContainer>
    </>
  );
}

export async function getStaticProps() {
  const baseUrl = process.env.URL || "http://localhost:3000";
  try {
    const [postsRes, categoriesRes] = await Promise.all([
      fetch(
        `${baseUrl}/api/blog?publishedOnly=true&select=title,slug,imageUrl,createdAt,isPublished,content,description,category,tags&limit=1000`
      ), // Ensure needed fields are selected, fetch up to 1000 blogs
      fetch(`${baseUrl}/api/blog/categories`),
    ]);

    const postsData = await postsRes.json();
    const categoriesData = await categoriesRes.json();

    const initialPosts = postsData?.success ? postsData.data : [];
    const categories = categoriesData?.success ? categoriesData.categories : [];

    return {
      props: {
        initialPosts: JSON.parse(JSON.stringify(initialPosts)),
        categories: JSON.parse(JSON.stringify(categories)),
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (err) {
    console.error("Error fetching blog data or categories:", err);
    return { props: { initialPosts: [], categories: [] }, revalidate: 3600 };
  }
}

export default Index;

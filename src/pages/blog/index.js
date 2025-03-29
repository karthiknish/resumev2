"use client";
import { useEffect, useState, useMemo } from "react";
import Head from "next/head";
// import limitCharacters from "limit-characters"; // Removed library import
import Router from "next/router";
import Link from "next/link";
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
import ReactMarkdown from "react-markdown";
import { FaSearch } from "react-icons/fa";
import PageContainer from "@/components/PageContainer";

function Index({ initialPosts = [], categories = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [allPosts, setAllPosts] = useState([]);

  // Process initial data once on mount using substring
  useEffect(() => {
    const processedData = initialPosts.map((post) => {
      const originalContent = post.content || "";
      const limit = 250; // Define the character limit
      let limitedContentWithEllipsis = originalContent;

      if (originalContent.length > limit) {
        // Find the last space within the limit to avoid cutting words
        let lastSpace = originalContent.substring(0, limit).lastIndexOf(" ");
        if (lastSpace === -1) lastSpace = limit; // If no space found, cut at limit
        limitedContentWithEllipsis = originalContent.substring(0, lastSpace) + "...";
      }

      return {
        ...post,
        limitedContent: limitedContentWithEllipsis, // Use the version with ellipsis
        createdAtDate: new Date(post.createdAt),
      };
    });
    setAllPosts(processedData);
  }, [initialPosts]);

  // Memoized calculation for filtered and sorted posts
  const filteredAndSortedContent = useMemo(() => {
    let filtered = [...allPosts];

    // Filter by Category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by Search Term
    if (searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerSearchTerm) ||
          (post.content && post.content.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Sort by Date
    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.createdAtDate - b.createdAtDate;
      } else {
        return b.createdAtDate - a.createdAtDate;
      }
    });

    return filtered;
  }, [allPosts, searchTerm, selectedCategory, sortOrder]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to the new unified search page/API
    if (searchTerm.trim()) {
      // Assuming you might want a dedicated search results page later
      // For now, this might just filter the current list via state,
      // but the form still points to the old blog-specific search.
      // Let's keep the filtering logic via state for now.
      // Router.push(`/search?q=${encodeURIComponent(searchTerm)}`); // Example for dedicated page
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  return (
    <>
      <Head>
        <title>Blog - Karthik Nishanth | Full Stack Developer</title>
        <meta
          name="description"
          content="Read the latest articles on web development, technology, and more."
        />
        <meta
          name="keywords"
          content="blog, web development, technology, karthik, nishanth"
        />
        <meta name="author" content="Karthik Nishanth" />
      </Head>
      <PageContainer>
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
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-400 text-sm mr-2">Filter by:</span>
                <Button
                  variant={selectedCategory === "All" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange("All")}
                  className={` ${
                    selectedCategory === "All"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleCategoryChange(category)}
                    className={` ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="flex-grow"></div> {/* Spacer */}
              {/* Search and Sort */}
              <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                {/* Search Form (Filters list, doesn't submit to API here) */}
                <form onSubmit={(e) => e.preventDefault()} className="flex w-full md:w-auto">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Filter posts..." // Changed placeholder
                    className="px-3 py-2 bg-black/40 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-auto flex-grow"
                  />
                  <div // Changed button to div as it doesn't submit
                    className="bg-gray-600 text-white px-3 py-2 rounded-r-md flex items-center justify-center"
                  >
                    <FaSearch />
                  </div>
                </form>

                {/* Sort Dropdown */}
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
                Showing {filteredAndSortedContent.length} posts
                {searchTerm.trim() !== "" && ` matching "${searchTerm}"`}
                {selectedCategory !== "All" &&
                  ` in category "${selectedCategory}"`}
                .
              </div>
            )}

            {/* Post List */}
            {filteredAndSortedContent.length > 0 ? (
              <div className="space-y-12">
                {filteredAndSortedContent.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => Router.push(`/blog/${post.slug}`)}
                    className="cursor-pointer group block"
                  >
                    <Link href={`/blog/${post.slug}`} passHref legacyBehavior>
                      <a className="block">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                          <div className="w-full lg:w-1/2 h-64 lg:h-96 overflow-hidden rounded-lg">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="lg:w-1/2">
                            {post.category &&
                              post.category !== "Uncategorized" && (
                                <p className="text-sm text-purple-400 mb-2 font-semibold uppercase tracking-wider">
                                  {post.category}
                                </p>
                              )}
                            <h2 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-500 transition-colors font-calendas">
                              {post.title}
                            </h2>
                            {/* Display the limited content snippet */}
                            <div className="text-gray-300 mb-4 font-calendas prose prose-invert max-w-none prose-p:text-gray-300 prose-a:text-blue-400 line-clamp-3"> {/* Added line-clamp */}
                              {/* Render plain text snippet, not Markdown */}
                              {post.limitedContent}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <span className="text-blue-500 font-calendas underline group-hover:text-blue-400 transition-colors">
                                Read more
                              </span>
                              <span className="text-xs text-gray-500">
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
                          </div>
                        </div>
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
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

export async function getServerSideProps() {
  const baseUrl = process.env.URL || "http://localhost:3000";
  try {
    const [postsRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/blog?publishedOnly=true`),
      fetch(`${baseUrl}/api/blog/categories`),
    ]);

    const postsData = await postsRes.json();
    const categoriesData = await categoriesRes.json();

    const initialPosts = postsData?.success ? postsData.data : [];
    const categories = categoriesData?.success ? categoriesData.categories : [];

    return { props: { initialPosts, categories } };
  } catch (err) {
    console.error("Error fetching blog data or categories:", err);
    return { props: { initialPosts: [], categories: [] } };
  }
}

export default Index;

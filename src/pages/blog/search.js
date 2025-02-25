import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { FaSearch, FaArrowLeft, FaTag, FaClock } from "react-icons/fa";

// Components
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // Set initial search term from URL query
  useEffect(() => {
    if (q) {
      setSearchTerm(q);
      performSearch(q);
    }
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Update URL with search query
      router.push(
        `/blog/search?q=${encodeURIComponent(searchTerm)}`,
        undefined,
        { shallow: true }
      );
      performSearch(searchTerm);
    }
  };

  const performSearch = async (term) => {
    try {
      setLoading(true);
      setSearched(true);

      const res = await fetch(`/api/blog/search?q=${encodeURIComponent(term)}`);

      if (!res.ok) {
        throw new Error("Failed to search posts");
      }

      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
    } catch (err) {
      console.error("Error searching posts:", err);
      setError("Failed to search posts. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{q ? `Search: ${q}` : "Search Blog Posts"}</title>
        <meta name="description" content="Search for blog posts" />
      </Head>

      <Navbar />

      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to All Posts
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-6 text-gray-800">
            Search Blog Posts
          </h1>

          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex w-full max-w-2xl">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for posts..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search button"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : searched && posts.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No posts found matching your search.
            </div>
          ) : searched ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Found {posts.length} {posts.length === 1 ? "result" : "results"}{" "}
                for "{q}"
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.image || "/images/default-blog.jpg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt || post.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <FaTag className="mr-1" />
                            <span>{post.category}</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>
                              {format(new Date(post.createdAt), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}

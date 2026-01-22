// Converted to TypeScript - migrated
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFolder, FaArrowRight } from "react-icons/fa";
import { runQuery, fieldFilter } from "@/lib/firebase";

import Loader from "../../../components/Loader";

interface Category {
  name: string;
  count: number;
}

interface BlogPost {
  category?: string;
  isPublished?: boolean;
}

interface CategoriesPageProps {
  initialCategories: Category[];
}

export default function CategoriesPage({ initialCategories = [] }: CategoriesPageProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Still keep sync if props change (unlikely with getStaticProps but good practice if using both)
  useEffect(() => {
    if (initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  return (
    <>
      <Head>
        <title>Blog Categories</title>
        <meta name="description" content="Browse all blog categories" />
      </Head>

      <main className="container mx-auto px-4 py-16 min-h-screen bg-white">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Blog Categories
            </h1>
            <Link
              href="/blog"
              className="text-gray-900 hover:text-gray-700 flex items-center"
            >
              Back to Blog <FaArrowRight className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No categories found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link href={`/blog/categories/${category.name}`}>
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 p-3 rounded-full mr-4">
                          <FaFolder className="text-gray-700 text-xl" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            {category.name}
                          </h2>
                          <p className="text-gray-700">
                            {category.count}{" "}
                            {category.count === 1 ? "post" : "posts"}
                          </p>
                        </div>
                      </div>
                      <FaArrowRight className="text-gray-400" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  console.log("[getStaticProps /blog/categories] Running...");
  try {
    const blogs = await runQuery<BlogPost>(
      "blogs",
      [fieldFilter("isPublished", "EQUAL", true)]
    );

    const categoryMap: Record<string, number> = {};
    blogs.forEach((blog) => {
      if (
        blog.category &&
        blog.category !== "" &&
        blog.category !== "Uncategorized"
      ) {
        categoryMap[blog.category] = (categoryMap[blog.category] || 0) + 1;
      }
    });

    const categories = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log(`[getStaticProps /blog/categories] Found ${categories.length} categories.`);

    return {
      props: {
        initialCategories: JSON.parse(JSON.stringify(categories)),
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error("[getStaticProps /blog/categories] Error fetching data:", error);
    return {
      props: {
        initialCategories: [],
      },
      revalidate: 60,
    };
  }
}


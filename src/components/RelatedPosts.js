import Link from "next/link";
import Image from "next/image"; // Use Next.js Image for optimization if applicable
import { motion } from "framer-motion";
import { fadeInUpVariants } from "./animations/MotionComponents"; // Assuming this exists

// Simple date formatter (adjust locale and options as needed)
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return null; // Don't render anything if there are no related posts
  }

  return (
    <motion.div
      className="mt-12 pt-8 border-t border-gray-700" // Add some spacing and separator
      variants={fadeInUpVariants} // Optional animation
      initial="initial"
      animate="animate" // Use animate or whileInView depending on preference
      // whileInView="animate"
      // viewport={{ once: true }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 font-calendas">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post._id} legacyBehavior>
            <a className="block bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300 group">
              <div className="relative w-full h-48">
                {post.imageUrl ? (
                  <img // Using standard img tag for simplicity, switch to Next Image if needed
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

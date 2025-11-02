import Link from "next/link";
import Image from "next/image"; // Use Next.js Image for optimization if applicable
import { motion } from "framer-motion";
import { fadeInUpVariants, staggerContainerVariants, staggerItemVariants } from "./animations/MotionComponents"; // Assuming this exists
import { Badge } from "@/components/ui/badge";
import { ClockIcon, CalendarIcon } from "@heroicons/react/24/outline";

// Enhanced date formatter (adjust locale and options as needed)
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return null; // Don't render anything if there are no related posts
  }

  return (
    <motion.div
      className="mt-16 pt-12 border-t border-slate-200 bg-white rounded-3xl p-6 sm:p-8 shadow-sm"
      variants={staggerContainerVariants} // Enhanced animation
      initial="initial"
      animate="animate"
      // whileInView="animate"
      // viewport={{ once: true }}
    >
      <motion.div
        variants={fadeInUpVariants}
        className="text-center mb-12"
      >
        <h2 
          className="font-heading text-3xl sm:text-4xl text-slate-900 mb-4 leading-tight"
        >
          Related articles
        </h2>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-sm font-semibold text-slate-700">
          <span>{posts.length}</span>
          <span>{posts.length === 1 ? "article" : "articles"}</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={staggerContainerVariants}
      >
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            variants={staggerItemVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="block bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group h-full"
            >
              <div className="relative w-full h-56">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <div className="text-center text-sm font-medium uppercase tracking-wide">
                      No image
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                {post.category && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-slate-900 text-slate-100 shadow-sm">
                      {post.category}
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="font-heading text-xl text-slate-900 mb-3 group-hover:text-slate-700 transition-colors duration-300 line-clamp-2 leading-tight">
                  {post.title}
                </h3>
                
                {/* Post metadata */}
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">#</span>
                      <span className="text-slate-600">{post.tags[0]}</span>
                      {post.tags.length > 1 && (
                        <span className="text-slate-400">+{post.tags.length - 1}</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Excerpt if available */}
                {post.excerpt && (
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                )}
                
                {/* Read more indicator */}
                <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                  <span>Read article</span>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </motion.svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

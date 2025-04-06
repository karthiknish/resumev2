import { motion } from "framer-motion";
import { BentoGrid } from "@/components/ui/bento-grid"; // Assuming this path is correct
import { TrendingUp, CheckCircle, Video, Globe } from "lucide-react"; // Import icons

import Link from "next/link"; // Ensure Link is imported if not already

// Sample items for BentoGrid (Original hardcoded data with links)
const itemsSample = [
  {
    id: "ecommerce-platform",
    title: "E-commerce Platform",
    meta: "35% Growth",
    description:
      "Advanced UX design and performance optimization for increased conversions",
    icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["UX", "Performance", "Analytics"],
    colSpan: 2,
    hasPersistentHover: true,
    link: "/projects/ecommerce-platform", // Added link
  },
  {
    id: "startup-infrastructure",
    title: "Startup Infrastructure",
    meta: "10x Scale",
    description: "Scalable architecture supporting exponential user growth",
    icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, // Changed color for variety
    status: "Updated",
    tags: ["Architecture", "Scaling"],
    link: "/projects/startup-infrastructure", // Added link
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    meta: "40% Cost Reduction",
    description: "AI-powered chatbot implementation for customer service",
    icon: <Video className="w-4 h-4 text-purple-500" />, // Changed color for variety
    tags: ["AI", "Automation"],
    colSpan: 2,
    link: "/projects/ai-integration", // Added link
  },
  {
    id: "analytics-system",
    title: "Analytics System",
    meta: "25% Revenue Growth",
    description: "Data analytics overhaul providing actionable insights",
    icon: <Globe className="w-4 h-4 text-sky-500" />, // Changed color for variety
    status: "Live",
    tags: ["Analytics", "Business Intelligence"],
    link: "/projects/analytics-system", // Added link
  },
  // Added a fifth item for layout consistency if needed, or adjust colSpans
  // {
  //   id: "new-feature-x",
  //   title: "New Feature X",
  //   meta: "Beta",
  //   description: "Developing the next generation feature set.",
  //   icon: <Settings className="w-4 h-4 text-gray-500" />,
  //   status: "In Progress",
  //   tags: ["Development", "Beta"],
  // },
];

export default function FeaturedProjectsSection() {
  return (
    <motion.section
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-black py-12" // Adjusted padding
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl text-center font-bold sm:text-4xl mb-8 text-white font-calendas"
        >
          Featured Projects
        </motion.h2>
        {/* Render BentoGrid with itemsSample */}
        <BentoGrid items={itemsSample} />
      </div>
    </motion.section>
  );
}

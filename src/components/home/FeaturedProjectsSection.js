import { motion } from "framer-motion";
import { BentoGrid } from "@/components/ui/bento-grid"; // Assuming this path is correct
import { TrendingUp, CheckCircle, Video, Globe } from "lucide-react"; // Import icons

// Sample items for BentoGrid (consider moving to a data file)
const itemsSample = [
  {
    title: "E-commerce Platform",
    meta: "35% Growth",
    description:
      "Advanced UX design and performance optimization for increased conversions",
    icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["UX", "Performance", "Analytics"],
    colSpan: 2,
    hasPersistentHover: true,
  },
  {
    title: "Startup Infrastructure",
    meta: "10x Scale",
    description: "Scalable architecture supporting exponential user growth",
    icon: <CheckCircle className="w-4 h-4 text-blue-500" />,
    status: "Updated",
    tags: ["Architecture", "Scaling"],
  },
  {
    title: "AI Integration",
    meta: "40% Cost Reduction",
    description: "AI-powered chatbot implementation for customer service",
    icon: <Video className="w-4 h-4 text-blue-500" />,
    tags: ["AI", "Automation"],
    colSpan: 2,
  },
  {
    title: "Analytics System",
    meta: "25% Revenue Growth",
    description: "Data analytics overhaul providing actionable insights",
    icon: <Globe className="w-4 h-4 text-blue-500" />,
    status: "Live",
    tags: ["Analytics", "Business Intelligence"],
  },
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
        {/* Render BentoGrid with items */}
        <BentoGrid items={itemsSample} />
      </div>
    </motion.section>
  );
}

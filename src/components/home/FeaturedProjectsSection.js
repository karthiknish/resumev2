import { motion } from "framer-motion";
import { BentoGrid } from "@/components/ui/bento-grid"; // Assuming this path is correct
import { TrendingUp, CheckCircle, Video, Globe } from "lucide-react"; // Import icons

import Link from "next/link"; // Ensure Link is imported if not already

// Sample items for BentoGrid (Original hardcoded data with links)
const itemsSample = [
  {
    id: "ecommerce-platform",
    title: "E-commerce platform revamp",
    meta: "+35% conversion",
    description:
      "Simplified flows, tuned performance, and a resilient checkout stack to keep momentum during launches.",
    icon: <TrendingUp className="w-4 h-4 text-slate-700" />,
    status: "Live",
    tags: ["UX", "Performance", "Analytics"],
    colSpan: 2,
    hasPersistentHover: true,
    link: "/projects/ecommerce-platform",
  },
  {
    id: "startup-infrastructure",
    title: "Startup infrastructure",
    meta: "10× scale",
    description: "Provisioned environments, observability, and CI/CD so the team ships safely every week.",
    icon: <CheckCircle className="w-4 h-4 text-slate-700" />,
    status: "Updated",
    tags: ["Architecture", "Scaling"],
    link: "/projects/startup-infrastructure",
  },
  {
    id: "ai-integration",
    title: "Support automation",
    meta: "−40% cost",
    description: "Integrated an AI-guided triage workflow that resolves common support tickets without human escalation.",
    icon: <Video className="w-4 h-4 text-slate-700" />,
    tags: ["AI", "Automation"],
    colSpan: 2,
    link: "/projects/ai-integration",
  },
  {
    id: "analytics-system",
    title: "Analytics foundation",
    meta: "+25% revenue",
    description: "Unified data pipelines with executive dashboards so leadership can steer with live insights.",
    icon: <Globe className="w-4 h-4 text-slate-700" />,
    status: "Live",
    tags: ["Analytics", "Business Intelligence"],
    link: "/projects/analytics-system",
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
      className="relative overflow-hidden py-20 md:py-24 bg-background"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(226,232,240,0.25),_transparent_70%)]" />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12 space-y-12">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="font-heading text-3xl sm:text-4xl text-center text-slate-900"
        >
          Featured projects
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center text-slate-600 max-w-3xl mx-auto text-base leading-relaxed"
        >
          A sampling of recent collaborations—pairing product strategy, interaction design, and calm engineering to ship meaningful outcomes.
        </motion.p>

        <BentoGrid items={itemsSample} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-7 py-3 text-base font-semibold text-slate-800 hover:border-slate-500 hover:bg-slate-100 transition-all duration-300"
          >
            See more projects →
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

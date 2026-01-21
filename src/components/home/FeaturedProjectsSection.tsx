import { motion } from "framer-motion";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  description: string;
  impact: string;
  technologies: string[];
}

const featuredProjects: Project[] = [
  {
    id: "healthcare-platform",
    title: "Healthcare Platform Development",
    description:
      "Built Medblocks, a comprehensive healthcare platform enabling developers to create modern healthcare applications using vendor-neutral APIs. Developed both the core platform and Medblocks UI component library, reducing integration time from months to weeks for healthcare organizations.",
    impact: "Reduced integration time from months to weeks",
    technologies: ["React", "Next.js", "TypeScript", "Web Components"],
  },
  {
    id: "ecommerce-platform",
    title: "E-commerce Platform Solutions",
    description:
      "Developed complete e-commerce platforms with modern architecture featuring real-time inventory management, secure payment processing, and comprehensive admin dashboards. Built scalable solutions handling high traffic volumes during peak sales periods.",
    impact: "35% increase in conversion rates",
    technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
  },
  {
    id: "analytics-system",
    title: "Data Analytics & Business Intelligence",
    description:
      "Created real-time data visualization platforms with interactive dashboards and custom reporting systems. Built unified data pipelines providing executive teams with live business insights for data-driven decision making.",
    impact: "25% revenue increase through actionable insights",
    technologies: ["Next.js", "D3.js", "PostgreSQL", "Python"],
  },
  {
    id: "ai-integration",
    title: "AI-Powered Support Automation",
    description:
      "Integrated AI-guided triage workflows that resolve common support tickets without human escalation. Built intelligent chatbot systems using fine-tuned models on company knowledge bases, significantly reducing operational costs.",
    impact: "40% reduction in support costs",
    technologies: ["OpenAI", "Python", "Node.js", "React"],
  },
];

const FeaturedProjectsSection: React.FC = () => {
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
          A selection of recent work combining technical expertise with business impact—from healthcare platforms to AI automation.
        </motion.p>

        <div className="grid gap-8 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading text-xl font-semibold text-slate-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="border-l-4 border-slate-200 pl-6">
                  <p className="text-sm font-medium text-slate-500 mb-2">KEY IMPACT</p>
                  <p className="text-slate-700 font-medium">{project.impact}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500 mb-3">TECHNOLOGIES</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
            View all projects →
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedProjectsSection;

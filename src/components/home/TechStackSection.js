import { motion } from "framer-motion";
import { Code, Database, Cloud, Lock } from "lucide-react"; // Import icons

const techStack = [
  {
    icon: <Code className="w-8 h-8" />,
    title: "Frontend Development",
    description: "React, Next.js, TypeScript",
    color: "text-blue-500",
    delay: 0.2,
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: "Backend Development",
    description: "Node.js, Express, MongoDB",
    color: "text-green-500",
    delay: 0.4,
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Cloud Services",
    description: "AWS, Azure, Google Cloud",
    color: "text-purple-500",
    delay: 0.6,
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Security",
    description: "OAuth, JWT, HTTPS",
    color: "text-red-500",
    delay: 0.8,
  },
];

export default function TechStackSection() {
  return (
    <motion.section
      initial={{ y: 100, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-black py-16"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-3xl text-center font-bold sm:text-4xl mb-12 text-white font-calendas"
        >
          Technical Expertise
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techStack.map((tech) => (
            <motion.div
              key={tech.title}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: tech.delay }}
              viewport={{ once: true }}
              className="bg-black/50 p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className={`${tech.color} mb-4`}>{tech.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2 font-calendas">
                {tech.title}
              </h3>
              <p className="text-gray-400 font-calendas">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

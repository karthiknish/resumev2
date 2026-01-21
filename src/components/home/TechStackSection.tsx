import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaAws,
  FaDocker,
  FaPython,
  FaWordpress,
  FaGithub,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiTailwindcss,
  SiFirebase,
  SiKubernetes,
  SiGooglecloud,
  SiMicrosoftazure,
  SiShopify,
} from "react-icons/si";

interface Technology {
  name: string;
  icon: React.ReactNode;
}

const technologies: Technology[] = [
  { name: "React", icon: <FaReact size={28} className="text-slate-700" /> },
  { name: "Next.js", icon: <SiNextdotjs size={28} className="text-slate-700" /> },
  { name: "Node.js", icon: <FaNodeJs size={28} className="text-slate-700" /> },
  {
    name: "TypeScript",
    icon: <SiTypescript size={28} className="text-slate-700" />,
  },
  { name: "Python", icon: <FaPython size={28} className="text-slate-700" /> },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss size={28} className="text-slate-700" />,
  },
  { name: "MongoDB", icon: <SiMongodb size={28} className="text-slate-700" /> },
  {
    name: "PostgreSQL",
    icon: <SiPostgresql size={28} className="text-slate-700" />,
  },
  { name: "AWS", icon: <FaAws size={28} className="text-slate-700" /> },
  { name: "Docker", icon: <FaDocker size={28} className="text-slate-700" /> },
  {
    name: "Kubernetes",
    icon: <SiKubernetes size={28} className="text-slate-700" />,
  },
  { name: "Shopify", icon: <SiShopify size={28} className="text-slate-700" /> },
  {
    name: "Azure",
    icon: <SiMicrosoftazure size={28} className="text-slate-700" />,
  },
  { name: "GCP", icon: <SiGooglecloud size={28} className="text-slate-700" /> },
  {
    name: "Wordpress",
    icon: <FaWordpress size={28} className="text-slate-700" />,
  },
  { name: "GitHub", icon: <FaGithub size={28} className="text-slate-700" /> },
];

const TechStackSection: React.FC = () => {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden py-20 md:py-24 bg-background"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(226,232,240,0.3),_transparent_70%)]" />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="font-heading text-3xl sm:text-4xl text-center text-slate-900"
        >
          Technical expertise
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-slate-600 mt-4 mb-12 md:mb-16 max-w-2xl mx-auto text-base leading-relaxed"
        >
          A toolbox shaped by shipping products across stacks—frontend composability, backend resilience, and modern cloud operations.
        </motion.p>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-6 md:gap-8 justify-center">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={iconVariants}
              className="group relative flex flex-col items-center"
            >
              <div className="p-4 bg-white rounded-full border border-slate-200 group-hover:border-slate-400 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-lg">
                {tech.icon}
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-900 text-slate-100 text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 shadow-lg font-medium">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default TechStackSection;

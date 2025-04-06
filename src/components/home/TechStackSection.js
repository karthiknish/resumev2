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
  SiShopify, // Import Shopify icon
} from "react-icons/si"; // Using react-icons for consistency if available

// Define key technologies with icons
const technologies = [
  { name: "React", icon: <FaReact size={32} className="text-sky-400" /> },
  { name: "Next.js", icon: <SiNextdotjs size={32} className="text-white" /> },
  { name: "Node.js", icon: <FaNodeJs size={32} className="text-green-500" /> },
  {
    name: "TypeScript",
    icon: <SiTypescript size={32} className="text-blue-500" />,
  },
  { name: "Python", icon: <FaPython size={32} className="text-yellow-400" /> },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss size={32} className="text-cyan-400" />,
  },
  { name: "MongoDB", icon: <SiMongodb size={32} className="text-green-600" /> },
  {
    name: "PostgreSQL",
    icon: <SiPostgresql size={32} className="text-blue-600" />,
  },
  { name: "AWS", icon: <FaAws size={32} className="text-orange-500" /> },
  { name: "Docker", icon: <FaDocker size={32} className="text-blue-600" /> },
  {
    name: "Kubernetes",
    icon: <SiKubernetes size={32} className="text-blue-700" />,
  },
  // { // Commenting out Firebase
  //   name: "Firebase",
  //   icon: <SiFirebase size={32} className="text-yellow-500" />,
  // },
  { name: "Shopify", icon: <SiShopify size={32} className="text-lime-500" /> }, // Added Shopify
  // Add more as needed, e.g.:
  {
    name: "Azure",
    icon: <SiMicrosoftazure size={32} className="text-blue-500" />,
  },
  { name: "GCP", icon: <SiGooglecloud size={32} className="text-red-500" /> },
  {
    name: "Wordpress",
    icon: <FaWordpress size={32} className="text-blue-700" />,
  },
  { name: "GitHub", icon: <FaGithub size={32} className="text-gray-300" /> }, // Added GitHub
];

export default function TechStackSection() {
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.08, // Faster stagger
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-black via-gray-900 to-black py-16 md:py-24" // Added gradient
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl text-center font-bold sm:text-4xl mb-4 text-white font-calendas"
        >
          Technical Expertise
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto"
        >
          Leveraging a modern and versatile tech stack to build robust,
          scalable, and high-performance applications tailored to your needs.
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
              <div className="p-4 bg-gray-800/50 rounded-full border border-gray-700 group-hover:bg-gray-700/70 group-hover:scale-110 transition-all duration-300">
                {tech.icon}
              </div>
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

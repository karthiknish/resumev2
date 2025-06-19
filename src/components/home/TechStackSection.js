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
  { name: "Next.js", icon: <SiNextdotjs size={32} className="text-gray-800" /> },
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
  { name: "GitHub", icon: <FaGithub size={32} className="text-gray-700" /> }, // Added GitHub
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
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16 md:py-24 relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl text-center font-bold sm:text-4xl mb-4 font-calendas"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Technical Expertise
          </span>
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 mb-12 md:mb-16 max-w-2xl mx-auto text-lg leading-relaxed"
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
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-full border-2 border-purple-200 group-hover:bg-purple-50 group-hover:border-purple-300 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                {tech.icon}
              </div>
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 shadow-lg font-medium">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

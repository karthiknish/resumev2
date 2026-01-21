import Link from "next/link";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { TextRotate } from "@/components/ui/text-rotate";

interface TechItem {
  name: string;
  icon: string;
}

const techStack: TechItem[] = [
  { name: "React", icon: "R" },
  { name: "React Native", icon: "RN" },
  { name: "Next.js", icon: "N" },
  { name: "Node.js", icon: "No" },
  { name: "TypeScript", icon: "TS" },
  { name: "MongoDB", icon: "M" },
  { name: "AWS", icon: "A" },
  { name: "Docker", icon: "D" },
];

const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

        <Spotlight
          className="absolute -top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(15, 23, 42, 0.08)"
        />

        <div className="absolute inset-0 pointer-events-none">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="absolute w-14 h-14 rounded-full bg-white/80 border border-slate-200 flex items-center justify-center text-xl text-slate-700 shadow-sm"
              style={{
                left: `${10 + (index * 12) % 80}%`,
                top: `${15 + (index * 7) % 70}%`,
                x: mousePosition.x * (0.02 + index * 0.005),
                y: mousePosition.y * (0.02 + index * 0.005),
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + index * 0.5,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              <span>{tech.icon}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-semibold mb-8 shadow-sm"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Available for new projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl text-slate-900 mb-6 leading-tight"
          >
            Cross-platform developer
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-8"
          >
            Building{" "}
            <TextRotate
              texts={[
                "Web Applications",
                "Mobile Apps",
                "Cloud Solutions",
                "API Integrations",
                "Digital Experiences",
                "Scalable Systems",
                "Modern Interfaces",
                "Custom Solutions"
              ]}
              mainClassName="text-slate-900 font-semibold"
              staggerDuration={0.05}
              rotationInterval={2500}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-base md:text-lg text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Freelance cross platform developer creating custom, scalable, and high-performance
            web and mobile solutions that bridge gap between innovative design and
            powerful functionality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-slate-900 text-slate-100 font-semibold rounded-2xl text-base shadow-lg transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Let's work together
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </Link>

            <Link href="#projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-slate-300 text-slate-700 font-semibold rounded-2xl text-base hover:border-slate-500 hover:bg-slate-100 transition-all duration-300"
              >
                View my work
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border border-slate-300 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-slate-400 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;

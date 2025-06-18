import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Spotlight } from "@/components/ui/spotlight";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { TextRotate } from "@/components/ui/text-rotate";

// Technology icons with enhanced styling
const techStack = [
  { name: "React", icon: "⚛️", color: "from-blue-400 to-cyan-400" },
  { name: "React Native", icon: "📱", color: "from-purple-400 to-pink-400" },
  { name: "Next.js", icon: "▲", color: "from-gray-400 to-white" },
  { name: "Node.js", icon: "🟢", color: "from-green-400 to-emerald-400" },
  { name: "TypeScript", icon: "🔷", color: "from-blue-500 to-blue-700" },
  { name: "MongoDB", icon: "🍃", color: "from-green-500 to-green-700" },
  { name: "AWS", icon: "☁️", color: "from-orange-400 to-yellow-400" },
  { name: "Docker", icon: "🐳", color: "from-blue-400 to-blue-600" },
];

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Animated Background */}
      <BackgroundBeamsWithCollision className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white/90 to-blue-50/80" />
        
        {/* Dynamic Spotlight Effect */}
        <Spotlight
          className="absolute -top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(139, 92, 246, 0.1)"
        />
        
        {/* Floating Tech Stack Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              className={`absolute w-16 h-16 rounded-full bg-gradient-to-r ${tech.color} flex items-center justify-center text-2xl shadow-2xl backdrop-blur-sm`}
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
      </BackgroundBeamsWithCollision>
      
      {/* Main Content */}
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 text-gray-700 text-sm font-medium mb-8 shadow-sm"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Available for new projects
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
              Cross Platform
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Developer
            </span>
          </motion.h1>
          
          {/* Rotating Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-8 font-light"
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
              mainClassName="text-blue-400 font-semibold"
              staggerDuration={0.05}
              rotationInterval={2500}
            />
          </motion.div>
          
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Freelance cross platform developer creating custom, scalable, and high-performance 
            web and mobile solutions that bridge the gap between innovative design and 
            powerful functionality.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full text-lg shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Let's Work Together
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </Link>
            
            <Link href="#projects">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-full text-lg backdrop-blur-sm hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
              >
                View My Work
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1 h-3 bg-gray-500 rounded-full mt-2"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

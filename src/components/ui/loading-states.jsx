import React from "react";
import { motion } from "framer-motion";

export function SkeletonLoader({ className, height }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{ height: height || "100%" }}
    >
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl h-full w-full" />
    </div>
  );
}

export function AnimatedSkeletonLoader({ className }) {
  return (
    <div className={`${className}`}>
      <motion.div
        className="bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200 rounded-xl h-full w-full"
        animate={{
          backgroundPosition: ["0% center", "100% center", "0% center"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
}

export function BackgroundBeamsLoader({ className }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary/30 rounded-full"
            style={{
              width: `${20 + Math.random() * 30}vw`,
              height: `${2 + Math.random() * 3}px`,
              top: `${10 + i * 10}%`,
              left: "-30%",
            }}
            animate={{
              left: ["-30%", "130%"],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      {/* Centered spinner */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}

export function ThreeDotLoader() {
  return (
    <div className="flex space-x-2 justify-center items-center py-4">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-3 w-3 bg-primary rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// New enhanced loader components
export function PulsingLoader({ size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };
  
  const dotSizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
    </div>
  );
}

export function WaveLoader() {
  return (
    <div className="flex items-end justify-center space-x-1 h-12">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-2 bg-primary rounded-t"
          style={{ height: `${20 + i * 10}%` }}
          animate={{
            height: ["40%", "100%", "40%"],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";

export function SkeletonLoader({ className, height }) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{ height: height || "100%" }}
    >
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl h-full w-full" />
    </div>
  );
}

export function AnimatedSkeletonLoader({ className }) {
  return (
    <div className={`${className}`}>
      <motion.div
        className="bg-gradient-to-r from-gray-900 via-primary/20 to-gray-900 rounded-xl h-full w-full"
        animate={{
          backgroundPosition: ["0% center", "100% center"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}

export function BackgroundBeamsLoader({ className }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary/30"
            style={{
              width: "30vw",
              height: "5px",
              borderRadius: "999px",
              top: `${10 + i * 15}%`,
              left: "-30%",
            }}
            animate={{
              left: ["0%", "130%"],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ThreeDotLoader() {
  return (
    <div className="flex space-x-2 justify-center items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 bg-primary rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

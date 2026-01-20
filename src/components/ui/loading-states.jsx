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

export function TableRowSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border border-slate-200 rounded-lg animate-pulse">
          {[...Array(columns)].map((_, colIndex) => (
            <div
              key={colIndex}
              className={`bg-slate-200 rounded ${
                colIndex === 0 ? "h-6 w-24" : colIndex === columns - 1 ? "h-6 w-20 ml-auto" : "h-6 w-full"
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start space-x-4 p-6 rounded-3xl border border-slate-200 bg-white">
          <div className="flex-shrink-0 w-12 h-12 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContactListItemSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50 animate-pulse">
          <div className="flex-shrink-0 w-10 h-10 bg-slate-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-48 bg-slate-200 rounded" />
          </div>
          <div className="h-8 w-8 bg-slate-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 6, aspectRatio = "aspect-[4/3]" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`${aspectRatio} bg-slate-200 rounded-xl animate-pulse`} />
      ))}
    </div>
  );
}

export function StatsCardSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse" />
          </div>
          <div className="p-6 pt-0">
            <div className="h-12 w-16 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BlogPostCardSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-start justify-between p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50">
          <div className="flex-1 space-y-2">
            <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="flex gap-2 mt-3">
              <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-8 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AccordionItemSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border border-slate-200 rounded-xl bg-white p-4 space-y-3 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-slate-200 rounded-full animate-pulse" />
              <div className="space-y-1">
                <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-48 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-5 w-5 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

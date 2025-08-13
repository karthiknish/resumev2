import React from "react";
import { motion } from "framer-motion";
import { 
  PulsingLoader, 
  WaveLoader, 
  ThreeDotLoader, 
  AnimatedSkeletonLoader 
} from "./loading-states";

// Main App Loader with different variants
export function AppLoader({ 
  variant = "spinner", 
  size = "md", 
  message = "Loading...", 
  fullscreen = false 
}) {
  const containerClasses = fullscreen 
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" 
    : "flex flex-col items-center justify-center";
    
  const renderLoader = () => {
    switch (variant) {
      case "spinner":
        return <PulsingLoader size={size} />;
      case "wave":
        return <WaveLoader />;
      case "dots":
        return <ThreeDotLoader />;
      case "skeleton":
        return <AnimatedSkeletonLoader className="w-16 h-16 rounded-full" />;
      default:
        return <PulsingLoader size={size} />;
    }
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center p-8 rounded-2xl bg-card/90 backdrop-blur-sm border border-border shadow-xl">
        {renderLoader()}
        {message && (
          <motion.p
            className="mt-4 text-foreground font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {message}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// Content Loader for page sections
export function ContentLoader({ 
  className = "", 
  showText = true, 
  text = "Loading content..." 
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <motion.div
        className="relative w-16 h-16"
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
      
      {showText && (
        <motion.p
          className="mt-4 text-lg text-foreground/70 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Button Loader for use in buttons
export function ButtonLoader({ size = "sm" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-5 h-5 border-2",
    lg: "w-6 h-6 border-3",
  };
  
  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-primary border-t-transparent`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Fullscreen Loader for app initialization
export function FullscreenLoader({ message = "Preparing your experience..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10">
      <motion.div
        className="relative w-24 h-24 mb-8"
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Inner pulsing circle */}
        <motion.div
          className="absolute inset-4 rounded-full bg-primary/20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      
      <motion.h2
        className="text-2xl font-bold text-foreground mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Karthik Nishanth
      </motion.h2>
      
      <motion.p
        className="text-lg text-foreground/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {message}
      </motion.p>
      
      <motion.div
        className="mt-8 w-64 h-2 bg-primary/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "70%" }}
          transition={{ 
            duration: 2, 
            delay: 2,
            ease: "easeInOut" 
          }}
        />
      </motion.div>
    </div>
  );
}
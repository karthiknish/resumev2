/* eslint-disable */
"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useState, useEffect, useMemo } from "react";

export const BackgroundBeamsWithCollision = ({
  className,
  children,
  density = 15,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate beams with simpler configuration - using useMemo to prevent regeneration on every render
  const beams = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      size: Math.random() * 2 + 1, // Smaller size range
      duration: 8 + Math.random() * 5, // More consistent durations
    }));
  }, [density]);

  // Throttled mouse move handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Only update every 50ms to reduce calculations
      if (!window.lastMoveTime || Date.now() - window.lastMoveTime > 50) {
        window.lastMoveTime = Date.now();
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={cn("fixed inset-0 overflow-hidden", className)}>
      {beams.map((beam) => (
        <motion.div
          key={beam.id}
          className="absolute opacity-20" // Reduced opacity
          style={{
            left: `${beam.x}%`,
            top: `${beam.y}%`,
            width: `${beam.size}px`,
            height: `${15 + beam.size * 6}px`, // Shorter beams
            borderRadius: "999px",
            background:
              "linear-gradient(180deg, #6366f1 0%, rgba(99, 102, 241, 0.2) 100%)",
            filter: "blur(6px)", // Less blur for better performance
          }}
          animate={{
            opacity: [0.15, 0.25, 0.15], // Subtle opacity changes
            rotate: beam.rotation + 90, // Less rotation
            x: mousePosition.x / 40, // Less movement
            y: mousePosition.y / 40,
          }}
          transition={{
            duration: beam.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      {children}
    </div>
  );
};

/* eslint-disable */
"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

export const BackgroundBeamsWithCollision = ({
  className,
  children,
  density = 10, // Reduced density for better performance
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate beams with simpler configuration
  const beams = Array.from({ length: density }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    size: Math.random() * 2 + 0.5, // Smaller size range
    duration: 10 + Math.random() * 5, // More consistent durations
  }));

  // Simple mouse move handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Only update every 100ms to reduce calculations
      if (!window.lastMoveTime || Date.now() - window.lastMoveTime > 100) {
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
          className="absolute opacity-10" // Reduced opacity
          style={{
            left: `${beam.x}%`,
            top: `${beam.y}%`,
            width: `${beam.size}px`,
            height: `${10 + beam.size * 5}px`, // Shorter beams
            borderRadius: "999px",
            background:
              "linear-gradient(180deg, #6366f1 0%, rgba(99, 102, 241, 0.2) 100%)",
            filter: "blur(4px)", // Less blur for better performance
          }}
          animate={{
            opacity: [0.1, 0.15, 0.1], // Subtle opacity changes
            rotate: beam.rotation + 45, // Less rotation
            x: mousePosition.x / 50, // Less movement
            y: mousePosition.y / 50,
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

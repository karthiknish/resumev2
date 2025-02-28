import React, { useState, useEffect, useRef } from "react";
// Import Spline conditionally only on client side
import dynamic from "next/dynamic";

// Create a static fallback component
const StaticFallback = ({ className }) => (
  <div
    className={`${className} relative bg-gradient-to-br from-black to-blue-900/30`}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A1 1 0 0 1 21 16.9v-1.4a1 1 0 0 0-1-1h-2.283a1 1 0 0 0-.707.293l-1.043 1.043a.5.5 0 0 0 0 .707l.52.52a.5.5 0 0 1-.52.827L12.6 14.6a.5.5 0 0 1-.196-.404V7.5a.5.5 0 0 0-.5-.5H9.5a.5.5 0 0 0-.5.5v1.4a1 1 0 0 1-1 1H5.5a.5.5 0 0 0-.5.5v2.7a.5.5 0 0 0 .5.5H8a.5.5 0 0 1 .5.5v4.1a.5.5 0 0 0 .5.5h6.4a.5.5 0 0 0 .5-.5v-1.717a.5.5 0 0 1 .7-.458 7.5 7.5 0 0 0 4.9.217 1 1 0 0 0 .6-.917v-.834a1 1 0 0 0-.4-.8A7.5 7.5 0 0 0 12 3Z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Interactive 3D Experience
        </h3>
        <p className="text-blue-300 mb-4">
          Our 3D visualization is currently optimizing for your device.
        </p>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export function SplineScene({ scene, className }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // For now, always use the static fallback to avoid the buffer error
  return <StaticFallback className={className} />;
}

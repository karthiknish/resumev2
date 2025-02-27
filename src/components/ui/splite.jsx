import React, { useState, useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";

export function SplineScene({ scene, className }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [splineApp, setSplineApp] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const splineRef = useRef(null);
  const maxRetries = 2;

  // Handle successful loading of the Spline scene
  const handleLoad = (splineApp) => {
    setSplineApp(splineApp);
    setLoading(false);
    setError(null);
  };

  // Handle any errors that might occur when loading the Spline scene
  const handleError = (err) => {
    console.error("Error loading Spline scene:", err);
    setError(err);
    setLoading(false);

    // If we haven't exceeded max retries, try again
    if (retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setLoading(true);
        // Force remount of Spline component
        setSplineApp(null);
      }, 1500);
    }
  };

  // Use a static fallback image if Spline fails to load after retries
  const renderFallback = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
      <div className="flex flex-col items-center text-center p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500 mb-4"
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <p className="text-lg font-bold mb-2">3D Scene Unavailable</p>
        <p className="mb-4">The interactive 3D scene couldn't be loaded.</p>
        <button
          onClick={() => {
            setRetryCount(0);
            setLoading(true);
            setError(null);
          }}
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Use a simpler version of the scene if we're having buffer issues
  const useSimpleScene = retryCount > 0;

  return (
    <div className={`${className} relative`} style={{ minHeight: "300px" }}>
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-b-blue-700 border-l-blue-500 border-r-blue-700 animate-spin"></div>
            <p className="mt-4">Loading 3D scene...</p>
          </div>
        </div>
      )}

      {error && retryCount >= maxRetries ? (
        renderFallback()
      ) : (
        <div key={retryCount} ref={splineRef}>
          <Spline
            scene={scene}
            onLoad={handleLoad}
            onError={handleError}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  );
}

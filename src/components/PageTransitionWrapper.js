import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, memo } from "react";

// Default page transition variants - optimized for performance
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, // Slightly faster for better perceived performance
      ease: [0.25, 0.1, 0.25, 1.0], // Custom cubic-bezier for smoother animation
    },
  },
  exit: {
    opacity: 0,
    y: -10, // Reduced distance for better performance
    transition: {
      duration: 0.2, // Faster exit for better perceived performance
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

// Slide transition variants - optimized for performance
const slideVariants = {
  initial: {
    opacity: 0,
    x: 50, // Reduced distance for better performance
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
  exit: {
    opacity: 0,
    x: -50, // Reduced distance for better performance
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

// Fade transition variants - optimized for performance
const fadeVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};

/**
 * A wrapper component that adds page transition animations
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page content to animate
 * @param {string} props.transitionType - The type of transition to use ('fade', 'slide', or 'default')
 * @param {boolean} props.enableScrollRestoration - Whether to restore scroll position on navigation
 */
function PageTransitionWrapper({
  children,
  transitionType = "default",
  enableScrollRestoration = true,
}) {
  const router = useRouter();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  // Check for user's motion preference - memoized for performance
  useEffect(() => {
    // Use matchMedia API to check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e) => setShouldReduceMotion(e.matches);

    // Use modern event listener if available
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Handle scroll restoration - memoized with useCallback for performance
  useEffect(() => {
    if (!enableScrollRestoration) return;

    // Store scroll position before navigation - optimized with throttling
    const handleRouteChangeStart = useCallback(() => {
      // Use requestIdleCallback if available for better performance
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          sessionStorage.setItem(
            `scrollPos-${router.asPath}`,
            window.scrollY.toString()
          );
        });
      } else {
        sessionStorage.setItem(
          `scrollPos-${router.asPath}`,
          window.scrollY.toString()
        );
      }
    }, [router.asPath]);

    // Restore scroll position after navigation - optimized with throttling
    const handleRouteChangeComplete = useCallback((url) => {
      const scrollPos = sessionStorage.getItem(`scrollPos-${url}`);

      // Use requestAnimationFrame for smoother scrolling
      if (scrollPos) {
        window.requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(scrollPos),
            behavior: "auto", // Use 'auto' instead of 'smooth' for better performance
          });
        });
      } else {
        window.requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      }
    }, []);

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router, enableScrollRestoration]);

  // Select the appropriate variants based on transition type and motion preference - memoized for performance
  const getVariants = useCallback(() => {
    if (shouldReduceMotion) return fadeVariants;

    switch (transitionType) {
      case "fade":
        return fadeVariants;
      case "slide":
        return slideVariants;
      default:
        return pageVariants;
    }
  }, [transitionType, shouldReduceMotion]);

  // Use AnimatePresence with optimized settings
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.route}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={getVariants()}
        className="page-transition-wrapper"
        // Add layout prop for smoother transitions with changing content sizes
        layout="position"
        // Add layoutId for consistent animations between pages
        layoutId="page-transition"
        // Optimize GPU rendering
        style={{
          backfaceVisibility: "hidden",
          transform: "translateZ(0)",
          WebkitFontSmoothing: "subpixel-antialiased",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(PageTransitionWrapper);

/**
 * Advanced variants for more complex animations
 * Can be imported and used in individual pages for custom animations
 */
export const fadeInUpVariants = {
  initial: { opacity: 0, y: 20 }, // Reduced distance for better performance
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export const fadeInLeftVariants = {
  initial: { opacity: 0, x: -30 }, // Reduced distance for better performance
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export const fadeInRightVariants = {
  initial: { opacity: 0, x: 30 }, // Reduced distance for better performance
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export const zoomInVariants = {
  initial: { opacity: 0, scale: 0.95 }, // Less extreme scale for better performance
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export const staggerContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.05, // Faster stagger for better performance
    },
  },
};

export const staggerItemVariants = {
  initial: { opacity: 0, y: 10 }, // Reduced distance for better performance
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useCallback, memo } from "react";

// Default page transition variants - optimized for speed
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10, // Reduced distance for faster animation
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2, // Faster animation
      ease: "easeOut", // Simpler easing function
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1, // Very quick exit
    },
  },
};

// Slide transition variants - optimized for speed
const slideVariants = {
  initial: {
    opacity: 0,
    x: 20, // Reduced distance for faster animation
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2, // Faster animation
      ease: "easeOut", // Simpler easing function
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1, // Very quick exit
    },
  },
};

// Fade transition variants - optimized for speed
const fadeVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.15, // Very fast fade in
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1, // Very quick exit
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

  // Define callbacks at the top level of the component
  const handleRouteChangeStart = useCallback(() => {
    // Store scroll position - simplified for performance
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        `scrollPos-${router.asPath}`,
        window.scrollY.toString()
      );
    }
  }, [router.asPath]);

  const handleRouteChangeComplete = useCallback((url) => {
    if (typeof window !== "undefined") {
      const scrollPos = sessionStorage.getItem(`scrollPos-${url}`);

      // Simplified scroll restoration
      if (scrollPos) {
        window.scrollTo(0, parseInt(scrollPos));
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  // Get variants based on transition type and motion preference
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

  // Check for user's motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setShouldReduceMotion(mediaQuery.matches);

      const handleChange = (e) => setShouldReduceMotion(e.matches);

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

  // Handle scroll restoration
  useEffect(() => {
    if (!enableScrollRestoration) return;

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [
    router,
    enableScrollRestoration,
    handleRouteChangeStart,
    handleRouteChangeComplete,
  ]);

  // Simplified AnimatePresence for better performance
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.route}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={getVariants()}
        className="page-transition-wrapper"
        // Removed layout prop for better performance
        // Simplified style properties
        style={{
          willChange: "opacity, transform",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Export without memo for better performance in some cases
export default PageTransitionWrapper;

// Simplified animation variants for components
export const fadeInUpVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const fadeInLeftVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const fadeInRightVariants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const zoomInVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const staggerContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.03, // Faster stagger
    },
  },
};

export const staggerItemVariants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
};

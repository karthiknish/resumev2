import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

// Default page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// Slide transition variants
const slideVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// Fade transition variants
const fadeVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
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
export default function PageTransitionWrapper({
  children,
  transitionType = "default",
  enableScrollRestoration = true,
}) {
  const router = useRouter();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  // Check for user's motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setShouldReduceMotion(mediaQuery.matches);

    const handleChange = (e) => setShouldReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle scroll restoration
  useEffect(() => {
    if (!enableScrollRestoration) return;

    // Store scroll position before navigation
    const handleRouteChangeStart = () => {
      sessionStorage.setItem(
        `scrollPos-${router.asPath}`,
        window.scrollY.toString()
      );
    };

    // Restore scroll position after navigation
    const handleRouteChangeComplete = (url) => {
      const scrollPos = sessionStorage.getItem(`scrollPos-${url}`);
      if (scrollPos) {
        window.scrollTo(0, parseInt(scrollPos));
      } else {
        window.scrollTo(0, 0);
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router, enableScrollRestoration]);

  // Select the appropriate variants based on transition type and motion preference
  const getVariants = () => {
    if (shouldReduceMotion) return fadeVariants;

    switch (transitionType) {
      case "fade":
        return fadeVariants;
      case "slide":
        return slideVariants;
      default:
        return pageVariants;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={getVariants()}
        className="page-transition-wrapper"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Advanced variants for more complex animations
 * Can be imported and used in individual pages for custom animations
 */
export const fadeInUpVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
};

export const fadeInLeftVariants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

export const fadeInRightVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
};

export const zoomInVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

export const staggerContainerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

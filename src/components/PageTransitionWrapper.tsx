import { useRouter } from "next/router";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useState, useEffect, useCallback, ReactNode } from "react";

interface PageTransitionWrapperProps {
  children: ReactNode;
  transitionType?: "fade" | "slide" | "default";
  enableScrollRestoration?: boolean;
}

// Default page transition variants - optimized for speed
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

// Slide transition variants - optimized for speed
const slideVariants: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

// Fade transition variants - optimized for speed
const fadeVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

function PageTransitionWrapper({
  children,
  transitionType = "default",
  enableScrollRestoration = true,
}: PageTransitionWrapperProps) {
  const router = useRouter();
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  const handleRouteChangeStart = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        `scrollPos-${router.asPath}`,
        window.scrollY.toString()
      );
    }
  }, [router.asPath]);

  const handleRouteChangeComplete = useCallback((url: string) => {
    if (typeof window !== "undefined") {
      const scrollPos = sessionStorage.getItem(`scrollPos-${url}`);

      if (scrollPos) {
        window.scrollTo(0, parseInt(scrollPos));
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  const getVariants = useCallback((): Variants => {
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setShouldReduceMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, []);

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

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.route}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={getVariants()}
        className="page-transition-wrapper"
        style={{
          willChange: "opacity, transform",
          overflow: "visible",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransitionWrapper;

export const fadeInUpVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const fadeInLeftVariants: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const fadeInRightVariants: Variants = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const zoomInVariants: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const staggerContainerVariants: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.15 } },
};

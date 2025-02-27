import { motion } from "framer-motion";

// Fade-in animation for components
export const FadeIn = ({ children, delay = 0, duration = 0.5, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide-in animation from bottom
export const SlideUp = ({
  children,
  delay = 0,
  duration = 0.5,
  distance = 50,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: distance }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide-in animation from left
export const SlideInLeft = ({
  children,
  delay = 0,
  duration = 0.5,
  distance = 50,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -distance }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -distance }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide-in animation from right
export const SlideInRight = ({
  children,
  delay = 0,
  duration = 0.5,
  distance = 50,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: distance }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: distance }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scale animation
export const ScaleIn = ({ children, delay = 0, duration = 0.5, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Staggered animation for lists
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  ...props
}) => {
  return (
    <motion.div initial="hidden" animate="visible" exit="exit" {...props}>
      {children}
    </motion.div>
  );
};

// Staggered item to be used with StaggerContainer
export const StaggerItem = ({ children, index = 0, ...props }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
    exit: { opacity: 0, y: 20 },
  };

  return (
    <motion.div custom={index} variants={variants} {...props}>
      {children}
    </motion.div>
  );
};

// Hover animation for cards and buttons
export const HoverCard = ({ children, scale = 1.03, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Pulse animation for notifications or highlights
export const PulseAnimation = ({ children, ...props }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        boxShadow: [
          "0 0 0 rgba(59, 130, 246, 0.4)",
          "0 0 15px rgba(59, 130, 246, 0.6)",
          "0 0 0 rgba(59, 130, 246, 0.4)",
        ],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Page transitions
export const PageTransition = ({ children, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Animation variants for reuse
export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 30, transition: { duration: 0.3 } },
};

export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

// Motion component wrappers for common HTML elements
export const MotionDiv = motion.div;
export const MotionButton = motion.button;
export const MotionSection = motion.section;
export const MotionHeader = motion.header;
export const MotionFooter = motion.footer;
export const MotionSpan = motion.span;
export const MotionUl = motion.ul;
export const MotionLi = motion.li;

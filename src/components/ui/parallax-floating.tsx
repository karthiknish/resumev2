/* eslint-disable */
"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAnimationFrame } from "framer-motion"; // Changed from motion/react

import { cn } from "@/lib/utils";

// Throttle function for performance
const throttle = (callback: Function, delay: number) => {
  let lastCall = 0;
  return function (...args: any[]) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    callback(...args);
  };
};

// Custom hook to track mouse position
const useMousePositionRef = (containerRef: React.RefObject<HTMLDivElement>) => {
  const mousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Throttle mouse move handler to improve performance
    const handleMouseMove = throttle((e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mousePositionRef.current = { x, y };
    }, 16); // ~ 60fps

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef]);

  return mousePositionRef;
};

interface FloatingContextType {
  registerElement: (id: string, element: HTMLDivElement, depth: number) => void;
  unregisterElement: (id: string) => void;
}

const FloatingContext = createContext<FloatingContextType | null>(null);

interface FloatingProps {
  children: ReactNode;
  className?: string;
  sensitivity?: number;
  easingFactor?: number;
}

const Floating = ({
  children,
  className,
  sensitivity = 1,
  easingFactor = 0.05,
  ...props
}: FloatingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useMousePositionRef(containerRef);
  const elementsRef = useRef<
    Record<string, { element: HTMLDivElement; depth: number }>
  >({});
  const animationRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only start animations when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const registerElement = useCallback(
    (id: string, element: HTMLDivElement, depth: number) => {
      elementsRef.current[id] = { element, depth };
    },
    []
  );

  const unregisterElement = useCallback((id: string) => {
    delete elementsRef.current[id];
  }, []);

  // Use animation frame only when visible
  useAnimationFrame(() => {
    if (!isVisible) return;

    const { x, y } = mousePositionRef.current;

    Object.values(elementsRef.current).forEach(({ element, depth }) => {
      if (!element) return;

      const currentX = parseFloat(element.dataset.x || "0");
      const currentY = parseFloat(element.dataset.y || "0");

      const targetX = x * sensitivity * depth;
      const targetY = y * sensitivity * depth;

      const newX = currentX + (targetX - currentX) * easingFactor;
      const newY = currentY + (targetY - currentY) * easingFactor;

      element.style.transform = `translate(${newX}px, ${newY}px)`;
      element.dataset.x = newX.toString();
      element.dataset.y = newY.toString();
    });
  });

  return (
    <FloatingContext.Provider value={{ registerElement, unregisterElement }}>
      <div
        ref={containerRef}
        className={cn("absolute top-0 left-0 w-full h-full", className)}
        {...props}
      >
        {children}
      </div>
    </FloatingContext.Provider>
  );
};

export default Floating;

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  depth?: number;
}

export const FloatingElement = ({
  children,
  className,
  depth = 1,
}: FloatingElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(Math.random().toString(36).substring(7));
  const context = useContext(FloatingContext);

  useEffect(() => {
    if (!elementRef.current || !context) return;

    const nonNullDepth = depth ?? 0.01;

    context.registerElement(idRef.current, elementRef.current, nonNullDepth);
    return () => context.unregisterElement(idRef.current);
  }, [depth, context]);

  useEffect(() => {
    // Store the current idRef value in a variable to prevent it from changing
    const id = idRef.current;

    return () => {
      if (id) {
        // Use the stored id value in the cleanup function
        context?.unregisterElement(id);
      }
    };
  }, [context]);

  return (
    <div
      ref={elementRef}
      className={cn("absolute will-change-transform", className)}
    >
      {children}
    </div>
  );
};

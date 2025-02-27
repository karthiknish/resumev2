/* eslint-disable */
"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { motion } from "framer-motion";

export const Spotlight = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const updatePosition = (event: MouseEvent) => {
    if (!divRef.current || !isMounted) return;

    const rect = divRef.current.getBoundingClientRect();
    startTransition(() => {
      setPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    });
  };

  const updateOpacity = (event: MouseEvent) => {
    if (!divRef.current || !isMounted) return;

    const rect = divRef.current.getBoundingClientRect();
    const isInside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;

    startTransition(() => {
      setOpacity(isInside ? 1 : 0);
    });
  };

  useEffect(() => {
    startTransition(() => {
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mousemove", updateOpacity);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousemove", updateOpacity);
    };
  }, [isMounted, updatePosition, updateOpacity]);

  useEffect(() => {
    if (!position) {
      return;
    }
    updatePosition(
      new MouseEvent("mousemove", { clientX: position.x, clientY: position.y })
    );
    updateOpacity(
      new MouseEvent("mousemove", { clientX: position.x, clientY: position.y })
    );
  }, [position, updatePosition, updateOpacity]);

  const baseClassName = `relative ${className}`;

  if (!isMounted) {
    return (
      <div ref={divRef} className={baseClassName}>
        {children}
      </div>
    );
  }

  return (
    <div ref={divRef} className={baseClassName}>
      {children}
      <motion.div
        className="pointer-events-none absolute -inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.1), transparent 40%)`,
          opacity,
        }}
      />
    </div>
  );
};

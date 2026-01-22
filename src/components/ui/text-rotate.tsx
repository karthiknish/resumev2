import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  useRef,
} from "react";
import { AnimatePresence, motion, Transition, TargetAndTransition, VariantLabels } from "framer-motion";

import { cn } from "@/lib/utils";

interface TextRotateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "initial" | "animate" | "exit"> {
  texts: string[];
  transition?: Transition;
  initial?: TargetAndTransition | VariantLabels;
  animate?: TargetAndTransition | VariantLabels;
  exit?: TargetAndTransition | VariantLabels;
  animatePresenceMode?: "wait" | "popLayout" | "sync";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: "characters" | "words" | "lines" | string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

export interface TextRotateRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...props
    },
    ref
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    // Defer animation initialization until component is in view
    useEffect(() => {
      if (!elementRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsInView(true);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(elementRef.current);

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, []);

    // handy function to split text into characters with support for unicode and emojis
    const splitIntoCharacters = useCallback((text: string) => {
      if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
        const Segmenter = (Intl as unknown as { Segmenter: new (lang: string, options: { granularity: string }) => { segment: (text: string) => Iterable<{ segment: string }> } }).Segmenter;
        const segmenter = new Segmenter("en", { granularity: "grapheme" });
        return Array.from(segmenter.segment(text), ({ segment }) => segment);
      }
      // Fallback for browsers that don't support Intl.Segmenter
      return Array.from(text);
    }, []);

    const elements = useMemo(() => {
      const currentText = texts[currentTextIndex];
      if (splitBy === "characters") {
        const text = currentText.split(" ");
        return text.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== text.length - 1,
        }));
      }
      return splitBy === "words"
        ? currentText.split(" ")
        : splitBy === "lines"
        ? currentText.split("\n")
        : currentText.split(splitBy);
    }, [texts, currentTextIndex, splitBy, splitIntoCharacters]);

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number) => {
        const total = totalChars;
        if (staggerFrom === "first") return index * staggerDuration;
        if (staggerFrom === "last")
          return (total - 1 - index) * staggerDuration;
        if (staggerFrom === "center") {
          const center = Math.floor(total / 2);
          return Math.abs(center - index) * staggerDuration;
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * total);
          return Math.abs(randomIndex - index) * staggerDuration;
        }
        return Math.abs((staggerFrom as number) - index) * staggerDuration;
      },
      [staggerFrom, staggerDuration]
    );

    // Helper function to handle index changes and trigger callback
    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        onNext?.(newIndex);
      },
      [onNext]
    );

    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === texts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;

      if (nextIndex !== currentTextIndex) {
        handleIndexChange(nextIndex);
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const previous = useCallback(() => {
      const prevIndex =
        currentTextIndex === 0
          ? loop
            ? texts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;

      if (prevIndex !== currentTextIndex) {
        handleIndexChange(prevIndex);
      }
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex !== currentTextIndex) {
          handleIndexChange(validIndex);
        }
      },
      [texts.length, currentTextIndex, handleIndexChange]
    );

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) {
        handleIndexChange(0);
      }
    }, [currentTextIndex, handleIndexChange]);

    // Expose all navigation functions via ref
    useImperativeHandle(
      ref,
      () => ({
        next,
        previous,
        jumpTo,
        reset,
      }),
      [next, previous, jumpTo, reset]
    );

    // Only start the rotation interval when in view
    useEffect(() => {
      if (!auto || !isInView) return;

      const intervalId = setInterval(() => {
        next();
      }, rotationInterval);

      return () => clearInterval(intervalId);
    }, [currentTextIndex, rotationInterval, auto, isInView, next]);

    return (
      <div
        ref={elementRef}
        className={cn(mainClassName)}
        {...props}
      >
        {/* Only render animations when in view */}
        {isInView && (
          <AnimatePresence
            mode={animatePresenceMode}
            initial={animatePresenceInitial}
          >
            <motion.div
              key={currentTextIndex}
              className={cn(
                "flex flex-wrap",
                splitBy === "lines" && "flex-col w-full"
              )}
              layout
              aria-hidden="true"
            >
              {(splitBy === "characters"
                ? (elements as { characters: string[]; needsSpace: boolean }[])
                : (elements as string[]).map((el, i) => ({
                    characters: [el],
                    needsSpace: i !== elements.length - 1,
                  }))
              ).map((wordObj, wordIndex, array) => {
                const previousCharsCount = array
                  .slice(0, wordIndex)
                  .reduce((sum, word) => sum + word.characters.length, 0);

                return (
                  <span
                    key={wordIndex}
                    className={cn("inline-flex", splitLevelClassName)}
                  >
                    {wordObj.characters.map((char: string, charIndex: number) => (
                      <motion.span
                        initial={initial}
                        animate={animate}
                        exit={exit}
                        key={charIndex}
                        transition={{
                          ...transition,
                          delay: getStaggerDelay(
                            previousCharsCount + charIndex,
                            array.reduce(
                              (sum, word) => sum + word.characters.length,
                              0
                            )
                          ),
                        }}
                        className={cn("inline-block", elementLevelClassName)}
                      >
                        {char}
                      </motion.span>
                    ))}
                    {wordObj.needsSpace && (
                      <span className="whitespace-pre"> </span>
                    )}
                  </span>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    );
  }
);

TextRotate.displayName = "TextRotate";

export { TextRotate };


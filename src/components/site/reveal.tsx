"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;       // seconds
  y?: number;           // px to translate from
  blur?: boolean;
  className?: string;
  once?: boolean;
  as?: "div" | "section" | "li" | "span" | "p" | "h2" | "h3";
};

/**
 * Fade + lift on scroll-into-view, with a hard fallback that force-shows
 * content after 1.4s regardless of IntersectionObserver firing.
 * This makes the component safe for headless browsers, no-JS, and slow IO.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  blur = true,
  className,
  once = true,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  const [forceShow, setForceShow] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setForceShow(true), 1400);
    return () => clearTimeout(t);
  }, []);

  const variants: Variants = {
    hidden: reduce
      ? { opacity: 0 }
      : {
          opacity: 0,
          y,
          filter: blur ? "blur(8px)" : "blur(0px)",
        },
    show: reduce
      ? { opacity: 1 }
      : {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.9,
            delay,
            ease: [0.16, 1, 0.3, 1],
          },
        },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      animate={forceShow ? "show" : undefined}
      whileInView={forceShow ? undefined : "show"}
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Stagger container — wrap a list of <RevealItem> children.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  const [forceShow, setForceShow] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setForceShow(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={forceShow ? "show" : undefined}
      whileInView={forceShow ? undefined : "show"}
      viewport={{ once, margin: "-80px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 24,
  blur = true,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  blur?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce
          ? { opacity: 0 }
          : { opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" },
        show: reduce
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
            },
      }}
    >
      {children}
    </motion.div>
  );
}

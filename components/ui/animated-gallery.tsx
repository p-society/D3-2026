"use client";

import React, { createContext, useContext, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ── Scroll progress shared via context ─────────────────────────── */
const ScrollContext = createContext<MotionValue<number> | null>(null);

/* ── Tall container that owns the scroll range ───────────────────── */
export function ContainerScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <ScrollContext.Provider value={scrollYProgress}>
      <div ref={ref} className={cn("relative", className)}>
        {children}
      </div>
    </ScrollContext.Provider>
  );
}

/* ── Sticky viewport-height inner ────────────────────────────────── */
export function ContainerSticky({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("sticky top-0 flex items-center overflow-hidden", className)}>
      {children}
    </div>
  );
}

/* ── Staggered reveal wrapper ────────────────────────────────────── */
const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function ContainerStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={staggerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Individual stagger child ────────────────────────────────────── */
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ContainerAnimated({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/* ── 3-column grid wrapper ───────────────────────────────────────── */
export function GalleryContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid h-full w-full grid-cols-3", className)}>
      {children}
    </div>
  );
}

/* ── Parallax column — translates on scroll using parent's progress ─ */
export function GalleryCol({
  children,
  yRange,
  className,
}: {
  children: React.ReactNode;
  yRange: [string, string];
  className?: string;
}) {
  const fallback = useMotionValue(0);
  const progress = useContext(ScrollContext) ?? fallback;
  const y = useTransform(progress, [0, 1], yRange);

  return (
    <motion.div style={{ y }} className={cn("flex flex-col", className)}>
      {children}
    </motion.div>
  );
}

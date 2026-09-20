"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";
import { STUDIO } from "./site-data";
import { asset } from "@/lib/utils";

export function Hero() {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: image moves slower than scroll, text fades and lifts
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.32, 0.55]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden"
    >
      {/* Parallax background image */}
      <motion.div
        style={reduce ? undefined : { y: imgY, scale: imgScale }}
        className="absolute inset-0 will-change-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sage-deep/30 via-cream to-cream" />
        <img
          src={asset("/images/hero-light.png")}
          alt="A bright, plant-filled reflexology studio at morning with cream walls and lush green ferns"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          onError={(e) => {
            // Fallback to proto image if generation failed
            e.currentTarget.src = asset("/images/proto-home.jpg");
          }}
        />
      </motion.div>

      {/* Light overlays — keep text readable on bright photo */}
      <motion.div
        style={{ opacity: reduce ? 0.4 : overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-b from-forest-deep/30 via-cream/10 to-cream"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,oklch(0.985_0.008_85/0),oklch(0.985_0.008_85/0.7))]" />
      <div className="grain absolute inset-0" />

      {/* Hero content */}
      <motion.div
        style={reduce ? undefined : { y: textY, opacity: textOpacity }}
        className="relative z-10 h-full mx-auto max-w-7xl px-6 lg:px-10 flex flex-col"
      >
        <div className="flex-1" />

        {/* Eyebrow + rating row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-8"
        >
          <span className="h-px w-12 bg-gold/70" />
          <span className="text-xs tracking-luxe uppercase text-forest-soft/85">
            {STUDIO.heroEyebrow}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3 fill-current" />
            ))}
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-light text-forest text-[clamp(2.75rem,8vw,7rem)] leading-[1.02] tracking-[-0.01em] max-w-5xl"
        >
          {STUDIO.heroHeadline.split(".")[0]}.
          <br />
          <span className="italic text-gradient-forest font-light">
            {STUDIO.heroHeadline.split(".")[1]}.
          </span>
          <br />
          <span className="italic text-gradient-gold font-light">
            {STUDIO.heroHeadline.split(".")[2]}.
          </span>
        </motion.h1>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-xl text-forest-soft text-base sm:text-lg leading-relaxed font-light"
        >
          {STUDIO.heroSub} Slow, intentional sessions rooted in traditional
          practice — held in a quiet room designed to lower the shoulders on
          contact.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#booking"
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-full
              bg-forest text-cream text-sm font-medium tracking-wide-luxe uppercase
              shadow-[0_18px_50px_-12px_oklch(0.30_0.028_155/0.45)]
              hover:shadow-[0_24px_60px_-12px_oklch(0.30_0.028_155/0.6)]
              hover:-translate-y-0.5 transition-all duration-500"
          >
            Book an appointment
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#services"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full
              text-forest-soft text-sm tracking-wide-luxe uppercase
              border border-forest/20 hover:border-forest/40 hover:text-forest
              transition-all duration-500"
          >
            Explore the practice
          </a>
        </motion.div>

        {/* Bottom row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.2 }}
          className="mt-auto pb-10 pt-16 flex items-end justify-between gap-6"
        >
          <div className="hidden sm:flex flex-col gap-1">
            <span className="text-[10px] tracking-luxe uppercase text-forest-soft/55">
              Now welcoming
            </span>
            <span className="font-serif italic text-forest-soft text-lg">
              New clients
            </span>
          </div>
          <a
            href="#services"
            className="group flex flex-col items-center gap-2 text-forest-soft hover:text-forest transition-colors"
          >
            <span className="text-[10px] tracking-luxe uppercase">Scroll</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="size-4" />
            </motion.span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

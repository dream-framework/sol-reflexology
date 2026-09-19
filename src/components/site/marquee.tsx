"use client";

import { motion } from "framer-motion";

const WORDS = [
  "Foot Reflexology",
  "Hand & Arm Renewal",
  "Facial Reflexology",
  "Prenatal Sole Care",
  "Restorative Night Ritual",
  "Seasonal Grounding",
  "Cranial Release",
  "Lymphatic Drainage",
];

export function Marquee() {
  // Two tracks scrolling opposite directions, very slow
  return (
    <section
      aria-hidden
      className="relative py-10 sm:py-14 border-y border-cream/8 bg-forest-deep/60 overflow-hidden"
    >
      <div className="flex overflow-hidden">
        <motion.ul
          className="flex shrink-0 items-center gap-12 pr-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          {[...WORDS, ...WORDS].map((w, i) => (
            <li key={i} className="flex items-center gap-12">
              <span className="font-serif italic text-cream/30 text-2xl sm:text-3xl">{w}</span>
              <span className="size-1.5 rounded-full bg-gold/40" />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

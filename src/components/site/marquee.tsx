"use client";

import { motion } from "framer-motion";

const WORDS = [
  "Initial Reflexology",
  "Follow-up Reflexology",
  "Relaxation Session",
  "Foot Reflexology",
  "Holistic Bodywork",
  "Cranial Release",
  "Lymphatic Drainage",
  "Plant-filled Studio",
];

export function Marquee() {
  return (
    <section
      aria-hidden
      className="relative py-10 sm:py-14 border-y border-forest/8 bg-sage-section overflow-hidden"
    >
      <div className="grain absolute inset-0" />
      <div className="relative flex overflow-hidden">
        <motion.ul
          className="flex shrink-0 items-center gap-12 pr-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
          {[...WORDS, ...WORDS].map((w, i) => (
            <li key={i} className="flex items-center gap-12">
              <span className="font-serif italic text-forest-soft/45 text-2xl sm:text-3xl">{w}</span>
              <span className="size-1.5 rounded-full bg-gold/50" />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

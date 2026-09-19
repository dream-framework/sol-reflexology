"use client";

import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import * as React from "react";
import { STATS } from "./site-data";
import { RevealGroup, RevealItem } from "./reveal";

export function Stats() {
  return (
    <section className="relative py-20 sm:py-28 border-y border-cream/8 bg-forest-deep/40">
      <div className="grain absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <RevealGroup
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-cream/8"
          stagger={0.1}
        >
          {STATS.map((stat, i) => (
            <RevealItem key={stat.label}>
              <StatCell stat={stat} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function StatCell({ stat }: { stat: typeof STATS[number] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  // Extract numeric portion for count-up
  const match = stat.value.match(/[\d.]+/);
  const numericTarget = match ? parseFloat(match[0]) : 0;
  const prefix = stat.value.slice(0, match?.index ?? 0);
  const suffix = stat.value.slice((match?.index ?? 0) + (match?.[0].length ?? 0));

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1600, bounce: 0 });
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => {
    if (!inView || reduce || !numericTarget) {
      // Don't pre-fill display — let render block use stat.value directly
      setDisplay("");
      return;
    }
    mv.set(numericTarget);
    const unsub = spring.on("change", (v) => {
      const isFloat = numericTarget % 1 !== 0;
      setDisplay(
        (isFloat ? v.toFixed(1) : Math.round(v).toString())
      );
    });
    return () => unsub();
  }, [inView, numericTarget, reduce, mv, spring, stat.value]);

  return (
    <div
      ref={ref}
      className="bg-ink p-8 sm:p-10 flex flex-col items-center text-center"
    >
      <div className="font-serif font-light text-cream text-[clamp(2.5rem,5vw,4rem)] leading-none tracking-[-0.02em] mb-3">
        {reduce || !numericTarget || !inView ? (
          stat.value
        ) : (
          <span>
            {prefix}
            {display}
            {suffix}
          </span>
        )}
      </div>
      <div className="text-xs tracking-luxe uppercase text-cream/70 mb-1">{stat.label}</div>
      <div className="text-[11px] tracking-wide-luxe uppercase text-cream/35">{stat.sub}</div>
    </div>
  );
}

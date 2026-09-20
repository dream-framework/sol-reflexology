"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { Reveal } from "./reveal";

const PILLARS = [
  {
    title: "Slow",
    body: "Sessions run their full length. We don't watch the clock and we don't rush the closing.",
  },
  {
    title: "Specific",
    body: "Your practitioner reads the tissue in real time. Pressure, pace, and focus shift with what's in front of them.",
  },
  {
    title: "Held",
    body: "A small, quiet room. Linen, stone, and one low light. No music you didn't choose. No upsell at the door.",
  },
];

export function Philosophy() {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);

  return (
    <section
      id="philosophy"
      ref={ref}
      className="relative py-28 sm:py-40 scroll-mt-24 overflow-hidden bg-sage-section"
    >
      <div className="grain absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Image column */}
          <Reveal className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-forest/10 shadow-luxe-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-sage to-sage-deep/50" />
              <motion.img
                src="/images/philosophy-light.png"
                alt="A practitioner's hands performing reflexology on a cream linen surface, surrounded by botanical elements"
                style={reduce ? undefined : { y: imgY, scale: 1.1 }}
                className="absolute inset-0 h-full w-full object-cover will-change-transform"
                onError={(e) => {
                  e.currentTarget.src = "/images/proto-book.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent" />

              {/* Floating quote card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-6 left-6 right-6 glass-gold rounded-xl p-5"
              >
                <Quote className="size-5 text-gold mb-2" />
                <p className="font-serif italic text-forest text-base leading-snug">
                  "Pressure is a conversation, not a force."
                </p>
                <p className="mt-2 text-[10px] tracking-luxe uppercase text-forest-soft/65">
                  — Studio principle
                </p>
              </motion.div>
            </div>
          </Reveal>

          {/* Text column */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <Reveal>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-10 bg-gold/60" />
                <span className="text-xs tracking-luxe uppercase text-gold">Philosophy</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-serif font-light text-forest text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.08] tracking-[-0.01em] mb-8">
                We don't chase symptoms.
                <br />
                We <span className="italic text-gradient-forest">listen for the rhythm</span> underneath.
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-forest-soft text-base sm:text-lg leading-relaxed font-light max-w-2xl mb-6">
                Reflexology is old. The oldest surviving evidence — a wall painting
                in the tomb of Ankhmahor in Egypt — dates to 2330 BCE. The practice
                has crossed continents and centuries, refined by Chinese, Egyptian,
                and modern Western traditions. What unites them is a simple premise:
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="font-serif italic text-forest text-xl sm:text-2xl leading-snug max-w-2xl mb-14">
                The foot is a map of the whole body. Working it is a way of speaking
                to every system at once — through the body's quietest, most patient
                language.
              </p>
            </Reveal>

            {/* Pillars */}
            <div className="grid sm:grid-cols-3 gap-8 sm:gap-6">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={0.4 + i * 0.1}>
                  <div className="border-t border-forest/20 pt-5">
                    <h3 className="font-serif text-2xl text-forest mb-2">{p.title}</h3>
                    <p className="text-forest-soft text-sm leading-relaxed font-light">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

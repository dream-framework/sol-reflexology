"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "./site-data";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

export function Faq() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);

  return (
    <section id="faq" className="relative py-28 sm:py-40 scroll-mt-24 bg-cream-section">
      <div className="grain absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left header */}
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-10 bg-gold/60" />
                <span className="text-xs tracking-luxe uppercase text-gold">Questions</span>
              </div>
              <h2 className="font-serif font-light text-forest text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.01em] mb-6">
                The things people
                <br />
                <span className="italic text-gradient-forest">usually ask.</span>
              </h2>
              <p className="text-forest-soft text-sm leading-relaxed font-light max-w-sm mb-8">
                If your question isn't here, just reach out. We answer every
                email personally and never use automated replies for these.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs tracking-luxe uppercase text-forest-soft hover:text-gold transition-colors"
              >
                Get in touch →
              </a>
            </div>
          </Reveal>

          {/* Right accordion */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <ul className="divide-y divide-forest/10 border-y border-forest/10">
                {FAQ_ITEMS.map((item, i) => {
                  const isOpen = openIdx === i;
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setOpenIdx(isOpen ? null : i)}
                        className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                      >
                        <span
                          className={cn(
                            "font-serif text-xl sm:text-2xl transition-colors",
                            isOpen ? "text-gold" : "text-forest group-hover:text-forest-soft"
                          )}
                        >
                          {item.q}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          className="shrink-0 mt-1 inline-flex size-7 items-center justify-center rounded-full border border-forest/15 text-forest-soft group-hover:border-gold/40 group-hover:text-gold"
                        >
                          <Plus className="size-3.5" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="pb-6 pr-12 text-forest-soft text-base leading-relaxed font-light">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, type Service } from "./site-data";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

export function Services() {
  return (
    <section id="services" className="relative py-28 sm:py-40 scroll-mt-24 bg-cream-section">
      <div className="grain absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16 sm:mb-24">
          <Reveal className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-10 bg-gold/60" />
              <span className="text-xs tracking-luxe uppercase text-gold">The Practice</span>
            </div>
            <h2 className="font-serif font-light text-forest text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.01em]">
              Sessions held like
              <br />
              <span className="italic text-gradient-forest">a long exhale.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-md">
            <p className="text-forest-soft text-base leading-relaxed font-light">
              Three offerings, each grounded in the same principle: meet the
              body where it is, work slowly, and trust the response. Every
              session includes a brief check-in and a closing cup of tea.
            </p>
          </Reveal>
        </div>

        {/* Services grid — 3 cards in a row */}
        <RevealGroup
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          stagger={0.1}
        >
          {SERVICES.map((service, idx) => (
            <RevealItem key={service.id}>
              <ServiceCard service={service} index={idx} />
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Footer note */}
        <Reveal delay={0.2} className="mt-14 flex flex-wrap items-center justify-between gap-6">
          <p className="text-forest-soft/70 text-sm font-light max-w-md">
            All sessions are inclusive of tax. A 20% gratuity is never expected
            but always received with thanks.
          </p>
          <a
            href="#booking"
            className="group inline-flex items-center gap-2 text-sm tracking-wide-luxe uppercase text-forest-soft hover:text-gold transition-colors"
          >
            Reserve your time
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <motion.article
      whileHover="hover"
      className="group relative bg-white/70 backdrop-blur-sm p-8 sm:p-10 min-h-[440px] flex flex-col rounded-2xl border border-forest/8 shadow-soft hover:shadow-luxe transition-shadow duration-500 overflow-hidden cursor-pointer"
    >
      {/* Hover wash — subtle gold tint at top */}
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.70_0.08_80/0.08),transparent_60%)] pointer-events-none"
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top row */}
        <div className="flex items-start justify-between mb-12">
          <span className="text-xs tracking-luxe uppercase text-forest-soft/45">
            {String(index + 1).padStart(2, "0")}
          </span>
          <motion.span
            variants={{ hover: { scale: 1.08 } }}
            className="inline-flex size-12 items-center justify-center rounded-full border border-gold/30 text-gold"
          >
            <Icon className="size-5" strokeWidth={1.5} />
          </motion.span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-light text-forest text-2xl sm:text-[1.7rem] leading-tight mb-3">
          {service.name}
        </h3>

        {/* Blurb */}
        <p className="text-forest-soft text-sm leading-relaxed font-light mb-6 flex-1">
          {service.blurb}
        </p>

        {/* Highlights */}
        <ul className="flex flex-wrap gap-1.5 mb-8">
          {service.highlights.map((h) => (
            <li
              key={h}
              className="text-[10px] tracking-wide-luxe uppercase px-2.5 py-1 rounded-full border border-forest/12 text-forest-soft/75"
            >
              {h}
            </li>
          ))}
        </ul>

        {/* Footer row */}
        <div className="flex items-end justify-between pt-6 border-t border-forest/10">
          <div>
            <div className="text-[10px] tracking-luxe uppercase text-forest-soft/55 mb-1">From</div>
            <div className="font-serif text-2xl text-forest">
              ${service.priceFrom}
              <span className="text-xs text-forest-soft/55 ml-1 font-sans tracking-wide">CAD</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] tracking-luxe uppercase text-forest-soft/55 mb-1">Duration</div>
            <div className="text-sm text-forest-soft font-light">{service.duration} min</div>
          </div>
        </div>

        {/* CTA reveal on hover */}
        <motion.a
          href="#booking"
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 8 }}
          className="mt-6 inline-flex items-center gap-2 text-xs tracking-luxe uppercase text-gold hover:text-forest transition-colors"
        >
          Book this session
          <ArrowUpRight className="size-3.5" />
        </motion.a>
      </div>
    </motion.article>
  );
}

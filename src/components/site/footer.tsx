"use client";

import { ArrowUpRight } from "lucide-react";
import { STUDIO, NAV_LINKS } from "./site-data";

export function Footer() {
  return (
    <footer className="relative mt-auto bg-forest-deep border-t border-cream/10 overflow-hidden">
      <div className="grain absolute inset-0" />

      {/* Big CTA band */}
      <div className="relative z-10 border-b border-cream/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 sm:py-28 text-center">
          <p className="text-xs tracking-luxe uppercase text-gold/80 mb-6">A small studio, slowly grown</p>
          <h2 className="font-serif font-light text-cream text-[clamp(2.5rem,7vw,6rem)] leading-[1] tracking-[-0.02em] mb-8">
            Begin where the body is,
            <br />
            <span className="italic text-gradient-gold">not where it should be.</span>
          </h2>
          <a
            href="#booking"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold to-gold-soft text-ink text-sm font-medium tracking-wide-luxe uppercase shadow-luxe hover:-translate-y-0.5 transition-transform"
          >
            Book a session
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>

      {/* Footer columns */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative inline-flex size-9 items-center justify-center rounded-full border border-gold/40 text-gold">
                <span className="font-serif text-lg leading-none translate-y-[-1px]">s</span>
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl tracking-wide text-cream">{STUDIO.name}</span>
                <span className="text-[10px] tracking-luxe uppercase text-cream/45 mt-1">
                  {STUDIO.tagline}
                </span>
              </div>
            </div>
            <p className="text-cream/55 text-sm leading-relaxed font-light max-w-xs">
              A small studio in Cabbagetown, Toronto — practicing reflexology
              and holistic bodywork since 2012.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs tracking-luxe uppercase text-cream/40 mb-4">Explore</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-cream/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h4 className="text-xs tracking-luxe uppercase text-cream/40 mb-4">Visit</h4>
            <ul className="space-y-3 text-sm text-cream/70 font-light">
              <li>{STUDIO.address}</li>
              <li>{STUDIO.city}</li>
              <li>
                <a href={STUDIO.phoneHref} className="hover:text-gold transition-colors">
                  {STUDIO.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${STUDIO.email}`} className="hover:text-gold transition-colors break-all">
                  {STUDIO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs tracking-luxe uppercase text-cream/40 mb-4">Hours</h4>
            <ul className="space-y-2 text-sm text-cream/70 font-light">
              <li className="flex justify-between gap-4">
                <span>Tue – Fri</span>
                <span className="text-cream/55">10 – 20</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Saturday</span>
                <span className="text-cream/55">10 – 18</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sun – Mon</span>
                <span className="text-cream/35">Closed</span>
              </li>
            </ul>
            <a
              href={STUDIO.instagramHref}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs tracking-wide-luxe uppercase text-cream/55 hover:text-gold transition-colors"
            >
              {STUDIO.instagram}
              <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-cream/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-cream/40 font-light">
            © {new Date().getFullYear()} {STUDIO.full}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-cream/40">
            <a href="#" className="hover:text-cream/70 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cream/70 transition-colors">Cancellation policy</a>
            <a href="#" className="hover:text-cream/70 transition-colors">Gift cards</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

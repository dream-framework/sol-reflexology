"use client";

import { ArrowUpRight } from "lucide-react";
import { STUDIO, NAV_LINKS, HOURS_DISPLAY } from "./site-data";

export function Footer() {
  const hasPhone = !!STUDIO.phoneDisplay;
  const hasEmail = !!STUDIO.email;
  const hasAddress = !!STUDIO.address;
  const hasInstagram = !!STUDIO.instagram;

  return (
    <footer className="relative mt-auto bg-forest text-cream overflow-hidden">
      <div className="grain absolute inset-0" />

      {/* Big CTA band */}
      <div className="relative z-10 border-b border-cream/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 sm:py-28 text-center">
          <p className="text-xs tracking-luxe uppercase text-gold mb-6">
            A small studio, slowly grown
          </p>
          <h2 className="font-serif font-light text-cream text-[clamp(2.5rem,7vw,6rem)] leading-[1] tracking-[-0.02em] mb-8">
            Begin where the body is,
            <br />
            <span className="italic text-gradient-gold">not where it should be.</span>
          </h2>
          <a
            href="#booking"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-cream text-forest text-sm font-medium tracking-wide-luxe uppercase shadow-luxe hover:-translate-y-0.5 transition-transform"
          >
            Book an appointment
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
                <span className="font-serif text-lg leading-none translate-y-[-1px]">r</span>
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl tracking-wide text-cream">{STUDIO.name}</span>
                <span className="text-[10px] tracking-luxe uppercase text-cream/55 mt-1">
                  {STUDIO.tagline}
                </span>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed font-light max-w-xs">
              Personalized reflexology in a calm, plant-filled studio. Slow,
              intentional sessions rooted in traditional practice.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs tracking-luxe uppercase text-cream/45 mb-4">Explore</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-cream/75 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit — only render if any contact info exists */}
          <div>
            <h4 className="text-xs tracking-luxe uppercase text-cream/45 mb-4">Visit</h4>
            {hasAddress || hasPhone || hasEmail ? (
              <ul className="space-y-3 text-sm text-cream/75 font-light">
                {hasAddress && (
                  <>
                    <li>{STUDIO.address}</li>
                    <li>{STUDIO.city}</li>
                  </>
                )}
                {hasPhone && (
                  <li>
                    <a href={STUDIO.phoneHref} className="hover:text-gold transition-colors">
                      {STUDIO.phoneDisplay}
                    </a>
                  </li>
                )}
                {hasEmail && (
                  <li>
                    <a
                      href={`mailto:${STUDIO.email}`}
                      className="hover:text-gold transition-colors break-all"
                    >
                      {STUDIO.email}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-cream/45 italic font-light">
                Contact details coming soon.
              </p>
            )}
            {hasInstagram && (
              <a
                href={STUDIO.instagramHref}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs tracking-wide-luxe uppercase text-cream/60 hover:text-gold transition-colors"
              >
                {STUDIO.instagram}
                <ArrowUpRight className="size-3" />
              </a>
            )}
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs tracking-luxe uppercase text-cream/45 mb-4">Hours</h4>
            <ul className="space-y-2 text-sm text-cream/75 font-light">
              {HOURS_DISPLAY.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day.slice(0, 3)}</span>
                  <span className={h.hours === "Closed" ? "text-cream/40" : "text-cream/65"}>
                    {h.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-cream/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-cream/45 font-light">
            © {new Date().getFullYear()} {STUDIO.full}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-cream/45">
            <a href="#" className="hover:text-cream/75 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cream/75 transition-colors">Cancellation policy</a>
            <a href="#" className="hover:text-cream/75 transition-colors">Gift cards</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

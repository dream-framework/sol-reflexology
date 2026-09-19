"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, STUDIO } from "./site-data";

export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 32);
  });

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 bg-ink/70 backdrop-blur-xl border-b border-cream/10"
            : "py-6 bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10 flex items-center justify-between">
          <Logo />

          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-underline text-sm tracking-wide-luxe text-cream/75 hover:text-cream transition-colors uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#booking"
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-full text-xs tracking-luxe uppercase
                bg-gradient-to-r from-gold to-gold-soft text-ink font-medium
                shadow-[0_8px_30px_-8px_oklch(0.78_0.11_85/0.5)]
                hover:shadow-[0_12px_40px_-8px_oklch(0.78_0.11_85/0.65)]
                transition-all duration-500 hover:-translate-y-0.5"
            >
              Book a session
            </a>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="lg:hidden size-11 inline-flex items-center justify-center rounded-full border border-cream/15 text-cream/80 hover:text-cream hover:border-cream/30 transition-colors"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] lg:hidden bg-ink/95 backdrop-blur-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="size-11 inline-flex items-center justify-center rounded-full border border-cream/15 text-cream/80 hover:text-cream"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 flex flex-col items-center justify-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-4xl text-cream/85 hover:text-gold transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="px-6 pb-10">
              <a
                href="#booking"
                onClick={() => setOpen(false)}
                className="block text-center px-6 py-4 rounded-full text-sm tracking-luxe uppercase
                  bg-gradient-to-r from-gold to-gold-soft text-ink font-medium"
              >
                Book a session
              </a>
              <p className="mt-6 text-center text-xs tracking-luxe uppercase text-cream/50">
                {STUDIO.phoneDisplay}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-3">
      <span
        aria-hidden
        className="relative inline-flex size-9 items-center justify-center rounded-full border border-gold/40 text-gold
          group-hover:border-gold transition-colors"
      >
        <span className="font-serif text-lg leading-none translate-y-[-1px]">s</span>
        <span className="absolute inset-0 rounded-full bg-gold/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-2xl tracking-wide text-cream">{STUDIO.name}</span>
        <span className="text-[10px] tracking-luxe uppercase text-cream/45 mt-1">
          {STUDIO.tagline}
        </span>
      </span>
    </a>
  );
}

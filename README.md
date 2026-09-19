# Sōl — Reflexology & Holistic Bodywork

A state-of-the-art marketing + booking site for a small reflexology studio. Built as a single-page experience with an earthy-zen × dark-luxury aesthetic, a 5-step booking flow, and content that's easy to swap.

> Brand name, copy, services, practitioners, FAQ, and contact details all live in [`src/components/site/site-data.ts`](src/components/site/site-data.ts) — edit one file to rebrand the entire site.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript 5**
- **Tailwind CSS 4** with a custom design system (CSS variables in `globals.css`)
- **shadcn/ui** component primitives
- **Framer Motion** for scroll reveals, parallax, and step transitions
- **Cormorant Garamond** (serif display) + **Inter** (sans body) via `next/font/google`
- **Sonner** for toast notifications
- **OpenStreetMap** embed for the contact map (no API key required)
- **z-ai-web-dev-sdk** for generating custom botanical/spa imagery

## What's inside

| Section | File | Notes |
|---|---|---|
| Nav (sticky, transparent → glass on scroll) | `src/components/site/nav.tsx` | Mobile menu overlay |
| Hero (parallax bg + scroll-faded content) | `src/components/site/hero.tsx` | Full-bleed image, gold-gradient CTA |
| Marquee (slow scrolling service names) | `src/components/site/marquee.tsx` | |
| Services grid (6 cards) | `src/components/site/services.tsx` | Hover reveals "Book this session" CTA |
| Philosophy (split image + text + 3 pillars) | `src/components/site/philosophy.tsx` | Parallax image, floating quote card |
| Stats strip (count-up on scroll) | `src/components/site/stats.tsx` | |
| **Booking (5-step form)** | `src/components/site/booking.tsx` | Service → Practitioner → Date/Time → Details → Review → Success |
| FAQ (accordion, first item open) | `src/components/site/faq.tsx` | |
| Contact (info + OSM map + form) | `src/components/site/contact.tsx` | Form sends a toast on submit |
| Footer (CTA band + 4-column) | `src/components/site/footer.tsx` | |
| Scroll-reveal wrapper | `src/components/site/reveal.tsx` | 1.4s force-show fallback for SSR/headless |

## Booking flow

The booking is a **smart form** (no backend persistence yet). The flow is:

1. **Service** — pick one of 6 services (cards with price, duration, highlights)
2. **Practitioner** — pick from 4 options (or "First available")
3. **Date & time** — pick from the next 12 open studio days (Tue–Sat), then a time slot
4. **Your details** — name, email, phone, optional notes
5. **Review** — see a summary, then submit
6. **Success** — confirmation view + Sonner toast

To wire this up to a real backend later, replace the `submit()` function in `booking.tsx` with a `fetch('/api/bookings', ...)` call and add a Prisma model.

## Design system

All colors, fonts, and effects live in [`src/app/globals.css`](src/app/globals.css):

- **Surfaces**: `--ink` (deep forest-charcoal), `--forest`, `--forest-deep`
- **Text**: `--cream` (warm off-white)
- **Accents**: `--gold`, `--gold-soft`, `--sage`, `--terracotta`, `--sand`
- **Effects**: `.glass`, `.glass-gold`, `.grain`, `.shadow-luxe`, `.text-gradient-gold`, `.shimmer`

## Customizing imagery

The 6 images in `public/images/` were generated with `z-ai-web-dev-sdk`. To regenerate:

```bash
bun run scripts/gen-images.ts
```

The prompts are defined in [`scripts/gen-images.ts`](scripts/gen-images.ts). Tweak them to change the visual direction.

## Getting started

```bash
bun install        # install deps
bun run dev        # start dev server on :3000
bun run lint       # eslint check
bun run build      # production build (standalone output)
```

## Project structure

```
.
├── public/
│   └── images/              # Generated spa/botanical imagery
├── scripts/
│   └── gen-images.ts        # Image generation script (z-ai-web-dev-sdk)
├── src/
│   ├── app/
│   │   ├── globals.css      # Design system (colors, fonts, utilities)
│   │   ├── layout.tsx       # Root layout, fonts, metadata
│   │   └── page.tsx         # Single-page composition
│   ├── components/
│   │   ├── site/            # All section components + shared data
│   │   │   ├── site-data.ts # ← EDIT THIS to rebrand
│   │   │   ├── nav.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── marquee.tsx
│   │   │   ├── services.tsx
│   │   │   ├── philosophy.tsx
│   │   │   ├── stats.tsx
│   │   │   ├── booking.tsx
│   │   │   ├── faq.tsx
│   │   │   ├── contact.tsx
│   │   │   ├── footer.tsx
│   │   │   └── reveal.tsx
│   │   └── ui/              # shadcn/ui primitives
│   └── lib/
│       └── utils.ts
└── package.json
```

## Next steps to make it production-ready

- [ ] Wire the booking `submit()` to a real backend (Prisma + API route)
- [ ] Add email notifications (Resend, Postmark, etc.)
- [ ] Replace the OpenStreetMap embed with a styled Mapbox or Google Maps embed
- [ ] Add real practitioner photos to `public/images/`
- [ ] Set up analytics (Plausible, Fathom)
- [ ] Add OG image + favicon
- [ ] Configure a custom domain

## License

Private. All rights reserved by the studio owner.

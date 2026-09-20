import type { LucideIcon } from "lucide-react";
import {
  Footprints,
  Wind,
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Clock3,
} from "lucide-react";

/* ============================================================
   Site content — all copy lives here so it's trivial to swap.

   ↓ EDIT THE VALUES BELOW TO MAKE THIS SITE YOURS ↓
   - STUDIO:        name, contact, address, socials
   - SERVICES:      your service menu
   - BUSINESS_HOURS: your weekly schedule (drives booking slot generation)
   - FAQ_ITEMS:     your frequently asked questions
   ============================================================ */

export const STUDIO = {
  // Brand — replace with your studio name
  name: "Reflexology",
  full: "Reflexology Studio",
  tagline: "Reflexology & Holistic Bodywork",

  // Hero copy
  heroEyebrow: "Personalized reflexology",
  heroHeadline: "Relax. Restore. Rebalance.",
  heroSub: "Personalized reflexology in a calm, plant-filled studio.",

  // Contact — leave empty strings until you fill them in
  phoneDisplay: "",            // e.g. "+1 (555) 123-4567"
  phoneHref: "",               // e.g. "tel:+15551234567"
  email: "",                   // e.g. "hello@yourstudio.com"
  address: "",                 // e.g. "123 Main Street"
  city: "",                    // e.g. "Your City, ST  00000"
  instagram: "",               // e.g. "@yourstudio"
  instagramHref: "",           // e.g. "https://instagram.com/yourstudio"
};

export type Service = {
  id: string;
  name: string;
  duration: number;        // minutes (drives slot length when booked)
  priceFrom: number;       // CAD
  blurb: string;
  icon: LucideIcon;
  highlights: string[];
};

export const SERVICES: Service[] = [
  {
    id: "initial",
    name: "Initial Reflexology",
    duration: 60,
    priceFrom: 120,
    blurb:
      "A full first session. We'll talk through your history, then work the foot's complete reflex map to calm the nervous system and restore circulation.",
    icon: Footprints,
    highlights: ["Full reflex map", "Intake & history", "First-time clients"],
  },
  {
    id: "follow-up",
    name: "Follow-up Reflexology",
    duration: 45,
    priceFrom: 95,
    blurb:
      "For returning clients. A focused session building on your last visit — addressing what's shifted and what your body is asking for today.",
    icon: Wind,
    highlights: ["Returning clients", "Targeted focus", "Maintenance care"],
  },
  {
    id: "relaxation",
    name: "Relaxation Session",
    duration: 30,
    priceFrom: 65,
    blurb:
      "A shorter, gentler session for when you just need to drop your shoulders. Soothing pressure, no intake, full focus on unwinding.",
    icon: Heart,
    highlights: ["Gentle pressure", "No intake", "Stress relief"],
  },
];

/* ============================================================
   Business hours — drives both the "Hours" display and the
   booking calendar's slot generation. Set null for closed days.
   Times are 24-hour "HH:mm" strings.
   ============================================================ */

export const BUSINESS_HOURS: Record<
  string,
  { start: string; end: string } | null
> = {
  // Day index: 0 = Sunday ... 6 = Saturday
  "0": null,                              // Sunday — closed
  "1": { start: "09:00", end: "18:00" },  // Monday
  "2": { start: "09:00", end: "18:00" },  // Tuesday
  "3": { start: "09:00", end: "18:00" },  // Wednesday
  "4": { start: "09:00", end: "18:00" },  // Thursday
  "5": { start: "09:00", end: "18:00" },  // Friday
  "6": { start: "10:00", end: "14:00" },  // Saturday — short day
};

export const SLOT_MINUTES = 30;

export const HOURS_DISPLAY = [
  { day: "Monday", hours: "9:00 — 18:00" },
  { day: "Tuesday", hours: "9:00 — 18:00" },
  { day: "Wednesday", hours: "9:00 — 18:00" },
  { day: "Thursday", hours: "9:00 — 18:00" },
  { day: "Friday", hours: "9:00 — 18:00" },
  { day: "Saturday", hours: "10:00 — 14:00" },
  { day: "Sunday", hours: "Closed" },
];

export const STATS: { value: string; label: string; sub: string }[] = [
  { value: "60", label: "Minute initial sessions", sub: "Full intake & reflex map" },
  { value: "30", label: "Minute slot increments", sub: "Flexible booking" },
  { value: "5", label: "Days a week", sub: "Mon–Fri, Sat mornings" },
  { value: "100%", label: "Private sessions", sub: "One client at a time" },
];

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Do I need to prepare anything before my session?",
    a: "Arrive ten minutes early so we can settle you in without rushing. Avoid a heavy meal in the two hours before, and wear loose, comfortable clothing — you'll remain clothed throughout the session, only removing socks and shoes.",
  },
  {
    q: "Is reflexology painful?",
    a: "It shouldn't be. You may feel tender spots — what practitioners call 'crystalline deposits' — and we'll work those areas slowly, never forcing past your edge. Most people describe the sensation as a deep, satisfying release. If anything ever feels sharp or excessive, tell your practitioner immediately and we'll adjust.",
  },
  {
    q: "How often should I come?",
    a: "For general wellbeing, once every three to four weeks is a sweet spot. If you're working through something specific — chronic tension, sleep issues, recovery from injury — we may recommend a short series of weekly sessions, then taper to monthly maintenance. There's no script; we'll talk with you about it after your first visit.",
  },
  {
    q: "Is reflexology safe during pregnancy?",
    a: "Yes, with care, in the second and third trimester. We use side-lying positioning, gentler pressure, and avoid certain reflex zones entirely. We do not treat the first trimester. Always check with your midwife or OB first — we're happy to coordinate with them.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Sessions can be rescheduled up to 24 hours before your appointment at no charge. Within 24 hours we charge 50% of the session fee; same-day cancellations and no-shows are charged in full. We hold this gently — if you're unwell or something serious comes up, just call us and we'll work it out.",
  },
  {
    q: "Do you offer gift cards?",
    a: "We do — digital gift cards in any denomination, redeemable for any service. They're sent by email within an hour of purchase. Reach out through the contact form below and we'll set it up.",
  },
];

export const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#booking", label: "Booking" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Visit" },
];

export const CONTACT_ICONS = {
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Clock3,
};

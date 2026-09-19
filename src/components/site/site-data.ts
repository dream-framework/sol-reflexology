import type { LucideIcon } from "lucide-react";
import {
  Footprints,
  Hand,
  Sparkles,
  Flower2,
  Moon,
  Leaf,
  Clock,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Clock3,
} from "lucide-react";

/* ============================================================
   Site content — all copy lives here so it's trivial to swap.
   ============================================================ */

export const STUDIO = {
  name: "Sōl",
  full: "Sōl Reflexology",
  tagline: "Reflexology & Holistic Bodywork",
  phoneDisplay: "+1 (416) 555-0192",
  phoneHref: "tel:+14165550192",
  email: "hello@solreflexology.com",
  address: "218 Elm Avenue, Suite 4",
  city: "Toronto, ON  M4X 1G3",
  hoursShort: "Tue – Sat · 10 to 8",
  instagram: "@sol.reflexology",
  instagramHref: "https://instagram.com",
};

export type Service = {
  id: string;
  name: string;
  duration: string;       // "60 min"
  priceFrom: number;      // CAD
  blurb: string;
  icon: LucideIcon;
  highlights: string[];
};

export const SERVICES: Service[] = [
  {
    id: "signature-foot",
    name: "Signature Foot Reflexology",
    duration: "60 min",
    priceFrom: 140,
    blurb:
      "Our foundational practice. A slow, deeply intentional sequence working the foot's full reflex map to calm the nervous system and restore circulation.",
    icon: Footprints,
    highlights: ["Full reflex map", "Warm stone finish", "Aromatherapy"],
  },
  {
    id: "hand-arm",
    name: "Hand & Arm Renewal",
    duration: "45 min",
    priceFrom: 110,
    blurb:
      "Targeted relief for keyboard-tired hands. Releases tension through the wrists, forearms, and shoulder girdle using pressure point and lymphatic technique.",
    icon: Hand,
    highlights: ["Repetitive strain relief", "Lymphatic drainage", "Wrist mobility"],
  },
  {
    id: "facial-reflex",
    name: "Facial Reflexology",
    duration: "50 min",
    priceFrom: 130,
    blurb:
      "A meditative sequence across the face, scalp, and ears. Releases the cranial base and visibly softens tension held in the jaw and brow.",
    icon: Sparkles,
    highlights: ["Vagus nerve tone", "Jaw release", "Scalp & ears"],
  },
  {
    id: "prenatal",
    name: "Prenatal Sole Care",
    duration: "60 min",
    priceFrom: 150,
    blurb:
      "Gentle, side-lying reflexology designed for the second and third trimester. Eases swelling, lower back ache, and the quiet fatigue of carrying.",
    icon: Flower2,
    highlights: ["2nd & 3rd trimester", "Side-lying position", "Edema relief"],
  },
  {
    id: "restorative-night",
    name: "Restorative Night Ritual",
    duration: "90 min",
    priceFrom: 220,
    blurb:
      "An extended session for those who have stopped sleeping well. Begins with a grounding foot bath, closes with a warm stone and lavender finish.",
    icon: Moon,
    highlights: ["Foot bath opening", "Warm stones", "Lavender close"],
  },
  {
    id: "seasonal",
    name: "Seasonal Grounding",
    duration: "75 min",
    priceFrom: 185,
    blurb:
      "A practice that shifts with the calendar — cooling botanicals in summer, warming roots in winter. Always centered on what the body is asking for now.",
    icon: Leaf,
    highlights: ["Seasonal botanicals", "Adaptive pressure", "Constitution-based"],
  },
];

export type Practitioner = {
  id: string;
  name: string;
  role: string;
};

export const PRACTITIONERS: Practitioner[] = [
  { id: "any", name: "First available", role: "Match me with the next open practitioner" },
  { id: "mira", name: "Mira Okafor", role: "Founder · 14 yrs · Foot & Facial" },
  { id: "tomas", name: "Tomas Hwang", role: "Senior · 9 yrs · Hand & Sports" },
  { id: "priya", name: "Priya Lindqvist", role: "Practitioner · 6 yrs · Prenatal" },
];

export const TIME_SLOTS = [
  "10:00", "11:15", "13:30", "14:45",
  "16:00", "17:15", "18:30", "19:45",
];

export const STATS: { value: string; label: string; sub: string }[] = [
  { value: "14", label: "Years in practice", sub: "Founded 2012" },
  { value: "22k+", label: "Sessions given", sub: "And counting" },
  { value: "4.9", label: "Average rating", sub: "Across 1,200+ reviews" },
  { value: "3", label: "Practitioners", sub: "Small, intentional team" },
];

export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Do I need to prepare anything before my session?",
    a: "Arrive ten minutes early so we can settle you in without rushing. Avoid a heavy meal in the two hours before, and wear loose, comfortable clothing — you'll remain clothed throughout the session, only removing socks and shoes. If you're coming from work, we have a quiet changing area and a place to store your things.",
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
    a: "Yes, with care, in the second and third trimester. Our prenatal practitioner Priya is trained in maternal reflexology and uses side-lying positioning, gentler pressure, and avoids certain reflex zones entirely. We do not treat the first trimester. Always check with your midwife or OB first — we're happy to coordinate with them.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Sessions can be rescheduled up to 24 hours before your appointment at no charge. Within 24 hours we charge 50% of the session fee; same-day cancellations and no-shows are charged in full. We hold this gently — if you're unwell or something serious comes up, just call us and we'll work it out.",
  },
  {
    q: "Do you offer gift cards?",
    a: "We do — digital gift cards in any denomination, redeemable for any service or membership. They're sent by email within an hour of purchase. Reach out through the contact form below and we'll set it up.",
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

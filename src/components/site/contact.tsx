"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Instagram, Send } from "lucide-react";
import { STUDIO } from "./site-data";
import { Reveal } from "./reveal";
import { toast } from "sonner";

const HOURS = [
  { day: "Monday", hours: "Closed" },
  { day: "Tuesday", hours: "10:00 — 20:00" },
  { day: "Wednesday", hours: "10:00 — 20:00" },
  { day: "Thursday", hours: "10:00 — 20:00" },
  { day: "Friday", hours: "10:00 — 20:00" },
  { day: "Saturday", hours: "10:00 — 18:00" },
  { day: "Sunday", hours: "Closed" },
];

export function Contact() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setName(""); setEmail(""); setMessage("");
    toast.success("Message sent", {
      description: "We'll be in touch within 24 hours.",
    });
  };

  return (
    <section id="contact" className="relative py-28 sm:py-40 scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ink to-forest-deep" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
          {/* Left — info */}
          <Reveal>
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-10 bg-gold/60" />
              <span className="text-xs tracking-luxe uppercase text-gold/90">Visit the studio</span>
            </div>
            <h2 className="font-serif font-light text-cream text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.01em] mb-8">
              A quiet room on
              <br />
              <span className="italic text-gradient-gold">Elm Avenue.</span>
            </h2>
            <p className="text-cream/65 text-base leading-relaxed font-light mb-10 max-w-md">
              Tucked into a heritage row house in Cabbagetown. Ring the bell
              marked <span className="text-gold/90">Sōl</span> and head up the
              narrow staircase to suite 4 — there's a place to leave your shoes
              at the top.
            </p>

            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <InfoBlock icon={MapPin} label="Address">
                <p className="text-cream/75 leading-relaxed">{STUDIO.address}</p>
                <p className="text-cream/75 leading-relaxed">{STUDIO.city}</p>
              </InfoBlock>
              <InfoBlock icon={Phone} label="Phone">
                <a href={STUDIO.phoneHref} className="text-cream/75 hover:text-gold transition-colors">
                  {STUDIO.phoneDisplay}
                </a>
              </InfoBlock>
              <InfoBlock icon={Mail} label="Email">
                <a href={`mailto:${STUDIO.email}`} className="text-cream/75 hover:text-gold transition-colors break-all">
                  {STUDIO.email}
                </a>
              </InfoBlock>
              <InfoBlock icon={Instagram} label="Instagram">
                <a
                  href={STUDIO.instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cream/75 hover:text-gold transition-colors"
                >
                  {STUDIO.instagram}
                </a>
              </InfoBlock>
            </div>

            {/* Hours */}
            <InfoBlock icon={Clock} label="Hours">
              <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5 mt-1">
                {HOURS.map((h) => (
                  <li key={h.day} className="flex justify-between text-sm">
                    <span className="text-cream/55">{h.day.slice(0, 3)}</span>
                    <span className={h.hours === "Closed" ? "text-cream/35" : "text-cream/80"}>
                      {h.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </InfoBlock>
          </Reveal>

          {/* Right — form + map */}
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-8 h-full">
              {/* Map */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-cream/10 shadow-luxe">
                <iframe
                  title="Sōl Reflexology location map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-79.375%2C43.665%2C-79.355%2C43.678&layer=mapnik&marker=43.6715,-79.3650"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, filter: "saturate(0.7) brightness(0.85) hue-rotate(20deg)" }}
                  loading="lazy"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink/40 to-transparent" />
                <div className="absolute bottom-4 left-4 glass-gold rounded-full px-4 py-2 flex items-center gap-2 text-xs text-cream/85">
                  <MapPin className="size-3.5 text-gold" />
                  Cabbagetown · Toronto
                </div>
              </div>

              {/* Quick message form */}
              <form
                onSubmit={submit}
                className="flex-1 glass rounded-2xl p-6 sm:p-8 flex flex-col"
              >
                <h3 className="font-serif text-xl text-cream mb-4">Send a quick note</h3>
                <div className="space-y-4 flex-1 flex flex-col">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-lg bg-cream/[0.03] border border-cream/15 text-cream placeholder:text-cream/35 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 outline-none transition"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 px-4 rounded-lg bg-cream/[0.03] border border-cream/15 text-cream placeholder:text-cream/35 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 outline-none transition"
                  />
                  <textarea
                    placeholder="Your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full flex-1 min-h-[100px] px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/15 text-cream placeholder:text-cream/35 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 outline-none transition resize-none"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="self-start inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm tracking-wide-luxe uppercase bg-gradient-to-r from-gold to-gold-soft text-ink font-medium hover:-translate-y-0.5 transition-transform disabled:opacity-50"
                  >
                    {sending ? "Sending..." : "Send"}
                    {!sending && <Send className="size-3.5" />}
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoBlock({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 text-gold/80">
        <Icon className="size-4" />
        <span className="text-[10px] tracking-luxe uppercase">{label}</span>
      </div>
      <div className="text-sm font-light">{children}</div>
    </div>
  );
}

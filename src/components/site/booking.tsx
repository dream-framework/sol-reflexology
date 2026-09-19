"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SERVICES, PRACTITIONERS, TIME_SLOTS, type Service } from "./site-data";
import { Reveal } from "./reveal";
import { asset } from "@/lib/asset";
import { toast } from "sonner";

type BookingState = {
  serviceId: string;
  practitionerId: string;
  date: string;       // ISO date
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const STEPS = [
  { id: "service", label: "Service", icon: Sparkles },
  { id: "practitioner", label: "Practitioner", icon: User },
  { id: "datetime", label: "Date & time", icon: CalendarIcon },
  { id: "details", label: "Your details", icon: User },
  { id: "review", label: "Review", icon: Check },
] as const;

const todayPlus = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const formatDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const formatPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export function Booking() {
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [state, setState] = React.useState<BookingState>({
    serviceId: "",
    practitionerId: "",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const set = <K extends keyof BookingState>(key: K, value: BookingState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const canAdvance = (() => {
    switch (STEPS[step].id) {
      case "service": return !!state.serviceId;
      case "practitioner": return !!state.practitionerId;
      case "datetime": return !!state.date && !!state.time;
      case "details": return !!state.name && /\S+@\S+\.\S+/.test(state.email) && state.phone.replace(/\D/g, "").length === 10;
      case "review": return true;
      default: return false;
    }
  })();

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Request received", {
      description: `We'll confirm by email within a few hours.`,
    });
  };

  const selectedService = SERVICES.find((s) => s.id === state.serviceId);
  const selectedPractitioner = PRACTITIONERS.find((p) => p.id === state.practitionerId);

  return (
    <section
      id="booking"
      className="relative py-28 sm:py-40 scroll-mt-24 overflow-hidden"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-forest-deep to-ink" />
        <img
          src={asset("/images/booking-bg.png")}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-10 bg-gold/60" />
              <span className="text-xs tracking-luxe uppercase text-gold/90">Book a session</span>
              <span className="h-px w-10 bg-gold/60" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif font-light text-cream text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.01em] mb-6">
              Choose your time,
              <br />
              <span className="italic text-gradient-gold">we'll hold the room.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-cream/65 text-base leading-relaxed font-light">
              Booking requests are reviewed personally by our team. You'll
              receive a confirmation email within a few hours — never an
              automated calendar hold.
            </p>
          </Reveal>
        </div>

        {/* Card */}
        <Reveal delay={0.3}>
          <div className="relative glass rounded-3xl border-cream/10 shadow-luxe-lg overflow-hidden">
            {/* Step indicator */}
            <div className="border-b border-cream/8 px-6 sm:px-10 py-6 bg-cream/[0.02]">
              <div className="flex items-center justify-between gap-2 overflow-x-auto scroll-elegant">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const isDone = i < step;
                  const isActive = i === step;
                  return (
                    <React.Fragment key={s.id}>
                      <button
                        type="button"
                        onClick={() => i < step && setStep(i)}
                        disabled={i > step}
                        className={cn(
                          "flex items-center gap-3 shrink-0 transition-colors",
                          i > step && "cursor-not-allowed opacity-35",
                          isActive && "text-gold",
                          isDone && "text-cream/70 hover:text-gold",
                          !isActive && !isDone && i <= step && "text-cream/55"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex size-9 items-center justify-center rounded-full border transition-all",
                            isActive && "border-gold/60 bg-gold/15 text-gold",
                            isDone && "border-gold/40 bg-gold/20 text-gold",
                            !isActive && !isDone && "border-cream/15 text-cream/50"
                          )}
                        >
                          {isDone ? <Check className="size-4" /> : <Icon className="size-4" />}
                        </span>
                        <span className="hidden sm:inline text-xs tracking-wide-luxe uppercase">
                          {s.label}
                        </span>
                      </button>
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 h-px min-w-[20px] bg-cream/10 relative overflow-hidden">
                          <motion.div
                            initial={false}
                            animate={{ scaleX: i < step ? 1 : 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 origin-left bg-gold/50"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Step body */}
            <div className="px-6 sm:px-10 py-10 min-h-[420px]">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <SuccessView key="success" service={selectedService} date={state.date} time={state.time} />
                ) : (
                  <motion.div
                    key={STEPS[step].id}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {step === 0 && (
                      <ServiceStep
                        selected={state.serviceId}
                        onSelect={(id) => set("serviceId", id)}
                      />
                    )}
                    {step === 1 && (
                      <PractitionerStep
                        selected={state.practitionerId}
                        onSelect={(id) => set("practitionerId", id)}
                      />
                    )}
                    {step === 2 && (
                      <DateTimeStep
                        date={state.date}
                        time={state.time}
                        onDateChange={(d) => set("date", d)}
                        onTimeChange={(t) => set("time", t)}
                      />
                    )}
                    {step === 3 && (
                      <DetailsStep
                        state={state}
                        onChange={set}
                      />
                    )}
                    {step === 4 && (
                      <ReviewStep state={state} />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer nav */}
            {!submitted && (
              <div className="border-t border-cream/8 px-6 sm:px-10 py-6 flex items-center justify-between gap-4 bg-cream/[0.02]">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={back}
                  disabled={step === 0 || submitting}
                  className="text-cream/70 hover:text-cream hover:bg-cream/5"
                >
                  <ChevronLeft className="size-4" />
                  Back
                </Button>
                <div className="text-xs tracking-wide-luxe uppercase text-cream/40 hidden sm:block">
                  Step {step + 1} of {STEPS.length}
                </div>
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={next}
                    disabled={!canAdvance}
                    className="bg-gradient-to-r from-gold to-gold-soft text-ink hover:opacity-90 rounded-full px-6"
                  >
                    Continue
                    <ChevronRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={submit}
                    disabled={!canAdvance || submitting}
                    className="bg-gradient-to-r from-gold to-gold-soft text-ink hover:opacity-90 rounded-full px-6"
                  >
                    {submitting ? "Sending..." : "Request booking"}
                    {!submitting && <Check className="size-4" />}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Step components ---------------- */

function StepShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-8">
        <h3 className="font-serif text-2xl sm:text-3xl text-cream mb-2">{title}</h3>
        <p className="text-cream/55 text-sm font-light">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ServiceStep({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <StepShell title="Choose your session" subtitle="Each session is grounded in the same slow, intentional approach.">
      <div className="grid sm:grid-cols-2 gap-3">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={cn(
                "group relative text-left p-5 rounded-xl border transition-all duration-300 overflow-hidden",
                isSelected
                  ? "border-gold/60 bg-gold/10"
                  : "border-cream/10 bg-cream/[0.02] hover:border-cream/25 hover:bg-cream/[0.04]"
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full border shrink-0 transition-colors",
                    isSelected ? "border-gold/50 text-gold bg-gold/15" : "border-cream/15 text-cream/60"
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h4 className="font-serif text-lg text-cream truncate">{s.name}</h4>
                    <span className="text-xs text-cream/55 shrink-0">{s.duration}</span>
                  </div>
                  <p className="text-cream/50 text-xs leading-relaxed line-clamp-2 mb-3">{s.blurb}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gold/90">From ${s.priceFrom}</span>
                    {isSelected && (
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-gold text-ink">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function PractitionerStep({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <StepShell title="Choose your practitioner" subtitle="All of our team are fully certified. Select someone specific, or let us match you.">
      <div className="space-y-3">
        {PRACTITIONERS.map((p) => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={cn(
                "group w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4",
                isSelected
                  ? "border-gold/60 bg-gold/10"
                  : "border-cream/10 bg-cream/[0.02] hover:border-cream/25 hover:bg-cream/[0.04]"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-12 items-center justify-center rounded-full border font-serif text-lg shrink-0 transition-colors",
                  isSelected ? "border-gold/50 text-gold bg-gold/15" : "border-cream/15 text-cream/70"
                )}
              >
                {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <div className="flex-1">
                <h4 className="font-serif text-lg text-cream">{p.name}</h4>
                <p className="text-cream/55 text-xs">{p.role}</p>
              </div>
              {isSelected && (
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-gold text-ink">
                  <Check className="size-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function DateTimeStep({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string;
  time: string;
  onDateChange: (d: string) => void;
  onTimeChange: (t: string) => void;
}) {
  // Generate next 14 days, skip Sundays & Mondays (studio closed)
  const days = React.useMemo(() => {
    const out: { iso: string; weekday: string; day: string; month: string; full: string }[] = [];
    for (let i = 1; i < 21 && out.length < 12; i++) {
      const d = todayPlus(i);
      const dow = d.getDay();
      if (dow === 0 || dow === 1) continue; // skip Sun/Mon
      out.push({
        iso: d.toISOString().slice(0, 10),
        weekday: d.toLocaleDateString("en-CA", { weekday: "short" }),
        day: d.getDate().toString(),
        month: d.toLocaleDateString("en-CA", { month: "short" }),
        full: d.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric" }),
      });
    }
    return out;
  }, []);

  return (
    <StepShell title="Pick a date and time" subtitle="Studio hours: Tuesday – Saturday, 10am to 8pm. Times shown are in Eastern Time.">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="size-4 text-gold/80" />
            <span className="text-xs tracking-luxe uppercase text-cream/60">Available dates</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scroll-elegant -mx-1 px-1">
            {days.map((d) => {
              const isSelected = date === d.iso;
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => onDateChange(d.iso)}
                  className={cn(
                    "shrink-0 w-20 py-3 px-2 rounded-xl border text-center transition-all",
                    isSelected
                      ? "border-gold/60 bg-gold/15 text-gold"
                      : "border-cream/12 bg-cream/[0.02] text-cream/80 hover:border-cream/30"
                  )}
                >
                  <div className="text-[10px] tracking-wide-luxe uppercase opacity-70">{d.weekday}</div>
                  <div className="font-serif text-2xl my-0.5">{d.day}</div>
                  <div className="text-[10px] tracking-wide-luxe uppercase opacity-70">{d.month}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="size-4 text-gold/80" />
            <span className="text-xs tracking-luxe uppercase text-cream/60">Available times</span>
          </div>
          {!date ? (
            <p className="text-cream/45 text-sm italic">Select a date first to see available times.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((t) => {
                const isSelected = time === t;
                // Pretend some slots are taken based on date hash for realism
                const dateHash = date.split("-").reduce((a, b) => a + parseInt(b), 0);
                const isTaken = (parseInt(t.replace(":", "")) + dateHash) % 5 === 0;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={isTaken}
                    onClick={() => onTimeChange(t)}
                    className={cn(
                      "py-3 rounded-lg border text-sm transition-all",
                      isTaken && "opacity-30 line-through cursor-not-allowed border-cream/8 text-cream/40",
                      !isTaken && isSelected && "border-gold/60 bg-gold/15 text-gold",
                      !isTaken && !isSelected && "border-cream/12 bg-cream/[0.02] text-cream/80 hover:border-cream/30"
                    )}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StepShell>
  );
}

function DetailsStep({
  state,
  onChange,
}: {
  state: BookingState;
  onChange: <K extends keyof BookingState>(key: K, value: BookingState[K]) => void;
}) {
  return (
    <StepShell title="Your details" subtitle="We'll use these to confirm your session and reach out if anything needs adjusting.">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" required>
          <Input
            value={state.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Avery Chen"
            className="bg-cream/[0.03] border-cream/15 text-cream placeholder:text-cream/35 focus-visible:border-gold/50 focus-visible:ring-gold/20 h-11"
          />
        </Field>
        <Field label="Email" required>
          <Input
            type="email"
            value={state.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="avery@example.com"
            className="bg-cream/[0.03] border-cream/15 text-cream placeholder:text-cream/35 focus-visible:border-gold/50 focus-visible:ring-gold/20 h-11"
          />
        </Field>
        <Field label="Phone" required>
          <Input
            type="tel"
            value={state.phone}
            onChange={(e) => onChange("phone", formatPhone(e.target.value))}
            placeholder="(416) 555-0192"
            className="bg-cream/[0.03] border-cream/15 text-cream placeholder:text-cream/35 focus-visible:border-gold/50 focus-visible:ring-gold/20 h-11"
          />
        </Field>
        <Field label="How did you hear about us?">
          <Input
            onChange={() => {}}
            placeholder="Friend, doctor, walk-by..."
            className="bg-cream/[0.03] border-cream/15 text-cream placeholder:text-cream/35 focus-visible:border-gold/50 focus-visible:ring-gold/20 h-11"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Anything we should know?">
            <Textarea
              value={state.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              placeholder="Areas of tension, sensitivities, recent injuries, or simply what you're hoping to feel after..."
              rows={4}
              className="bg-cream/[0.03] border-cream/15 text-cream placeholder:text-cream/35 focus-visible:border-gold/50 focus-visible:ring-gold/20 resize-none"
            />
          </Field>
        </div>
      </div>
    </StepShell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs tracking-wide-luxe uppercase text-cream/60 mb-2">
        {label}{required && <span className="text-gold/80 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function ReviewStep({ state }: { state: BookingState }) {
  const service = SERVICES.find((s) => s.id === state.serviceId);
  const practitioner = PRACTITIONERS.find((p) => p.id === state.practitionerId);

  const rows = [
    { label: "Session", value: service?.name },
    { label: "Duration", value: service?.duration },
    { label: "Practitioner", value: practitioner?.name },
    { label: "Date", value: formatDate(state.date) },
    { label: "Time", value: state.time },
    { label: "Name", value: state.name },
    { label: "Email", value: state.email },
    { label: "Phone", value: state.phone },
  ];

  return (
    <StepShell title="Review and request" subtitle="Take one last look. You can adjust any step using the Back button below.">
      <div className="rounded-2xl border border-cream/10 overflow-hidden divide-y divide-cream/8">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-4 px-5 py-4 bg-cream/[0.02]">
            <span className="text-xs tracking-wide-luxe uppercase text-cream/50">{r.label}</span>
            <span className="font-serif text-cream text-right">{r.value || "—"}</span>
          </div>
        ))}
      </div>
      {state.notes && (
        <div className="mt-4 px-5 py-4 rounded-xl bg-cream/[0.02] border border-cream/10">
          <div className="text-xs tracking-wide-luxe uppercase text-cream/50 mb-2">Notes</div>
          <p className="text-cream/80 text-sm leading-relaxed font-light">{state.notes}</p>
        </div>
      )}
      <p className="mt-6 text-xs text-cream/45 leading-relaxed font-light">
        Submitting this form sends a booking <em>request</em>. We'll confirm
        your appointment by email within a few hours. No payment is taken now —
        you'll pay at the studio after your session.
      </p>
    </StepShell>
  );
}

function SuccessView({ service, date, time }: { service?: Service; date: string; time: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-10"
    >
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-soft text-ink mx-auto mb-6 shadow-luxe-lg"
      >
        <Check className="size-9" strokeWidth={2.5} />
      </motion.div>
      <h3 className="font-serif text-3xl sm:text-4xl text-cream mb-3">Request received</h3>
      <p className="text-cream/65 text-base font-light max-w-md mx-auto mb-8">
        We've sent a confirmation email. Our team will personally review your
        request and reply within a few hours to lock in your appointment.
      </p>
      <div className="inline-flex flex-col items-center gap-1 px-6 py-4 rounded-xl border border-gold/25 bg-gold/[0.05]">
        <div className="text-xs tracking-luxe uppercase text-cream/50">Your request</div>
        <div className="font-serif text-xl text-cream">
          {service?.name} · {formatDate(date)} · {time}
        </div>
      </div>
      <div className="mt-8">
        <a
          href="#top"
          className="text-xs tracking-luxe uppercase text-gold/80 hover:text-gold transition-colors"
        >
          Return to top
        </a>
      </div>
    </motion.div>
  );
}

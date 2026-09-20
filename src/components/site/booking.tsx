"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Sparkles,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SERVICES, type Service } from "./site-data";
import {
  generateSlots,
  getMonthGrid,
  isDateBookable,
  formatLongDate,
  toISODate,
  fromISODate,
  toLabel,
  type Slot,
} from "./booking-utils";
import { Reveal } from "./reveal";
import { toast } from "sonner";

type BookingState = {
  serviceId: string;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // "HH:mm"
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const STEPS = [
  { id: "service", label: "Service", icon: Sparkles },
  { id: "datetime", label: "Date & time", icon: CalendarIcon },
  { id: "details", label: "Your details", icon: User },
  { id: "review", label: "Review", icon: Check },
] as const;

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
      case "service":
        return !!state.serviceId;
      case "datetime":
        return !!state.date && !!state.time;
      case "details":
        return (
          !!state.name &&
          /\S+@\S+\.\S+/.test(state.email) &&
          state.phone.replace(/\D/g, "").length === 10
        );
      case "review":
        return true;
      default:
        return false;
    }
  })();

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
    toast.success("Request received", {
      description: "We'll confirm by email within a few hours.",
    });
  };

  const selectedService = SERVICES.find((s) => s.id === state.serviceId);

  return (
    <section
      id="booking"
      className="relative py-28 sm:py-40 scroll-mt-24 overflow-hidden bg-sage-section"
    >
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Reveal>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-10 bg-gold/60" />
              <span className="text-xs tracking-luxe uppercase text-gold">Book a session</span>
              <span className="h-px w-10 bg-gold/60" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif font-light text-forest text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.01em] mb-6">
              Choose your time,
              <br />
              <span className="italic text-gradient-gold">we'll hold the room.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-forest-soft text-base leading-relaxed font-light">
              Booking requests are reviewed personally. You'll receive a
              confirmation email within a few hours — never an automated
              calendar hold.
            </p>
          </Reveal>
        </div>

        {/* Card */}
        <Reveal delay={0.3}>
          <div className="relative glass rounded-3xl shadow-luxe-lg overflow-hidden">
            {/* Step indicator */}
            <div className="border-b border-forest/8 px-6 sm:px-10 py-6 bg-cream-warm/40">
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
                          isDone && "text-forest-soft hover:text-gold",
                          !isActive && !isDone && i <= step && "text-forest-soft/70"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex size-9 items-center justify-center rounded-full border transition-all",
                            isActive && "border-gold/60 bg-gold/15 text-gold",
                            isDone && "border-gold/40 bg-gold/20 text-gold",
                            !isActive && !isDone && "border-forest/15 text-forest-soft/60"
                          )}
                        >
                          {isDone ? <Check className="size-4" /> : <Icon className="size-4" />}
                        </span>
                        <span className="hidden sm:inline text-xs tracking-wide-luxe uppercase">
                          {s.label}
                        </span>
                      </button>
                      {i < STEPS.length - 1 && (
                        <div className="flex-1 h-px min-w-[20px] bg-forest/10 relative overflow-hidden">
                          <motion.div
                            initial={false}
                            animate={{ scaleX: i < step ? 1 : 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-0 origin-left bg-gold/60"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Step body */}
            <div className="px-6 sm:px-10 py-10 min-h-[440px]">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <SuccessView
                    key="success"
                    service={selectedService}
                    date={state.date}
                    time={state.time}
                  />
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
                      <DateTimeStep
                        date={state.date}
                        time={state.time}
                        onDateChange={(d) => set("date", d)}
                        onTimeChange={(t) => set("time", t)}
                      />
                    )}
                    {step === 2 && <DetailsStep state={state} onChange={set} />}
                    {step === 3 && <ReviewStep state={state} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer nav */}
            {!submitted && (
              <div className="border-t border-forest/8 px-6 sm:px-10 py-6 flex items-center justify-between gap-4 bg-cream-warm/40">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={back}
                  disabled={step === 0 || submitting}
                  className="text-forest-soft hover:text-forest hover:bg-forest/5"
                >
                  <ChevronLeft className="size-4" />
                  Back
                </Button>
                <div className="text-xs tracking-wide-luxe uppercase text-forest-soft/55 hidden sm:block">
                  Step {step + 1} of {STEPS.length}
                </div>
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={next}
                    disabled={!canAdvance}
                    className="bg-forest text-cream hover:bg-forest/90 rounded-full px-6"
                  >
                    Continue
                    <ChevronRight className="size-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={submit}
                    disabled={!canAdvance || submitting}
                    className="bg-forest text-cream hover:bg-forest/90 rounded-full px-6"
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

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8">
        <h3 className="font-serif text-2xl sm:text-3xl text-forest mb-2">{title}</h3>
        <p className="text-forest-soft text-sm font-light">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ServiceStep({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <StepShell
      title="Choose your session"
      subtitle="Each session is grounded in the same slow, intentional approach."
    >
      <div className="grid sm:grid-cols-3 gap-3">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={cn(
                "group relative text-left p-6 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col",
                isSelected
                  ? "border-gold/60 bg-gold/8 shadow-soft"
                  : "border-forest/10 bg-white/50 hover:border-forest/25 hover:bg-white"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full border shrink-0 transition-colors mb-5",
                  isSelected
                    ? "border-gold/50 text-gold bg-gold/12"
                    : "border-forest/15 text-forest-soft"
                )}
              >
                <Icon className="size-5" strokeWidth={1.5} />
              </span>

              <h4 className="font-serif text-xl text-forest mb-2 leading-tight">{s.name}</h4>
              <p className="text-forest-soft text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                {s.blurb}
              </p>

              <ul className="flex flex-wrap gap-1.5 mb-5">
                {s.highlights.map((h) => (
                  <li
                    key={h}
                    className="text-[10px] tracking-wide-luxe uppercase px-2 py-0.5 rounded-full border border-forest/10 text-forest-soft/80"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline justify-between pt-4 border-t border-forest/8">
                <div>
                  <div className="text-[10px] tracking-luxe uppercase text-forest-soft/60 mb-0.5">
                    From
                  </div>
                  <div className="font-serif text-xl text-forest">
                    ${s.priceFrom}
                    <span className="text-[10px] text-forest-soft/60 ml-1 font-sans tracking-wide">
                      CAD
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] tracking-luxe uppercase text-forest-soft/60 mb-0.5">
                    Duration
                  </div>
                  <div className="text-xs text-forest-soft font-light">{s.duration} min</div>
                </div>
              </div>

              {isSelected && (
                <span className="absolute top-4 right-4 inline-flex size-5 items-center justify-center rounded-full bg-gold text-white">
                  <Check className="size-3" />
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
  const today = React.useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());

  const monthGrid = React.useMemo(
    () => getMonthGrid(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const slots: Slot[] = React.useMemo(() => {
    if (!date) return [];
    return generateSlots(fromISODate(date));
  }, [date]);

  // Pretend some slots are taken based on date hash — for realism without a backend.
  const takenSet = React.useMemo(() => {
    if (!date) return new Set<string>();
    const seed = date.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
    const taken = new Set<string>();
    slots.forEach((s, i) => {
      if ((i + seed) % 4 === 0) taken.add(s.time);
    });
    return taken;
  }, [date, slots]);

  const goPrevMonth = () => {
    const d = new Date(viewYear, viewMonth - 1, 1);
    // Don't allow going before the current month
    if (d.getFullYear() < today.getFullYear() ||
        (d.getFullYear() === today.getFullYear() && d.getMonth() < today.getMonth())) {
      return;
    }
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };
  const goNextMonth = () => {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });

  const isSameMonth = (d: Date | null) =>
    d !== null && d.getMonth() === viewMonth && d.getFullYear() === viewYear;
  const isToday = (d: Date | null) => {
    if (!d) return false;
    return toISODate(d) === toISODate(today);
  };
  const isSelected = (d: Date | null) => {
    if (!d || !date) return false;
    return toISODate(d) === date;
  };

  return (
    <StepShell
      title="Pick a date and time"
      subtitle="Studio hours: Mon–Fri 9–6, Sat 10–2. Closed Sundays."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="rounded-2xl border border-forest/10 bg-white/60 p-5">
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={goPrevMonth}
              className="size-9 inline-flex items-center justify-center rounded-full border border-forest/12 text-forest-soft hover:border-forest/30 hover:text-forest transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={
                viewYear === today.getFullYear() && viewMonth === today.getMonth()
              }
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <div className="font-serif text-xl text-forest">{monthLabel}</div>
            <button
              type="button"
              onClick={goNextMonth}
              className="size-9 inline-flex items-center justify-center rounded-full border border-forest/12 text-forest-soft hover:border-forest/30 hover:text-forest transition-colors"
              aria-label="Next month"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div
                key={d}
                className="text-center text-[10px] tracking-wide-luxe uppercase text-forest-soft/55 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((d, i) => {
              if (!d) return <div key={i} className="aspect-square" />;
              const bookable = isDateBookable(d);
              const inMonth = isSameMonth(d);
              const selected = isSelected(d);
              const isCurrentDay = isToday(d);

              return (
                <button
                  key={i}
                  type="button"
                  disabled={!bookable || !inMonth}
                  onClick={() => {
                    onDateChange(toISODate(d));
                    onTimeChange(""); // reset time when date changes
                  }}
                  className={cn(
                    "aspect-square rounded-lg text-sm transition-all relative",
                    !inMonth && "opacity-25 cursor-default",
                    inMonth && !bookable && "text-forest-soft/30 cursor-not-allowed line-through",
                    inMonth && bookable && !selected && "text-forest hover:bg-gold/12 hover:text-forest",
                    selected && "bg-forest text-cream shadow-soft",
                    isCurrentDay && !selected && "ring-1 ring-gold/40"
                  )}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="rounded-2xl border border-forest/10 bg-white/60 p-5">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-forest/8">
            <Clock className="size-4 text-gold" />
            <span className="text-xs tracking-luxe uppercase text-forest-soft">
              Available times
            </span>
          </div>

          {!date ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <CalendarIcon className="size-8 text-forest-soft/30 mb-3" strokeWidth={1.2} />
              <p className="text-forest-soft text-sm italic font-light">
                Select a date to see available times.
              </p>
            </div>
          ) : slots.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-forest-soft text-sm italic font-light">
                No available times. Try another date.
              </p>
            </div>
          ) : (
            <>
              <div className="text-xs text-forest-soft mb-3">
                {formatLongDate(fromISODate(date))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto scroll-elegant pr-1">
                {slots.map((slot) => {
                  const isTaken = takenSet.has(slot.time);
                  const isSelected = time === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={isTaken}
                      onClick={() => onTimeChange(slot.time)}
                      className={cn(
                        "py-2.5 rounded-lg border text-sm transition-all",
                        isTaken &&
                          "opacity-35 line-through cursor-not-allowed border-forest/8 text-forest-soft/50",
                        !isTaken &&
                          isSelected &&
                          "border-forest bg-forest text-cream shadow-soft",
                        !isTaken &&
                          !isSelected &&
                          "border-forest/12 bg-white text-forest-soft hover:border-forest/30 hover:text-forest"
                      )}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </>
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
    <StepShell
      title="Your details"
      subtitle="We'll use these to confirm your session and reach out if anything needs adjusting."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" required>
          <Input
            value={state.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Your name"
            className="bg-white/60 border-forest/15 text-forest placeholder:text-forest-soft/40 focus-visible:border-gold/50 focus-visible:ring-gold/20 h-11"
          />
        </Field>
        <Field label="Email" required>
          <Input
            type="email"
            value={state.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="you@example.com"
            className="bg-white/60 border-forest/15 text-forest placeholder:text-forest-soft/40 focus-visible:border-gold/50 focus-visible:ring-gold/20 h-11"
          />
        </Field>
        <Field label="Phone" required>
          <Input
            type="tel"
            value={state.phone}
            onChange={(e) => onChange("phone", formatPhone(e.target.value))}
            placeholder="(555) 123-4567"
            className="bg-white/60 border-forest/15 text-forest placeholder:text-forest-soft/40 focus-visible:border-gold/50 focus-visible:ring-gold/20 h-11"
          />
        </Field>
        <Field label="How did you hear about us?">
          <Input
            onChange={() => {}}
            placeholder="Friend, doctor, walk-by..."
            className="bg-white/60 border-forest/15 text-forest placeholder:text-forest-soft/40 focus-visible:border-gold/50 focus-visible:ring-gold/20 h-11"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Anything we should know?">
            <Textarea
              value={state.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              placeholder="Areas of tension, sensitivities, recent injuries, or simply what you're hoping to feel after..."
              rows={4}
              className="bg-white/60 border-forest/15 text-forest placeholder:text-forest-soft/40 focus-visible:border-gold/50 focus-visible:ring-gold/20 resize-none"
            />
          </Field>
        </div>
      </div>
    </StepShell>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs tracking-wide-luxe uppercase text-forest-soft mb-2">
        {label}
        {required && <span className="text-gold ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function ReviewStep({ state }: { state: BookingState }) {
  const service = SERVICES.find((s) => s.id === state.serviceId);
  const dateObj = state.date ? fromISODate(state.date) : null;

  const rows = [
    { label: "Session", value: service?.name },
    { label: "Duration", value: service ? `${service.duration} min` : null },
    { label: "Date", value: dateObj ? formatLongDate(dateObj) : null },
    { label: "Time", value: state.time ? toLabel(state.time) : null },
    { label: "Name", value: state.name },
    { label: "Email", value: state.email },
    { label: "Phone", value: state.phone },
  ];

  return (
    <StepShell
      title="Review and request"
      subtitle="Take one last look. You can adjust any step using the Back button below."
    >
      <div className="rounded-2xl border border-forest/10 overflow-hidden divide-y divide-forest/8">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-baseline justify-between gap-4 px-5 py-4 bg-white/40"
          >
            <span className="text-xs tracking-wide-luxe uppercase text-forest-soft/65">
              {r.label}
            </span>
            <span className="font-serif text-forest text-right">{r.value || "—"}</span>
          </div>
        ))}
      </div>
      {state.notes && (
        <div className="mt-4 px-5 py-4 rounded-xl bg-white/40 border border-forest/10">
          <div className="text-xs tracking-wide-luxe uppercase text-forest-soft/65 mb-2">
            Notes
          </div>
          <p className="text-forest-soft text-sm leading-relaxed font-light">{state.notes}</p>
        </div>
      )}
      <p className="mt-6 text-xs text-forest-soft/65 leading-relaxed font-light">
        Submitting this form sends a booking <em>request</em>. We'll confirm
        your appointment by email within a few hours. No payment is taken now —
        you'll pay at the studio after your session.
      </p>
    </StepShell>
  );
}

function SuccessView({
  service,
  date,
  time,
}: {
  service?: Service;
  date: string;
  time: string;
}) {
  const dateObj = date ? fromISODate(date) : null;
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
        className="inline-flex size-20 items-center justify-center rounded-full bg-forest text-cream mx-auto mb-6 shadow-luxe-lg"
      >
        <Check className="size-9" strokeWidth={2.5} />
      </motion.div>
      <h3 className="font-serif text-3xl sm:text-4xl text-forest mb-3">Request received</h3>
      <p className="text-forest-soft text-base font-light max-w-md mx-auto mb-8">
        We've sent a confirmation email. We'll personally review your request
        and reply within a few hours to lock in your appointment.
      </p>
      <div className="inline-flex flex-col items-center gap-1 px-6 py-4 rounded-xl border border-gold/25 bg-gold/8">
        <div className="text-xs tracking-luxe uppercase text-forest-soft/65">
          Your request
        </div>
        <div className="font-serif text-xl text-forest">
          {service?.name}
          {dateObj && ` · ${formatLongDate(dateObj)}`}
          {time && ` · ${toLabel(time)}`}
        </div>
      </div>
      <div className="mt-8">
        <a
          href="#top"
          className="text-xs tracking-luxe uppercase text-gold hover:text-forest transition-colors"
        >
          Return to top
        </a>
      </div>
    </motion.div>
  );
}

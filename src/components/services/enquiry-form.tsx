"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUDGET_RANGES, PROJECT_TYPES, TIMELINES } from "@/lib/services";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const CONTACT_EMAIL = "support@shrotihost.in";
const CONTACT_WHATSAPP = "https://wa.me/919582129099";

// No `outline-none`: the global :focus-visible ring (globals.css) must show.
const inputCls =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand-purple";

type FieldName = "projectType" | "budget" | "timeline" | "name" | "email" | "phone" | "description";
type FieldErrors = Partial<Record<FieldName, string>>;

/**
 * Project enquiry form — always visible (unlike the careers form's
 * collapsed state) because on a service page the form IS the conversion
 * point, not an optional extra. Same API hardening as careers/apply.
 */
export function EnquiryForm({
  service,
  defaultProjectType,
}: {
  /** Service slug this form was reached from — recorded with the enquiry. */
  service?: string;
  defaultProjectType?: (typeof PROJECT_TYPES)[number];
}) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [topError, setTopError] = useState<string | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const idBase = useId();

  const wa = `${CONTACT_WHATSAPP}?text=${encodeURIComponent("Hi! I'd like to discuss a project.")}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project enquiry")}`;

  // After a 422 the error state has rendered: move focus to the first
  // invalid control so keyboard/screen-reader users land on what to fix.
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
      string,
      string
    >;
    setState("sending");
    setErrors({});
    setTopError(null);
    try {
      const res = await fetch("/api/project-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, service: service ?? "" }),
      });
      const json = await res.json();
      // `{ ok: true, duplicate: true }` (same enquiry re-sent) is still a success.
      if (json.ok) {
        setState("done");
        return;
      }
      setErrors(json.errors ?? {});
      setTopError(
        json.error ?? (json.errors ? "Please fix the highlighted fields." : "Something went wrong."),
      );
      setState("idle");
    } catch {
      setTopError("Network error — please retry, or WhatsApp us instead.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      /* Success settle per micro-interactions.md: brief scale/opacity pulse
         into the success state, instant under reduced motion. */
      <motion.div
        role="status"
        aria-live="polite"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-6"
      >
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
        <div>
          <p className="text-base font-semibold text-text-primary">Enquiry received.</p>
          <p className="mt-1 text-sm text-text-secondary">Thanks — we reply within one business day.</p>
        </div>
      </motion.div>
    );
  }

  const field = (name: FieldName) => ({ name, error: errors[name], idBase });

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      aria-busy={state === "sending"}
      className="grid gap-4 rounded-2xl border border-border bg-card p-6"
    >
      {topError && (
        /* Error shake per micro-interactions.md — short, paired with text. */
        <motion.p
          key={topError}
          role="alert"
          initial={false}
          animate={reducedMotion ? {} : { x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
        >
          {topError}
        </motion.p>
      )}
      {/* Honeypot — hidden from real users, bots fill it. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" {...field("name")}>
          {(c) => (
            <input
              {...c}
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              placeholder="Full name"
              className={inputCls}
            />
          )}
        </Field>
        <Field label="Email" {...field("email")}>
          {(c) => (
            <input
              {...c}
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputCls}
            />
          )}
        </Field>
        <Field label="Phone / WhatsApp (optional)" {...field("phone")}>
          {(c) => <input {...c} type="tel" autoComplete="tel" placeholder="+91 …" className={inputCls} />}
        </Field>
        <Field label="Project type" {...field("projectType")}>
          {(c) => (
            <select {...c} required defaultValue={defaultProjectType ?? ""} className={inputCls}>
              <option value="" disabled>
                What are you building?
              </option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Budget range (optional)" {...field("budget")}>
          {(c) => (
            <select {...c} defaultValue="" className={inputCls}>
              <option value="">Prefer not to say</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Timeline (optional)" {...field("timeline")}>
          {(c) => (
            <select {...c} defaultValue="" className={inputCls}>
              <option value="">Not decided</option>
              {TIMELINES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
      <Field
        label="About the project — what it does, who it's for, anything already built"
        {...field("description")}
      >
        {(c) => (
          <textarea
            {...c}
            required
            minLength={20}
            maxLength={3000}
            rows={5}
            placeholder="A few honest sentences beat a formal brief."
            className={`${inputCls} resize-y`}
          />
        )}
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={state === "sending"}>
          {state === "sending" ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>Send enquiry</>
          )}
        </Button>
        <Button href={wa} variant="secondary" size="md">
          <MessageCircle size={16} aria-hidden="true" />
          WhatsApp instead
        </Button>
        <a
          className="text-sm font-medium text-text-muted underline-offset-2 hover:text-text-primary hover:underline"
          href={mailto}
        >
          or email us
        </a>
      </div>
      <p className="text-xs text-text-muted">
        No spam, no sales sequence — your details go to the team that would build the project.
      </p>
    </form>
  );
}

/** Props every control receives so errors are exposed programmatically. */
type ControlProps = {
  id: string;
  name: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
};

function Field({
  label,
  name,
  error,
  idBase,
  children,
}: {
  label: string;
  name: FieldName;
  error?: string;
  idBase: string;
  children: (control: ControlProps) => ReactNode;
}) {
  const id = `${idBase}-${name}`;
  const errorId = `${id}-error`;
  return (
    /* data-error drives the field-level error border (see globals.css) so
       the input itself changes state, not just the caption below it. */
    <label htmlFor={id} className="block" data-error={error ? "" : undefined}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      {error && (
        <span id={errorId} className="mt-1 block text-xs text-error">
          {error}
        </span>
      )}
    </label>
  );
}

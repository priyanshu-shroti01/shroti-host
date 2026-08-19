"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUDGET_RANGES, PROJECT_TYPES, TIMELINES } from "@/lib/services";

const CONTACT_EMAIL = "support@shrotihost.in";
const CONTACT_WHATSAPP = "https://wa.me/919582129099";

const inputCls =
  "w-full rounded-xl border-2 border-border bg-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand-purple";

type FieldErrors = Partial<
  Record<"projectType" | "budget" | "timeline" | "name" | "email" | "phone" | "description", string>
>;

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

  const wa = `${CONTACT_WHATSAPP}?text=${encodeURIComponent("Hi! I'd like to discuss a project.")}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project enquiry")}`;

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
      <div className="flex items-start gap-3 rounded-2xl border-2 border-success/30 bg-success/10 p-6">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
        <div>
          <p className="text-base font-semibold text-text-primary">Enquiry received.</p>
          <p className="mt-1 text-sm text-text-secondary">
            A real person reads every enquiry and replies within one business day — usually much
            faster on WhatsApp.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border-2 border-border bg-card p-6">
      {topError && (
        <p
          role="alert"
          className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
        >
          {topError}
        </p>
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
        <Field label="Your name" error={errors.name}>
          <input
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Full name"
            className={inputCls}
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputCls}
          />
        </Field>
        <Field label="Phone / WhatsApp (optional)" error={errors.phone}>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+91 …" className={inputCls} />
        </Field>
        <Field label="Project type" error={errors.projectType}>
          <select
            name="projectType"
            required
            defaultValue={defaultProjectType ?? ""}
            className={inputCls}
          >
            <option value="" disabled>
              What are you building?
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget range (optional)" error={errors.budget}>
          <select name="budget" defaultValue="" className={inputCls}>
            <option value="">Prefer not to say</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Timeline (optional)" error={errors.timeline}>
          <select name="timeline" defaultValue="" className={inputCls}>
            <option value="">Not decided</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field
        label="About the project — what it does, who it's for, anything already built"
        error={errors.description}
      >
        <textarea
          name="description"
          required
          minLength={20}
          maxLength={3000}
          rows={5}
          placeholder="A few honest sentences beat a formal brief."
          className={`${inputCls} resize-y`}
        />
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  );
}

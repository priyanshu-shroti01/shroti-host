"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAREERS_EMAIL, CAREERS_WHATSAPP } from "@/lib/careers";

// No `outline-none`: the global :focus-visible ring (globals.css) must show.
const inputCls =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-brand-purple";

type FieldName = "name" | "email" | "phone" | "portfolio" | "resumeUrl" | "note";
type FieldErrors = Partial<Record<FieldName, string>>;

export function ApplySection({ roleSlug, roleTitle }: { roleSlug: string; roleTitle: string }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [topError, setTopError] = useState<string | null>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const idBase = useId();

  const wa = `${CAREERS_WHATSAPP}?text=${encodeURIComponent(`Hi! I'd like to apply for the ${roleTitle} role.`)}`;
  const mailto = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${roleTitle}`)}`;

  // After a 422 the error state has rendered: move focus to the first
  // invalid control so keyboard/screen-reader users land on what to fix.
  useEffect(() => {
    if (Object.keys(errors).length === 0) return;
    fieldsRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [errors]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    setState("sending");
    setErrors({});
    setTopError(null);
    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: roleSlug }),
      });
      const json = await res.json();
      // `{ ok: true, duplicate: true }` (already applied) is still a success.
      if (json.ok) {
        setState("done");
        return;
      }
      setErrors(json.errors ?? {});
      setTopError(json.error ?? (json.errors ? "Please fix the highlighted fields." : "Something went wrong."));
      setState("idle");
    } catch {
      setTopError("Network error — please retry, or email us instead.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4"
      >
        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-text-primary">Application received.</p>
          <p className="mt-0.5 text-sm text-text-secondary">
            We read every application and reply within 48 hours — keep an eye on your inbox.
          </p>
        </div>
      </div>
    );
  }

  const field = (name: FieldName) => ({ name, error: errors[name], idBase });

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => setOpen((v) => !v)} size="md" aria-expanded={open}>
          {open ? "Hide application form" : "Apply now"}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Button>
        <Button href={wa} variant="secondary" size="md">
          <MessageCircle size={16} aria-hidden="true" />
          WhatsApp
        </Button>
        <a className="text-sm font-medium text-text-muted underline-offset-2 hover:text-text-primary hover:underline" href={mailto}>
          or email us
        </a>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            aria-busy={state === "sending"}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div ref={fieldsRef} className="mt-5 grid gap-4 rounded-2xl border border-border bg-surface/40 p-5">
              {topError && (
                <p role="alert" className="rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                  {topError}
                </p>
              )}
              {/* Honeypot — hidden from real users, bots fill it. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" {...field("name")}>
                  {(c) => <input {...c} required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" className={inputCls} />}
                </Field>
                <Field label="Email" {...field("email")}>
                  {(c) => <input {...c} type="email" required autoComplete="email" placeholder="you@example.com" className={inputCls} />}
                </Field>
                <Field label="Phone / WhatsApp" {...field("phone")}>
                  {(c) => <input {...c} type="tel" required autoComplete="tel" placeholder="+91 …" className={inputCls} />}
                </Field>
                <Field label="Portfolio / GitHub / LinkedIn (optional)" {...field("portfolio")}>
                  {(c) => <input {...c} type="url" placeholder="https://…" className={inputCls} />}
                </Field>
              </div>
              <Field label="Resume link (optional — Drive, Dropbox, personal site)" {...field("resumeUrl")}>
                {(c) => <input {...c} type="url" placeholder="https://…" className={inputCls} />}
              </Field>
              <Field label="Why you? A few lines about what you've built or fixed" {...field("note")}>
                {(c) => (
                  <textarea {...c} required minLength={20} maxLength={2000} rows={4} placeholder="Short and concrete beats formal." className={`${inputCls} resize-y`} />
                )}
              </Field>

              <div className="flex items-center gap-3">
                <Button type="submit" size="md" disabled={state === "sending"}>
                  {state === "sending" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…
                    </>
                  ) : (
                    <>Submit application</>
                  )}
                </Button>
                <p className="text-xs text-text-muted">Goes straight to the founders. No portals.</p>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
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
    /* data-error drives the field-level error border (see globals.css). */
    <label htmlFor={id} className="block" data-error={error ? "" : undefined}>
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">{label}</span>
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

"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAREERS_EMAIL, CAREERS_WHATSAPP } from "@/lib/careers";

const inputCls =
  "w-full rounded-xl border-2 border-border bg-bg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand-purple";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "portfolio" | "resumeUrl" | "note", string>>;

export function ApplySection({ roleSlug, roleTitle }: { roleSlug: string; roleTitle: string }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [topError, setTopError] = useState<string | null>(null);

  const wa = `${CAREERS_WHATSAPP}?text=${encodeURIComponent(`Hi! I'd like to apply for the ${roleTitle} role.`)}`;
  const mailto = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Application: ${roleTitle}`)}`;

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
      <div className="mt-6 flex items-start gap-3 rounded-xl border-2 border-success/30 bg-success/10 p-4">
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid gap-4 rounded-2xl border-2 border-border bg-surface/40 p-5">
              {topError && (
                <p role="alert" className="rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
                  {topError}
                </p>
              )}
              {/* Honeypot — hidden from real users, bots fill it. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <input name="name" required minLength={2} maxLength={80} autoComplete="name" placeholder="Your name" className={inputCls} />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputCls} />
                </Field>
                <Field label="Phone / WhatsApp" error={errors.phone}>
                  <input name="phone" type="tel" required autoComplete="tel" placeholder="+91 …" className={inputCls} />
                </Field>
                <Field label="Portfolio / GitHub / LinkedIn (optional)" error={errors.portfolio}>
                  <input name="portfolio" type="url" placeholder="https://…" className={inputCls} />
                </Field>
              </div>
              <Field label="Resume link (optional — Drive, Dropbox, personal site)" error={errors.resumeUrl}>
                <input name="resumeUrl" type="url" placeholder="https://…" className={inputCls} />
              </Field>
              <Field label="Why you? A few lines about what you've built or fixed" error={errors.note}>
                <textarea name="note" required minLength={20} maxLength={2000} rows={4} placeholder="Short and concrete beats formal." className={`${inputCls} resize-y`} />
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-text-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-error">{error}</span>}
    </label>
  );
}

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Lock, LockOpen } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const DEFAULT_DOMAIN = "yourbrand.com";

type Stage = "idle" | "dns" | "server" | "ssl" | "deploy" | "live";

const WAYPOINTS: { stage: Stage; label: string }[] = [
  { stage: "dns", label: "Resolving DNS…" },
  { stage: "server", label: "Connecting to server…" },
  { stage: "ssl", label: "Issuing SSL certificate…" },
  { stage: "deploy", label: "Deploying your site…" },
];

function sanitizeDomain(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9.-]/g, "");
  if (!cleaned) return DEFAULT_DOMAIN;
  return cleaned.includes(".") ? cleaned : `${cleaned}.com`;
}

const PILL_HEIGHT = 64;
const FRAME_HEIGHT = 340;

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const lockOpenRef = useRef<HTMLSpanElement>(null);
  const lockClosedRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const startTimeRef = useRef(0);
  const hasInteractedRef = useRef(false);

  const [domainInput, setDomainInput] = useState("");
  const [liveDomain, setLiveDomain] = useState(DEFAULT_DOMAIN);
  const [stage, setStage] = useState<Stage>("idle");
  const [elapsed, setElapsed] = useState<string | null>(null);

  function play(domain: string) {
    const frame = frameRef.current;
    const line = lineRef.current;
    if (!frame || !line) return;

    timelineRef.current?.kill();
    setLiveDomain(domain);
    setElapsed(null);

    if (prefersReducedMotion) {
      // Skip straight to the resolved end state — including the frame's
      // final size, which otherwise only ever grows via the tween below.
      gsap.set(frame, { height: FRAME_HEIGHT, borderRadius: 24 });
      gsap.set(line, { scaleX: 1 });
      gsap.set(lockOpenRef.current, { opacity: 0 });
      gsap.set(lockClosedRef.current, { opacity: 1 });
      setStage("live");
      return;
    }

    gsap.set(frame, { height: PILL_HEIGHT, borderRadius: 999 });
    gsap.set(line, { scaleX: 0 });
    gsap.set(lockOpenRef.current, { opacity: 1 });
    gsap.set(lockClosedRef.current, { opacity: 0 });

    startTimeRef.current = performance.now();
    const tl = gsap.timeline({
      onComplete: () => {
        setStage("live");
        setElapsed(((performance.now() - startTimeRef.current) / 1000).toFixed(1));
      },
    });
    timelineRef.current = tl;

    WAYPOINTS.forEach((wp, i) => {
      tl.call(() => setStage(wp.stage))
        .to(line, { scaleX: (i + 1) / WAYPOINTS.length, duration: 0.7, ease: "power1.inOut" }, i === 0 ? undefined : "+=0.05");
      if (wp.stage === "ssl") {
        tl.to(lockOpenRef.current, { opacity: 0, duration: 0.25 }, "-=0.3").to(
          lockClosedRef.current,
          { opacity: 1, duration: 0.25 },
          "<"
        );
      }
    });

    tl.to(frame, { height: FRAME_HEIGHT, borderRadius: 24, duration: 0.7, ease: "power3.inOut" }, "+=0.15");
  }

  useEffect(() => {
    // Depends on prefersReducedMotion so that if the hook's own effect
    // resolves it after this one has already scheduled (its default is
    // `false` until the media query is read), the timer is cleared and
    // rescheduled with a `play` closure that sees the real value — a plain
    // `[]` dependency array would freeze `play` to the stale first-render
    // closure and silently ignore reduced-motion.
    const timer = setTimeout(() => {
      if (!hasInteractedRef.current) play(DEFAULT_DOMAIN);
    }, 1400);
    return () => {
      clearTimeout(timer);
      timelineRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    hasInteractedRef.current = true;
    play(sanitizeDomain(domainInput));
    inputRef.current?.blur();
  }

  const idle = stage === "idle";
  const showsHttps = stage === "deploy" || stage === "live";

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-20 sm:py-24">
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-sm text-brand-blue">shrotihost.in</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-6xl">
          Launch a website.
          <br className="hidden sm:block" /> Watch it happen.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-text-secondary">
          Type your domain and press enter — this is the real sequence behind going live.
        </p>
      </div>

      <div className="mt-12 w-full max-w-2xl">
        <div
          ref={frameRef}
          className="relative mx-auto flex w-full flex-col overflow-hidden border border-border-strong bg-card shadow-2xl"
          style={{ height: PILL_HEIGHT }}
        >
          <div className="absolute inset-x-0 top-0 z-10 h-[3px] bg-border">
            <div
              ref={lineRef}
              className="h-full origin-left bg-gradient-to-r from-brand-purple to-brand-blue"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative flex shrink-0 items-center gap-3 px-5 sm:px-6"
            style={{ height: PILL_HEIGHT }}
          >
            <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
              <span ref={lockOpenRef} className="absolute text-text-muted">
                <LockOpen size={18} aria-hidden="true" />
              </span>
              <span ref={lockClosedRef} className="absolute text-success opacity-0">
                <Lock size={18} aria-hidden="true" />
              </span>
            </span>

            {idle ? (
              <input
                ref={inputRef}
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onFocus={() => {
                  hasInteractedRef.current = true;
                }}
                placeholder="yourbrand.com"
                aria-label="Your domain name"
                className="min-w-0 flex-1 bg-transparent font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none sm:text-base"
              />
            ) : (
              <span className="min-w-0 flex-1 truncate text-left font-mono text-sm text-text-primary sm:text-base">
                {showsHttps ? "https://" : ""}
                {liveDomain}
              </span>
            )}

            <button
              type="submit"
              aria-label="Launch this domain"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-white transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          <div className="relative flex-1 px-6 pb-8" style={{ paddingTop: PILL_HEIGHT + 8 }}>
            {stage === "live" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex h-full flex-col items-center justify-center text-center"
              >
                <div className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                  <Check size={13} aria-hidden="true" />
                  Live
                </div>
                <p className="mt-4 font-mono text-2xl text-text-primary sm:text-3xl">{liveDomain}</p>
                {elapsed && (
                  <p className="mt-2 text-sm text-text-muted">Deployed in {elapsed}s — try your own domain above.</p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-4 h-5 text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {stage !== "idle" && stage !== "live" && (
              <motion.p
                key={stage}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-text-secondary"
              >
                {WAYPOINTS.find((w) => w.stage === stage)?.label}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

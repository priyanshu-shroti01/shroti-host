"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, Check, Lock, LockOpen } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const DEFAULT_DOMAIN = "yourbrand.com";

type Stage = "idle" | "dns" | "server" | "ssl" | "deploy" | "live";

// Durations aren't equal — DNS resolves fast, SSL "does real work" for
// longer, so the sequence has rhythm instead of four identical ticks.
const WAYPOINTS: { stage: Stage; label: string; duration: number }[] = [
  { stage: "dns", label: "Resolving DNS…", duration: 0.5 },
  { stage: "server", label: "Connecting to server…", duration: 0.6 },
  { stage: "ssl", label: "Issuing SSL certificate…", duration: 0.85 },
  { stage: "deploy", label: "Deploying your site…", duration: 0.55 },
];
const TOTAL_WAYPOINT_DURATION = WAYPOINTS.reduce((s, w) => s + w.duration, 0);

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
const MAX_FRAME_HEIGHT = 560;

const contentVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const barVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: { opacity: 1, scaleX: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lockOpenRef = useRef<HTMLSpanElement>(null);
  const lockClosedRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const autoTypeRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    const frameHeight = Math.min(MAX_FRAME_HEIGHT, window.innerHeight * 0.6);

    if (prefersReducedMotion) {
      // Skip straight to the resolved end state — including the frame's
      // final size, which otherwise only ever grows via the tween below.
      gsap.set(frame, { height: frameHeight, borderRadius: 24 });
      gsap.set(line, { scaleX: 1 });
      gsap.set(lockOpenRef.current, { opacity: 0 });
      gsap.set(lockClosedRef.current, { opacity: 1 });
      gsap.set(headerRef.current, { opacity: 0.35, scale: 0.94, y: -6 });
      setStage("live");
      return;
    }

    gsap.set(frame, { height: PILL_HEIGHT, borderRadius: 999 });
    gsap.set(line, { scaleX: 0 });
    gsap.set(dotRef.current, { left: "0%", scale: 1, opacity: 1 });
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

    tl.to(headerRef.current, { opacity: 0.35, scale: 0.94, y: -6, duration: 0.4 }, 0);

    // Positions are tracked as absolute timestamps (not GSAP's implicit
    // "end of timeline" cursor) so the snap-pulse effects can overlap into
    // the next segment intentionally, rather than each one sequentially
    // appending ~0.3s and stretching the whole sequence out.
    let cursor = 0.15;
    let cumulative = 0;
    WAYPOINTS.forEach((wp) => {
      const start = cursor;
      cumulative += wp.duration;
      const progress = cumulative / TOTAL_WAYPOINT_DURATION;
      tl.call(() => setStage(wp.stage), [], start)
        .to(line, { scaleX: progress, duration: wp.duration, ease: "power1.inOut" }, start)
        .to(dotRef.current, { left: `${progress * 100}%`, duration: wp.duration, ease: "power1.inOut" }, start);

      if (wp.stage === "ssl") {
        const mid = start + wp.duration * 0.5;
        tl.to(lockOpenRef.current, { opacity: 0, duration: 0.25 }, mid).to(
          lockClosedRef.current,
          { opacity: 1, duration: 0.25 },
          mid
        );
      }

      // A small "snap" right as each waypoint lands, so progress feels like
      // discrete hits rather than one continuous, undifferentiated fill —
      // overlapping the next segment rather than delaying it.
      const land = start + wp.duration;
      tl.to(dotRef.current, { scale: 1.9, duration: 0.12, ease: "power1.out" }, land)
        .to(dotRef.current, { scale: 1, duration: 0.22, ease: "power1.in" }, land + 0.12)
        .to(glowRef.current, { opacity: 0.85, duration: 0.12 }, land)
        .to(glowRef.current, { opacity: 0.5, duration: 0.3 }, land + 0.12);

      cursor = land;
    });

    tl.to(frame, { height: frameHeight, borderRadius: 24, duration: 0.7, ease: "power3.inOut" }, cursor + 0.1);
  }

  useEffect(() => {
    // Depends on prefersReducedMotion so that if the hook's own effect
    // resolves it after this one has already scheduled (its default is
    // `false` until the media query is read), the timer is cleared and
    // rescheduled with a closure that sees the real value — a plain `[]`
    // dependency array would freeze it to the stale first-render closure.
    if (prefersReducedMotion) {
      const t = setTimeout(() => {
        if (!hasInteractedRef.current) play(DEFAULT_DOMAIN);
      }, 400);
      return () => clearTimeout(t);
    }

    const startTimer = setTimeout(() => {
      if (hasInteractedRef.current) return;
      const text = DEFAULT_DOMAIN;
      let i = 0;
      autoTypeRef.current = setInterval(() => {
        if (hasInteractedRef.current) {
          if (autoTypeRef.current) clearInterval(autoTypeRef.current);
          return;
        }
        i += 1;
        setDomainInput(text.slice(0, i));
        if (i >= text.length) {
          if (autoTypeRef.current) clearInterval(autoTypeRef.current);
          setTimeout(() => {
            if (!hasInteractedRef.current) play(text);
          }, 350);
        }
      }, 55);
    }, 700);

    return () => {
      clearTimeout(startTimer);
      if (autoTypeRef.current) clearInterval(autoTypeRef.current);
      timelineRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  function stopAutoType() {
    hasInteractedRef.current = true;
    if (autoTypeRef.current) {
      clearInterval(autoTypeRef.current);
      autoTypeRef.current = null;
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    stopAutoType();
    play(sanitizeDomain(domainInput));
    inputRef.current?.blur();
  }

  const idle = stage === "idle";
  const showsHttps = stage === "deploy" || stage === "live";

  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 py-16 sm:py-20">
      <div
        ref={glowRef}
        className="absolute inset-0 -z-10 opacity-60"
        style={{ background: "var(--gradient-glow)" }}
        aria-hidden="true"
      />

      <div ref={headerRef} className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-sm text-brand-blue">shrotihost.in</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text-primary sm:text-6xl">
          Launch a website.
          <br className="hidden sm:block" /> Watch it happen.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-text-secondary">
          Type your domain and press enter — this is the real sequence behind going live.
        </p>
      </div>

      <div className="mt-10 w-full max-w-2xl">
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
            <div
              ref={dotRef}
              className="absolute top-1/2 h-2.5 w-2.5 rounded-full bg-brand-blue shadow-[0_0_10px_3px_rgb(63_167_255/0.7)]"
              style={{ left: "0%", transform: "translate(-50%, -50%)" }}
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
                onFocus={stopAutoType}
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

          <div className="relative flex-1 px-6 pb-8 sm:px-10" style={{ paddingTop: PILL_HEIGHT + 16 }}>
            {stage === "live" && (
              <motion.div
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                className="flex h-full flex-col items-center justify-center gap-10"
              >
                <div className="w-full max-w-sm space-y-3 opacity-40">
                  <motion.div variants={barVariants} className="h-2 w-1/4 origin-left rounded-full bg-text-muted" />
                  <motion.div variants={barVariants} className="h-4 w-3/5 origin-left rounded-full bg-text-muted" />
                  <motion.div variants={barVariants} className="h-2 w-full origin-left rounded-full bg-text-muted" />
                  <motion.div variants={barVariants} className="h-2 w-4/5 origin-left rounded-full bg-text-muted" />
                </div>

                <motion.div variants={barVariants} className="flex flex-col items-center text-center">

                  <div className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
                    <Check size={13} aria-hidden="true" />
                    Live
                  </div>
                  <p className="mt-4 font-mono text-2xl text-text-primary sm:text-3xl">{liveDomain}</p>
                  {elapsed && (
                    <p className="mt-2 text-sm text-text-muted">
                      Deployed in {elapsed}s — try your own domain above.
                    </p>
                  )}
                </motion.div>
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

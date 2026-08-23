"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  DatabaseBackup,
  Globe,
  HardDrive,
  Lock,
  PartyPopper,
  Search,
  Server,
  ShieldCheck,
  Share2,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroAtmosphere } from "@/components/ui/hero-atmosphere";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { sharedPlans } from "@/lib/plans";

const EXAMPLE_DOMAINS = ["yourbrand.com", "myagency.in", "startup.dev"];

// Entry price is read from the catalog so the hero can never drift from /hosting.
const FROM_PRICE_INR = Math.min(...sharedPlans.map((p) => p.monthlyPrice));

// Every badge is a real inclusion on every shared plan (see lib/plans commonFeatures).
const TRUST_BADGES = [
  { icon: HardDrive, label: "NVMe Storage" },
  { icon: ShieldCheck, label: "CloudLinux" },
  { icon: Lock, label: "Free SSL" },
  { icon: DatabaseBackup, label: "Daily Backups" },
];

type StepStatus = "pending" | "active" | "done";

const STEPS = [
  { icon: Search, pending: "Searching domain…", done: "Domain available", detail: "", duration: 900 },
  { icon: Server, pending: "Allocating server…", done: "Server ready", detail: "LiteSpeed · NVMe", duration: 1100 },
  { icon: Lock, pending: "Installing SSL…", done: "SSL installed", detail: "Let's Encrypt", duration: 850 },
  { icon: Globe, pending: "Configuring DNS…", done: "DNS connected", detail: "Cloudflare", duration: 800 },
  { icon: UploadCloud, pending: "Deploying files…", done: "Files deployed", detail: "", duration: 900 },
] as const;

function sanitizeDomain(raw: string, fallback: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/[^a-z0-9.-]/g, "");
  if (!cleaned) return fallback;
  return cleaned.includes(".") ? cleaned : `${cleaned}.com`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function Hero() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const autoTypeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // The demo replays only while the hero is on screen, the tab is visible and
  // for at most two automatic cycles — otherwise its state updates keep
  // competing with route transitions long after the visitor scrolled away.
  const sectionRef = useRef<HTMLElement>(null);
  const inViewRef = useRef(true);
  const autoCyclesRef = useRef(0);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const sequenceIdRef = useRef(0);
  const hasInteractedRef = useRef(false);
  const demoIndexRef = useRef(0);

  const [domainInput, setDomainInput] = useState("");
  const [liveDomain, setLiveDomain] = useState(EXAMPLE_DOMAINS[0]);
  const [activeStep, setActiveStep] = useState(-1);
  const [isLive, setIsLive] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  async function play(domain: string, mySeq: number) {
    setLiveDomain(domain);
    setIsLive(false);
    setShareState("idle");
    setActiveStep(-1);

    if (prefersReducedMotion) {
      if (sequenceIdRef.current !== mySeq) return;
      setActiveStep(STEPS.length);
      setIsLive(true);
      return;
    }

    for (let i = 0; i < STEPS.length; i++) {
      if (sequenceIdRef.current !== mySeq) return;
      setActiveStep(i);
      await sleep(STEPS[i].duration);
    }
    if (sequenceIdRef.current !== mySeq) return;
    setActiveStep(STEPS.length);
    setIsLive(true);

    // Auto-restart with a different example domain if the visitor never engaged.
    await sleep(3200);
    if (sequenceIdRef.current !== mySeq || hasInteractedRef.current) return;
    autoCyclesRef.current += 1;
    if (autoCyclesRef.current >= 2 || document.hidden || !inViewRef.current) return;
    demoIndexRef.current = (demoIndexRef.current + 1) % EXAMPLE_DOMAINS.length;
    void play(EXAMPLE_DOMAINS[demoIndexRef.current], mySeq);
  }

  useEffect(() => {
    // Depends on prefersReducedMotion so that if the hook's own effect
    // resolves it after this one has already scheduled (its default is
    // `false` until the media query is read), the timer restarts with a
    // closure that sees the real value — a plain `[]` dependency array
    // would freeze it to the stale first-render closure.
    const mySeq = ++sequenceIdRef.current;

    if (prefersReducedMotion) {
      const t = setTimeout(() => {
        if (!hasInteractedRef.current) void play(EXAMPLE_DOMAINS[0], mySeq);
      }, 300);
      return () => clearTimeout(t);
    }

    const startTimer = setTimeout(() => {
      if (hasInteractedRef.current) return;
      const text = EXAMPLE_DOMAINS[0];
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
            if (!hasInteractedRef.current) void play(text, mySeq);
          }, 350);
        }
      }, 55);
    }, 700);

    return () => {
      clearTimeout(startTimer);
      if (autoTypeRef.current) clearInterval(autoTypeRef.current);
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
    // Sync the input to the sanitized value too — otherwise once the input
    // reappears after this run (available again for "try your own domain"),
    // it shows the raw typed text (e.g. "myagency") while the run itself,
    // and the celebration screen, use the sanitized one ("myagency.com").
    const sanitized = sanitizeDomain(domainInput, liveDomain);
    setDomainInput(sanitized);
    const mySeq = ++sequenceIdRef.current;
    void play(sanitized, mySeq);
    inputRef.current?.blur();
  }

  async function handleShare() {
    const url = "https://shrotihost.in";
    const text = "Check out ShrotiHost — launch a website in seconds.";
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "ShrotiHost", text, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2000);
    } catch {
      // clipboard unavailable — nothing more we can honestly do here
    }
  }

  // The input stays available before a run and once one finishes (so
  // "try your own domain" always has somewhere to go) — only hidden while
  // actively stepping through the sequence.
  const inProgress = activeStep >= 0 && activeStep < STEPS.length;
  const showInput = !inProgress;

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
      <HeroAtmosphere />
      <Container className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold text-text-secondary shadow-[var(--shadow-card)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            shrotihost.in
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-none tracking-tighter text-text-primary sm:text-5xl lg:text-6xl">
            Launch a website.
            <br />{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
              Watch it happen.
            </span>
          </h1>
          {/* One extractable definition sentence (entity statement for search
              and answer engines) — no tagline stack above it. */}
          <p className="mx-auto mt-5 max-w-lg text-text-secondary lg:mx-0">
            ShrotiHost is an Indian web hosting and development company — NVMe hosting from ₹
            {FROM_PRICE_INR}/mo with the same price on renewal, domains, and custom builds.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button href="/hosting#compare" size="lg" prefetch={null}>
              See plans — from ₹{FROM_PRICE_INR}/mo
            </Button>
            <Button href="/web-development" variant="secondary" size="lg">
              Build With ShrotiHost
            </Button>
          </div>

          <div className="mx-auto mt-10 flex max-w-md flex-wrap justify-center gap-2.5 border-t border-border pt-6 lg:mx-0 lg:justify-start">
            {TRUST_BADGES.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-[var(--shadow-card)]"
              >
                <b.icon size={13} className="shrink-0 text-brand-purple" aria-hidden="true" />
                <span className="text-xs font-semibold text-text-secondary">{b.label}</span>
              </span>
            ))}
          </div>
        </div>

        <Tilt3D maxTilt={3.5} className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
          <div className="overflow-hidden rounded-2xl border border-border-strong bg-card shadow-2xl">
            {/* Honest framing: the checklist simulates a launch; nothing is
                purchased or provisioned from this card. */}
            <div className="flex items-center justify-between border-b border-border bg-surface-raised px-5 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Interactive demo
              </span>
              <span className="text-xs text-text-muted">Simulated launch · nothing is ordered</span>
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-border px-5 py-3">
              <Globe size={16} className="shrink-0 text-text-muted" aria-hidden="true" />
              {showInput ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  onFocus={stopAutoType}
                  placeholder="yourbrand.com"
                  aria-label="Your domain name"
                  className="min-w-0 flex-1 rounded-full bg-transparent font-mono text-sm text-text-primary placeholder:text-text-muted sm:text-base"
                />
              ) : (
                <span className="min-w-0 flex-1 truncate font-mono text-sm text-text-primary sm:text-base">
                  {liveDomain}
                </span>
              )}
              <button
                type="submit"
                aria-label="Launch this domain"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-purple text-white transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </form>

            {/* Live region: step changes and the end state are announced, not silent. */}
            <div className="min-h-[22rem] p-5 sm:p-6" aria-live="polite">
              <AnimatePresence mode="wait">
                {isLive ? (
                  <motion.div
                    key="celebration"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="flex h-full min-h-[19rem] flex-col items-center justify-center text-center"
                  >
                    <PartyPopper size={30} className="text-brand-purple" aria-hidden="true" />
                    <p className="mt-3 text-lg font-semibold text-text-primary">Website Successfully Launched</p>
                    <p className="mt-1 font-mono text-sm text-text-muted">{liveDomain}</p>
                    <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
                      <Button href="/hosting#compare" size="md" className="w-full">
                        Get this setup from ₹{FROM_PRICE_INR}/mo
                        <ArrowRight size={15} aria-hidden="true" />
                      </Button>
                      <Button href="/domains" variant="secondary" size="md" className="w-full">
                        <Globe size={15} aria-hidden="true" />
                        Manage Domains
                      </Button>
                      <Button variant="ghost" size="md" className="w-full" onClick={handleShare} type="button">
                        <Share2 size={15} aria-hidden="true" />
                        {shareState === "copied" ? "Link copied" : "Share Website"}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="steps"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-1"
                  >
                    {STEPS.map((step, i) => {
                      const status: StepStatus = i < activeStep || activeStep === STEPS.length ? "done" : i === activeStep ? "active" : "pending";
                      return (
                        <div key={step.pending} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
                          <div
                            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 ${
                              status === "done"
                                ? "border-success/40 bg-success/10 text-success"
                                : status === "active"
                                  ? "border-brand-purple/50 bg-brand-purple/10 text-brand-purple"
                                  : "border-border text-text-disabled"
                            }`}
                          >
                            {status === "done" ? (
                              <Check size={15} aria-hidden="true" />
                            ) : (
                              <step.icon size={15} aria-hidden="true" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-medium transition-colors duration-300 ${
                                status === "pending" ? "text-text-muted" : "text-text-primary"
                              }`}
                            >
                              {status === "done" ? step.done : step.pending}
                            </p>
                            {step.detail && <p className="truncate font-mono text-xs text-text-muted">{step.detail}</p>}
                          </div>
                          {status === "active" && (
                            <div className="h-1 w-14 shrink-0 overflow-hidden rounded-full bg-border">
                              <motion.div
                                key={i}
                                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-brand-purple to-brand-blue"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: step.duration / 1000, ease: "linear" }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Tilt3D>
      </Container>
    </section>
  );
}

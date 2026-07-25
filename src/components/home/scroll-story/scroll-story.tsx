"use client";

import { useEffect, useRef, useState, type RefCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Globe } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { chapters, DEFAULT_STORY_DOMAIN } from "./data";
import {
  DashboardPanel,
  DnsPanel,
  DomainPanel,
  MonitorPanel,
  ScalePanel,
  ServerPanel,
  SslPanel,
  SuccessPanel,
} from "./panels";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function sanitizeDomain(raw: string): string {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "");
  if (!cleaned) return DEFAULT_STORY_DOMAIN;
  return cleaned.includes(".") ? cleaned : `${cleaned}.com`;
}

/**
 * Chip position/scale per chapter, as a percentage of the pinned stage.
 * The chip travels through the first three chapters (where it's the
 * identity being carried forward), then hides once each chapter grows
 * its own focal visual (server card, SSL card, browser frame, ...).
 */
const CHIP_ANCHORS = [
  { x: 50, y: 68, scale: 1.15, opacity: 1 }, // domain
  { x: 50, y: 26, scale: 0.85, opacity: 1 }, // server
  { x: 50, y: 20, scale: 0.7, opacity: 1 }, // dns
  { x: 50, y: 16, scale: 0.6, opacity: 0 }, // ssl
  { x: 50, y: 16, scale: 0.6, opacity: 0 }, // dashboard
  { x: 50, y: 16, scale: 0.6, opacity: 0 }, // monitor
  { x: 50, y: 16, scale: 0.6, opacity: 0 }, // scale
  { x: 50, y: 16, scale: 0.6, opacity: 0 }, // success
];

export function ScrollStory() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [domainInput, setDomainInput] = useState("");

  useEffect(() => {
    // SSR and the first client render always assume static (accessible,
    // no hydration mismatch). Once mounted, re-derive the mode fresh from
    // the live media query on every render — never ratchet one-way.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const cinematic = mounted && !prefersReducedMotion;
  const domain = sanitizeDomain(domainInput);

  if (!cinematic) {
    return <StaticStory domain={domain} domainInput={domainInput} onDomainInput={setDomainInput} />;
  }
  return <CinematicStory domain={domain} domainInput={domainInput} onDomainInput={setDomainInput} />;
}

function StaticStory({
  domain,
  domainInput,
  onDomainInput,
}: {
  domain: string;
  domainInput: string;
  onDomainInput: (v: string) => void;
}) {
  const registerEl: <T extends Element = HTMLElement>(name: string) => RefCallback<T> = () => () => {};
  return (
    <div className="space-y-20 py-16 sm:space-y-28">
      {[
        <DomainPanel key="domain" registerEl={registerEl} domain={domain} domainInput={domainInput} onDomainInput={onDomainInput} />,
        <ServerPanel key="server" registerEl={registerEl} domain={domain} complete />,
        <DnsPanel key="dns" registerEl={registerEl} domain={domain} />,
        <SslPanel key="ssl" registerEl={registerEl} domain={domain} complete />,
        <DashboardPanel key="dashboard" registerEl={registerEl} domain={domain} />,
        <MonitorPanel key="monitor" registerEl={registerEl} complete />,
        <ScalePanel key="scale" registerEl={registerEl} complete />,
        <SuccessPanel key="success" registerEl={registerEl} domain={domain} />,
      ].map((panel, i) => (
        <Reveal key={chapters[i].id} className="mx-auto flex justify-center">
          {panel}
        </Reveal>
      ))}
    </div>
  );
}

function CinematicStory({
  domain,
  domainInput,
  onDomainInput,
}: {
  domain: string;
  domainInput: string;
  onDomainInput: (v: string) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const elements = useRef<Record<string, Element | null>>({});
  const [activeChapter, setActiveChapter] = useState(0);
  const [storyInView, setStoryInView] = useState(false);

  // Dynamic ref-map factory: the returned callback only ever writes to
  // `elements.current` from React's commit phase (when a DOM node mounts or
  // unmounts), never during render, so this is safe despite the lint rule's
  // static heuristic not being able to prove that for a factory shape.
  function registerEl<T extends Element = HTMLElement>(name: string): RefCallback<T> {
    return (node) => {
      // eslint-disable-next-line react-hooks/refs
      elements.current[name] = node;
    };
  }

  useEffect(() => {
    const el = elements.current;
    const ctx = gsap.context(() => {
      const panelNames = chapters.map((c) => `panel-${c.id}`);
      const panels = panelNames.map((n) => el[n]);
      const chip = el["chip"];

      gsap.set(panels, { opacity: 0, y: 24, scale: 0.94 });
      gsap.set(panels[0], { opacity: 1, y: 0, scale: 1 });
      gsap.set(chip, {
        left: `${CHIP_ANCHORS[0].x}%`,
        top: `${CHIP_ANCHORS[0].y}%`,
        xPercent: -50,
        yPercent: -50,
        scale: CHIP_ANCHORS[0].scale,
        opacity: CHIP_ANCHORS[0].opacity,
      });

      const serverRing = el["server-ring"];
      const serverTags = [0, 1, 2, 3].map((i) => el[`server-tag-${i}`]);
      gsap.set(serverRing, { scale: 0.85 });
      gsap.set(serverTags, { opacity: 0 });

      const dnsRows = [0, 1, 2].map((i) => el[`dns-row-${i}`]);
      gsap.set(dnsRows, { opacity: 0, x: -12 });
      gsap.set(el["dns-status"], { opacity: 0, y: 8 });

      const sslPending = el["ssl-pending"];
      const sslDone = el["ssl-done"];
      gsap.set(sslPending, { opacity: 1 });
      gsap.set(sslDone, { opacity: 0 });

      const sparkline = el["dashboard-sparkline"] as SVGPathElement | null;
      let sparkLength = 0;
      if (sparkline) {
        sparkLength = sparkline.getTotalLength();
        gsap.set(sparkline, { strokeDasharray: sparkLength, strokeDashoffset: sparkLength });
      }

      const bars = Array.from({ length: 12 }, (_, i) => el[`analytics-bar-${i}`]);
      gsap.set(bars, { scaleY: 0 });

      const tierBlocks = [0, 1, 2].flatMap((tier) =>
        Array.from({ length: tier + 1 }, (_, b) => el[`scaling-block-${tier}-${b}`])
      );
      gsap.set(tierBlocks, { opacity: 0, scaleY: 0.3 });
      const tiers = [0, 1, 2].map((i) => el[`scaling-tier-${i}`]);
      gsap.set(tiers, { opacity: 0.4 });

      const visitsCounter = el["analytics-visits"];
      const uptimeCounter = el["analytics-uptime"];
      const counterState = { visits: 0, uptime: 0 };

      const successCheck = el["success-check"];
      gsap.set(successCheck, { scale: 0.6, opacity: 0 });

      const STEP = 1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            const idx = Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length));
            setActiveChapter((prev) => (prev === idx ? prev : idx));
          },
          onEnter: () => setStoryInView(true),
          onLeave: () => setStoryInView(false),
          onEnterBack: () => setStoryInView(true),
          onLeaveBack: () => setStoryInView(false),
        },
        defaults: { ease: "power2.inOut" },
      });

      function crossfade(fromIdx: number, toIdx: number, chipTarget: (typeof CHIP_ANCHORS)[number]) {
        tl.addLabel(`ch${toIdx}`, `+=${STEP * 0.35}`)
          .to(panels[fromIdx], { opacity: 0, y: -24, scale: 0.94, duration: STEP * 0.5 }, `ch${toIdx}`)
          .to(
            chip,
            {
              left: `${chipTarget.x}%`,
              top: `${chipTarget.y}%`,
              scale: chipTarget.scale,
              opacity: chipTarget.opacity,
              duration: STEP * 0.6,
            },
            `ch${toIdx}`
          )
          .to(panels[toIdx], { opacity: 1, y: 0, scale: 1, duration: STEP * 0.6 }, `ch${toIdx}+=0.1`);
      }

      // 0 → 1: Domain → Launch Server
      crossfade(0, 1, CHIP_ANCHORS[1]);
      tl.to(serverRing, { scale: 1, duration: 0.4 }, "ch1+=0.2").to(serverTags, {
        opacity: 1,
        duration: 0.25,
        stagger: 0.12,
      }, "ch1+=0.45");

      // 1 → 2: Launch Server → Configure DNS
      crossfade(1, 2, CHIP_ANCHORS[2]);
      tl.to(dnsRows[0], { opacity: 1, x: 0, duration: 0.3 }, "ch2+=0.25")
        .to(dnsRows[1], { opacity: 1, x: 0, duration: 0.3 }, "ch2+=0.4")
        .to(dnsRows[2], { opacity: 1, x: 0, duration: 0.3 }, "ch2+=0.55")
        .to(el["dns-status"], { opacity: 1, y: 0, duration: 0.3 }, "ch2+=0.75");

      // 2 → 3: Configure DNS → Install SSL
      crossfade(2, 3, CHIP_ANCHORS[3]);
      tl.to(sslPending, { opacity: 0, duration: 0.3 }, "ch3+=0.35").to(
        sslDone,
        { opacity: 1, duration: 0.35 },
        "ch3+=0.4"
      );

      // 3 → 4: Install SSL → Dashboard
      crossfade(3, 4, CHIP_ANCHORS[4]);
      if (sparkline) {
        tl.to(sparkline, { strokeDashoffset: 0, duration: 0.7, ease: "power1.inOut" }, "ch4+=0.2");
      }

      // 4 → 5: Dashboard → Monitor Website
      crossfade(4, 5, CHIP_ANCHORS[5]);
      tl.to(bars, { scaleY: 1, duration: 0.5, stagger: 0.04 }, "ch5+=0.15").to(
        counterState,
        {
          visits: 48200,
          uptime: 99.98,
          duration: 0.7,
          onUpdate: () => {
            if (visitsCounter) visitsCounter.textContent = Math.round(counterState.visits).toLocaleString("en-IN");
            if (uptimeCounter) uptimeCounter.textContent = `${counterState.uptime.toFixed(2)}%`;
          },
        },
        "ch5+=0.2"
      );

      // 5 → 6: Monitor Website → Scale Resources
      crossfade(5, 6, CHIP_ANCHORS[6]);
      tl.to(tiers[0], { opacity: 1, duration: 0.2 }, "ch6+=0.15")
        .to([el["scaling-block-0-0"]], { opacity: 1, scaleY: 1, duration: 0.25 }, "ch6+=0.25")
        .to(tiers[1], { opacity: 1, duration: 0.2 }, "ch6+=0.45")
        .to(
          Array.from({ length: 2 }, (_, b) => el[`scaling-block-1-${b}`]),
          { opacity: 1, scaleY: 1, duration: 0.25, stagger: 0.05 },
          "ch6+=0.55"
        )
        .to(tiers[2], { opacity: 1, duration: 0.2 }, "ch6+=0.8")
        .to(
          Array.from({ length: 3 }, (_, b) => el[`scaling-block-2-${b}`]),
          { opacity: 1, scaleY: 1, duration: 0.25, stagger: 0.05 },
          "ch6+=0.9"
        );

      // 6 → 7: Scale Resources → Success
      crossfade(6, 7, CHIP_ANCHORS[7]);
      tl.to(successCheck, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }, "ch7+=0.2");
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${chapters.length * 95}vh` }}>
      <a
        href="#pricing"
        className="sr-only rounded-lg bg-card px-3 py-2 text-xs font-medium text-text-primary shadow-lg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-40"
      >
        Skip cinematic intro
      </a>

      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ background: "var(--gradient-glow)" }}
          aria-hidden="true"
        />

        <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 text-center sm:top-10">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {chapters[activeChapter].kicker}
          </p>
          <p className="mt-1 text-sm font-medium text-text-secondary sm:text-base">
            {chapters[activeChapter].title}
          </p>
        </div>

        <div
          ref={registerEl<HTMLDivElement>("chip")}
          className="absolute z-20 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-brand-purple/40 bg-card px-3 py-1.5 shadow-xl"
        >
          <Globe size={13} className="text-brand-purple" aria-hidden="true" />
          <span className="font-mono text-xs text-text-primary">{domain}</span>
        </div>

        <div ref={registerEl("panel-domain")} className="absolute inset-0 flex items-center justify-center">
          <DomainPanel registerEl={registerEl} domain={domain} domainInput={domainInput} onDomainInput={onDomainInput} />
        </div>
        <div ref={registerEl("panel-server")} className="absolute inset-0 flex items-center justify-center">
          <ServerPanel registerEl={registerEl} domain={domain} />
        </div>
        <div ref={registerEl("panel-dns")} className="absolute inset-0 flex items-center justify-center">
          <DnsPanel registerEl={registerEl} domain={domain} />
        </div>
        <div ref={registerEl("panel-ssl")} className="absolute inset-0 flex items-center justify-center">
          <SslPanel registerEl={registerEl} domain={domain} />
        </div>
        <div ref={registerEl("panel-dashboard")} className="absolute inset-0 flex items-center justify-center">
          <DashboardPanel registerEl={registerEl} domain={domain} />
        </div>
        <div ref={registerEl("panel-monitor")} className="absolute inset-0 flex items-center justify-center">
          <MonitorPanel registerEl={registerEl} />
        </div>
        <div ref={registerEl("panel-scale")} className="absolute inset-0 flex items-center justify-center">
          <ScalePanel registerEl={registerEl} />
        </div>
        <div ref={registerEl("panel-success")} className="absolute inset-0 flex items-center justify-center">
          <SuccessPanel registerEl={registerEl} domain={domain} />
        </div>

        <nav
          aria-label="Story progress"
          className={`fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-300 lg:flex ${
            storyInView ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              aria-label={`Jump to ${c.title}`}
              aria-current={activeChapter === i}
              onClick={() => {
                const wrapper = wrapperRef.current;
                if (!wrapper) return;
                const total = wrapper.offsetHeight - window.innerHeight;
                const target = wrapper.offsetTop + (i / (chapters.length - 1)) * total;
                window.scrollTo({ top: target, behavior: "smooth" });
              }}
              className={`h-2 w-2 rounded-full transition-all ${
                activeChapter === i ? "h-6 bg-brand-purple" : "bg-border-strong hover:bg-text-muted"
              }`}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

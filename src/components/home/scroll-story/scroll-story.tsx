"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cloud } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import {
  BLOCK_COUNT,
  chapters,
  cloudFormation,
  serverFormation,
  vpsFormation,
  type BlockFormation,
} from "./data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VIEWBOX = 220; // half-width/height of the SVG line layer's coordinate space

function lineLength(target: BlockFormation) {
  const cx = target.x + target.width / 2;
  const cy = target.y + target.height / 2;
  return Math.hypot(cx, cy);
}

export function ScrollStory() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // SSR and the first client render always assume static (accessible, no
    // hydration mismatch). Once mounted, re-derive the mode fresh from the
    // live media query on every render — never ratchet one-way.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const cinematic = mounted && !prefersReducedMotion;
  return cinematic ? <CinematicStory /> : <StaticStory />;
}

function MorphPreview({ formation }: { formation: BlockFormation[] }) {
  return (
    <div className="relative mx-auto h-[280px] w-[280px] sm:h-[340px] sm:w-[340px]">
      {formation.map((b, i) => (
        <div
          key={i}
          className="absolute bg-gradient-to-br from-brand-purple to-brand-blue"
          style={{
            left: "50%",
            top: "50%",
            width: b.width,
            height: b.height,
            borderRadius: b.radius,
            transform: `translate(${b.x}px, ${b.y}px) rotate(${b.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function StaticStory() {
  const formations = [serverFormation(), vpsFormation(), cloudFormation()];
  return (
    <div className="space-y-20 py-16 sm:space-y-28">
      {chapters.map((c, i) => (
        <Reveal key={c.id} className="mx-auto flex max-w-xl flex-col items-center px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{c.kicker}</p>
          <h3 className="mt-2 text-2xl font-semibold text-text-primary sm:text-4xl">{c.title}</h3>
          <p className="mt-3 max-w-sm text-sm text-text-secondary">{c.detail}</p>
          <div className="mt-8">
            <MorphPreview formation={formations[i]} />
          </div>
        </Reveal>
      ))}
      <Reveal className="mx-auto max-w-xl px-4 text-center">
        <p className="text-text-secondary">This is the infrastructure behind every plan.</p>
      </Reveal>
    </div>
  );
}

function CinematicStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const elements = useRef<Record<string, Element | null>>({});
  const [activeChapter, setActiveChapter] = useState(0);
  const [storyInView, setStoryInView] = useState(false);

  // Dynamic ref-map factory: the returned callback only ever writes to
  // `elements.current` from React's commit phase (when a DOM node mounts or
  // unmounts), never during render, so this is safe despite the lint rule's
  // static heuristic not being able to prove that for a factory shape.
  function registerEl(name: string) {
    return (node: Element | null) => {
      // eslint-disable-next-line react-hooks/refs
      elements.current[name] = node;
    };
  }

  useEffect(() => {
    const el = elements.current;
    const server = serverFormation();
    const vps = vpsFormation();
    const cloud = cloudFormation();

    const ctx = gsap.context(() => {
      const blocks = Array.from({ length: BLOCK_COUNT }, (_, i) => el[`block-${i}`]);
      const lines = Array.from({ length: BLOCK_COUNT }, (_, i) => el[`line-${i}`]);
      const hub = el["hub-icon"];
      const resolution = el["resolution"];

      blocks.forEach((b, i) => gsap.set(b, { ...server[i] }));
      lines.forEach((line, i) => {
        const len = lineLength(cloud[i]);
        gsap.set(line, {
          attr: { x1: 0, y1: 0, x2: cloud[i].x + cloud[i].width / 2, y2: cloud[i].y + cloud[i].height / 2 },
          strokeDasharray: len,
          strokeDashoffset: len,
        });
      });
      gsap.set(hub, { opacity: 0, scale: 0.5 });
      gsap.set(resolution, { opacity: 0, y: 12 });

      // Scrub-driven timelines stay linear ("none") — an eased tween's
      // velocity is non-constant across its own duration, so under scrub
      // (which maps scroll distance to timeline position 1:1) it reads as
      // motion lagging behind the scroll then suddenly catching up. Each
      // block also keeps moving continuously through its whole window
      // instead of arriving early and leaving a dead stretch of scroll.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (self) => {
            const idx = Math.min(chapters.length - 1, Math.floor(self.progress * chapters.length));
            setActiveChapter((prev) => (prev === idx ? prev : idx));
          },
          onEnter: () => setStoryInView(true),
          onLeave: () => setStoryInView(false),
          onEnterBack: () => setStoryInView(true),
          onLeaveBack: () => setStoryInView(false),
        },
        defaults: { ease: "none" },
      });

      // Chapter 0 → 1: Server → VPS (same 8 blocks reshape into an isolated grid)
      tl.addLabel("vps", "+=0.3");
      blocks.forEach((b, i) => {
        tl.to(b, { ...vps[i], duration: 1.1 }, `vps+=${i * 0.05}`);
      });

      // Chapter 1 → 2: VPS → Cloud (blocks disperse into an orbit, lines draw the network)
      tl.addLabel("cloud", "+=0.35");
      blocks.forEach((b, i) => {
        tl.to(b, { ...cloud[i], duration: 1.1 }, `cloud+=${i * 0.05}`);
      });
      tl.to(hub, { opacity: 1, scale: 1, duration: 0.4 }, "cloud+=0.7");
      lines.forEach((line, i) => {
        tl.to(line, { strokeDashoffset: 0, duration: 0.5 }, `cloud+=${0.75 + i * 0.05}`);
      });

      tl.to(resolution, { opacity: 1, y: 0, duration: 0.4 }, "cloud+=1.7");
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${chapters.length * 130}vh` }}>
      <a
        href="#pricing"
        className="sr-only rounded-lg bg-card px-3 py-2 text-xs font-medium text-text-primary shadow-lg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-40"
      >
        Skip cinematic intro
      </a>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-60"
          style={{ background: "var(--gradient-glow)" }}
          aria-hidden="true"
        />

        <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 text-center sm:top-10">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {chapters[activeChapter].kicker}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-text-primary sm:text-3xl">
            {chapters[activeChapter].title}
          </h3>
          <p className="mx-auto mt-2 max-w-xs text-xs text-text-secondary sm:max-w-sm sm:text-sm">
            {chapters[activeChapter].detail}
          </p>
        </div>

        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          <svg
            className="pointer-events-none absolute"
            style={{ left: -VIEWBOX, top: -VIEWBOX }}
            width={VIEWBOX * 2}
            height={VIEWBOX * 2}
            viewBox={`-${VIEWBOX} -${VIEWBOX} ${VIEWBOX * 2} ${VIEWBOX * 2}`}
            aria-hidden="true"
          >
            {Array.from({ length: BLOCK_COUNT }, (_, i) => (
              <line
                key={i}
                ref={registerEl(`line-${i}`)}
                stroke="var(--color-brand-purple)"
                strokeOpacity={0.35}
                strokeWidth={1.5}
              />
            ))}
          </svg>

          <div ref={registerEl("hub-icon")} className="absolute -left-4 -top-4 text-brand-purple">
            <Cloud size={32} aria-hidden="true" />
          </div>

          {Array.from({ length: BLOCK_COUNT }, (_, i) => (
            <div
              key={i}
              ref={registerEl(`block-${i}`)}
              className="absolute bg-gradient-to-br from-brand-purple to-brand-blue shadow-lg"
              style={{ left: 0, top: 0 }}
            />
          ))}
        </div>

        <p
          ref={registerEl("resolution")}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 px-4 text-center text-sm text-text-secondary sm:bottom-14"
        >
          This is the infrastructure behind every plan.
        </p>

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

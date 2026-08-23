"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-(--duration-fast) ease-out-quart focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:pointer-events-none active:duration-100";

const variants: Record<Variant, string> = {
  // Text-bearing gradient → the deep variant (white text stays AA on the blue end).
  primary:
    "bg-[image:var(--gradient-hero-deep)] text-white shadow-[var(--shadow-cta)] hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-110 hover:shadow-[var(--shadow-cta-hover)] active:translate-y-0 active:scale-[0.98] active:brightness-95",
  secondary:
    "border-2 border-border-strong bg-card text-text-primary hover:border-brand-purple hover:text-brand-purple-text hover:-translate-y-0.5 active:scale-[0.98]",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-surface active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-5 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-7 text-base",
};

type Ripple = { x: number; y: number; id: number };

function RippleLayer({ ripples }: { ripples: Ripple[] }) {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute h-2 w-2 rounded-full bg-white/40 motion-reduce:hidden"
          style={{
            left: r.x,
            top: r.y,
            transform: "translate(-50%, -50%)",
            animation: "ripple 0.6s ease-out forwards",
          }}
        />
      ))}
    </span>
  );
}

function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function addRipple(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }

  return { ripples, addRipple };
}

/** Spinner shown while `loading`; the label stays in the DOM so the button
 *  keeps its width and screen readers still hear what is being submitted. */
function Spinner() {
  return <Loader2 size={16} className="shrink-0 animate-spin" aria-hidden="true" />;
}

type CommonProps = {
  /** next/link prefetch. Defaults to false (prefetch on hover) — a page full
   *  of CTAs shouldn't fire a dozen RSC prefetches on load; pass null for
   *  Next's default viewport prefetch on the one primary CTA that matters. */
  prefetch?: boolean | null;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Busy state: shows a spinner, sets `aria-busy`, and disables the control
   *  (links become inert via `aria-disabled` + pointer-events). Variants and
   *  sizes are untouched so callers never hand-roll their own spinner. */
  loading?: boolean;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
    prefetch = false,
    loading = false,
    ...rest
  } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const { ripples, addRipple } = useRipple();

  if ("href" in props && props.href) {
    const { href: _href, onClick, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link
        href={props.href}
        prefetch={prefetch}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={loading || undefined}
        tabIndex={loading ? -1 : undefined}
        onClick={(e) => {
          if (loading) {
            e.preventDefault();
            return;
          }
          addRipple(e);
          onClick?.(e);
        }}
        {...anchorRest}
      >
        {loading && <Spinner />}
        {children}
        <RippleLayer ripples={ripples} />
      </Link>
    );
  }

  const { onClick, disabled, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={classes}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      onClick={(e) => {
        addRipple(e);
        onClick?.(e);
      }}
      {...buttonRest}
    >
      {loading && <Spinner />}
      {children}
      <RippleLayer ripples={ripples} />
    </button>
  );
}

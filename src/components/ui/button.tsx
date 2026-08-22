"use client";

import Link from "next/link";
import { useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-all duration-[180ms] ease-[cubic-bezier(0.33,1,0.68,1)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none active:duration-100";

const variants: Record<Variant, string> = {
  primary:
    "bg-[image:var(--gradient-hero)] text-white shadow-[0_4px_20px_-4px_rgb(168_16_199/0.45)] hover:-translate-y-0.5 hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_8px_28px_-6px_rgb(168_16_199/0.55)] active:translate-y-0 active:scale-[0.98] active:brightness-95",
  secondary:
    "border-2 border-border-strong bg-card text-text-primary hover:border-brand-purple hover:text-brand-purple hover:-translate-y-0.5 active:scale-[0.98]",
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

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, variant = "primary", size = "md", className = "", ...rest } = props;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  const { ripples, addRipple } = useRipple();

  if ("href" in props && props.href) {
    const { href: _href, onClick, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link
        href={props.href}
        className={classes}
        onClick={(e) => {
          addRipple(e);
          onClick?.(e);
        }}
        {...anchorRest}
      >
        {children}
        <RippleLayer ripples={ripples} />
      </Link>
    );
  }

  const { onClick, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={classes}
      onClick={(e) => {
        addRipple(e);
        onClick?.(e);
      }}
      {...buttonRest}
    >
      {children}
      <RippleLayer ripples={ripples} />
    </button>
  );
}

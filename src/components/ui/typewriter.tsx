"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export function Typewriter({
  text,
  speed = 18,
  className = "",
  onDone,
}: {
  text: string;
  speed?: number;
  className?: string;
  onDone?: () => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  // Typed-so-far is keyed to the text it was typed for, so a new `text`
  // resets during render (React's "adjust state on prop change" pattern)
  // instead of flashing the previous line for one tick.
  const [typed, setTyped] = useState({ text, count: 0 });
  if (typed.text !== text) {
    setTyped({ text, count: 0 });
  }
  // Callers pass inline arrows; read the latest through a ref so a re-render
  // never restarts the interval.
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (reducedMotion) {
      onDoneRef.current?.();
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped({ text, count: i });
      if (i >= text.length) {
        clearInterval(interval);
        onDoneRef.current?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, reducedMotion]);

  const shown = reducedMotion ? text : typed.text === text ? text.slice(0, typed.count) : "";
  return <span className={className}>{shown}</span>;
}

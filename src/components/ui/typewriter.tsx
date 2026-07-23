"use client";

import { useEffect, useState } from "react";

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
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // One-time environment check, not a render-driven update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(text);
      onDone?.();
      return;
    }

    setShown("");
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span className={className}>{shown}</span>;
}

import type { ReactNode } from "react";

export function Marquee({
  children,
  reverse = false,
  durationSeconds = 28,
}: {
  children: ReactNode;
  reverse?: boolean;
  durationSeconds?: number;
}) {
  return (
    <div
      className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      style={{ "--marquee-duration": `${durationSeconds}s` } as React.CSSProperties}
    >
      <div
        className={`flex shrink-0 items-center gap-12 pr-12 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center gap-12 pr-12 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
      >
        {children}
      </div>
    </div>
  );
}

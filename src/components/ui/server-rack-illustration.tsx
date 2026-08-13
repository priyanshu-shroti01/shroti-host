/**
 * Original isometric server-rack illustration — the 19_3D_DESIGN_SYSTEM
 * "Server Rack" core object as a hand-drawn inline SVG. Theme-aware via
 * design tokens (CSS custom properties resolve inside inline SVG), so it
 * needs no raster asset and reads correctly in both themes.
 *
 * Painter's order: base unit first, top unit last, so each slab occludes
 * the one beneath it the way a real stack would.
 */

const CX = 110;
const TOP_HALF_W = 62;
const TOP_HALF_H = 31;
const SIDE_H = 26;

function slabPaths(y0: number) {
  const top = `M ${CX} ${y0 - TOP_HALF_H} L ${CX + TOP_HALF_W} ${y0} L ${CX} ${y0 + TOP_HALF_H} L ${CX - TOP_HALF_W} ${y0} Z`;
  const left = `M ${CX - TOP_HALF_W} ${y0} L ${CX} ${y0 + TOP_HALF_H} L ${CX} ${y0 + TOP_HALF_H + SIDE_H} L ${CX - TOP_HALF_W} ${y0 + SIDE_H} Z`;
  const right = `M ${CX + TOP_HALF_W} ${y0} L ${CX} ${y0 + TOP_HALF_H} L ${CX} ${y0 + TOP_HALF_H + SIDE_H} L ${CX + TOP_HALF_W} ${y0 + SIDE_H} Z`;
  return { top, left, right };
}

/** Y positions of the three slabs' top-face centres, base unit first. */
const SLAB_YS = [148, 106, 64];

export function ServerRackIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rack-top-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-purple)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--color-brand-blue)" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="rack-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--color-brand-purple)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-brand-purple)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Floor glow */}
      <ellipse cx={CX} cy={188} rx={92} ry={20} fill="url(#rack-glow)" />

      {SLAB_YS.map((y0, i) => {
        const { top, left, right } = slabPaths(y0);
        const isTop = i === SLAB_YS.length - 1;
        return (
          <g key={y0}>
            <path
              d={left}
              fill="var(--color-surface)"
              stroke="var(--color-border-strong)"
              strokeWidth="1.5"
            />
            <path
              d={right}
              fill="var(--color-card)"
              stroke="var(--color-border-strong)"
              strokeWidth="1.5"
            />
            <path
              d={top}
              fill={isTop ? "url(#rack-top-gradient)" : "var(--color-card)"}
              stroke={isTop ? "var(--color-brand-purple)" : "var(--color-border-strong)"}
              strokeWidth="1.5"
            />

            {/* Vent slats on the right face */}
            {[0.32, 0.5, 0.68].map((t) => {
              const x1 = CX + TOP_HALF_W * (1 - t) + 4;
              const y1 = y0 + TOP_HALF_H * t + 7;
              return (
                <line
                  key={t}
                  x1={x1}
                  y1={y1}
                  x2={x1}
                  y2={y1 + SIDE_H - 14}
                  stroke="var(--color-border-strong)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              );
            })}

            {/* Status LEDs on the left face */}
            <circle cx={CX - TOP_HALF_W + 12} cy={y0 + 15} r="2.5" fill="var(--color-success)" />
            <circle cx={CX - TOP_HALF_W + 21} cy={y0 + 19.5} r="2.5" fill="var(--color-brand-blue)" />
          </g>
        );
      })}

      {/* Uplink: dashed path from the rack's top face up to a network node */}
      <path
        d={`M ${CX} ${SLAB_YS[2] - TOP_HALF_H} C ${CX + 26} ${SLAB_YS[2] - 52}, ${CX + 40} ${SLAB_YS[2] - 40}, ${CX + 58} ${SLAB_YS[2] - 58}`}
        stroke="var(--color-brand-blue)"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx={CX + 58} cy={SLAB_YS[2] - 58} r="5" fill="var(--color-brand-blue)" opacity="0.9" />
      <circle
        cx={CX + 58}
        cy={SLAB_YS[2] - 58}
        r="9.5"
        stroke="var(--color-brand-blue)"
        strokeWidth="1.5"
        opacity="0.35"
      />
    </svg>
  );
}

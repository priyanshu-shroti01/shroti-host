"use client";

/**
 * The decision trace — this page's signature device.
 *
 * The same four-stage ribbon appears under the hero, above the live demo and
 * inside the allocator section, always reading left to right in the module's
 * own order. Wherever a visitor is on the page, this is the shape they have
 * already learned, and the values under each stage are the only thing that
 * changes. Nothing here is decorative: each stage is a real step in
 * ContextBuilder -> RuleEngine -> ChargeabilityService -> InvoiceFeeApplier.
 */

export type TraceStage = {
  label: string;
  /** The live value at this stage, when there is one to show. */
  value?: string;
  hint?: string;
};

export function DecisionTrace({
  stages,
  active,
  className = "",
}: {
  stages: TraceStage[];
  /** Index of the stage currently resolving, or -1 for none. */
  active: number;
  className?: string;
}) {
  return (
    <ol
      className={`grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-4 sm:gap-x-0 ${className}`}
      aria-label="Decision trace"
    >
      {stages.map((stage, index) => {
        const isActive = index === active;
        const isPast = active > index;
        return (
          <li key={stage.label} className="relative flex items-start gap-3 sm:block">
            {/* Connector: drawn from each stage back toward the previous one. */}
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[7px] hidden h-px w-full -translate-x-1/2 transition-colors duration-500 ease-out-quart sm:block ${
                  isPast || isActive ? "bg-brand-purple/60" : "bg-border"
                }`}
              />
            )}

            <span
              aria-hidden="true"
              className={`relative z-10 mt-1 block h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-all duration-500 ease-out-quart sm:mt-0 ${
                isActive
                  ? "border-brand-purple bg-brand-purple shadow-[var(--glow-dot)]"
                  : isPast
                    ? "border-brand-purple bg-bg"
                    : "border-border-strong bg-bg"
              }`}
            />

            <div className="sm:mt-3 sm:pr-4">
              <p
                className={`text-sm font-semibold transition-colors duration-500 ${
                  isActive ? "text-brand-purple-text" : "text-text-primary"
                }`}
              >
                {stage.label}
              </p>
              {stage.value ? (
                <p className="mt-0.5 font-mono text-sm text-text-secondary tabular-nums">
                  {stage.value}
                </p>
              ) : null}
              {stage.hint ? (
                <p className="mt-0.5 text-xs text-text-muted">{stage.hint}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Compact "Coming soon" marker for nav/footer/chip contexts where a full Badge is too heavy. */
export function SoonTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-brand-purple/30 bg-brand-purple/10 px-1.5 py-px align-middle text-xs font-semibold leading-4 text-brand-purple-text ${className}`}
    >
      Soon
    </span>
  );
}

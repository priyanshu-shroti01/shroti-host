import Link from "next/link";
import Image from "next/image";

/** Both theme variants render (CSS picks one), so neither is preloaded —
 *  a preload hint for the hidden one is wasted bandwidth on every page. */
/** `eager` for the header instance: above the fold, no preload (both theme
 *  variants render and CSS picks one, so a preload would fetch both). */
export function Logo({ className = "", eager = false }: { className?: string; eager?: boolean }) {
  return (
    <Link href="/" prefetch={false} className={`inline-flex shrink-0 items-center ${className}`} aria-label="ShrotiHost home">
      <Image
        src="/logo-on-light.svg"
        alt="ShrotiHost"
        width={150}
        height={30}
        className="h-8 w-auto dark:hidden"
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
      />
      <Image
        src="/logo-on-dark.svg"
        alt="ShrotiHost"
        width={150}
        height={30}
        className="hidden h-8 w-auto dark:block"
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
      />
    </Link>
  );
}

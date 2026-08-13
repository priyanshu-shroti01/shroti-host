import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex shrink-0 items-center ${className}`} aria-label="ShrotiHost home">
      <Image
        src="/logo-on-light.svg"
        alt="ShrotiHost"
        width={150}
        height={30}
        preload
        className="h-8 w-auto dark:hidden"
      />
      <Image
        src="/logo-on-dark.svg"
        alt="ShrotiHost"
        width={150}
        height={30}
        preload
        className="hidden h-8 w-auto dark:block"
      />
    </Link>
  );
}

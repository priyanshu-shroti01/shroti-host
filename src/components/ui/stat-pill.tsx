import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

const pillClasses =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary";

export function StatPill({
  icon: Icon,
  iconClassName = "text-brand-purple",
  children,
  href,
}: {
  icon: LucideIcon;
  iconClassName?: string;
  children: ReactNode;
  href?: string;
}) {
  const content = (
    <>
      <Icon size={13} className={iconClassName} aria-hidden="true" />
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={`${pillClasses} transition-colors hover:border-brand-purple hover:text-brand-purple`}
      >
        {content}
      </a>
    );
  }

  return <span className={pillClasses}>{content}</span>;
}

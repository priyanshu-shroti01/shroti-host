"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Rocket,
  Search,
  User,
  X,
} from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/lib/navigation";

const accountLinks = [
  { label: "Login", href: "https://portal.shrotihost.in/clientarea.php", icon: User },
  { label: "Dashboard", href: "https://portal.shrotihost.in/clientarea.php", icon: LayoutDashboard },
  { label: "Billing", href: "https://portal.shrotihost.in/clientarea.php?action=invoices", icon: CreditCard },
  { label: "Support", href: "https://portal.shrotihost.in/submitticket.php", icon: LifeBuoy },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobileWasOpenRef = useRef(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (mobileOpen) {
      // The overlay is a modal: move focus in on open, back to the trigger on
      // close, so keyboard users are never stranded behind the opaque layer.
      mobileWasOpenRef.current = true;
      mobileMenuRef.current?.querySelector<HTMLElement>("[aria-label='Close menu']")?.focus();
    } else if (mobileWasOpenRef.current) {
      // Only restore focus on a real close — never on initial mount.
      mobileWasOpenRef.current = false;
      hamburgerRef.current?.focus({ preventScroll: true });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function onMobileMenuKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      setMobileOpen(false);
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <>
    <header
      id="top"
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[height] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] lg:px-8 ${
          scrolled ? "h-16" : "h-18"
        }`}
      >
        <Logo />

        <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-0.5">
          {primaryNav.map((item) => {
            const isActive = item.href ? pathname === item.href : false;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.items && setOpenMenu(item.label)}
                onMouseLeave={() => item.items && setOpenMenu(null)}
              >
                {item.items ? (
                  <button
                    type="button"
                    className={`flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-brand-purple" : "text-text-secondary hover:text-text-primary"
                    }`}
                    aria-expanded={openMenu === item.label}
                    onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown size={14} aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    href={item.href!}
                    className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                      isActive ? "text-brand-purple" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}

                <AnimatePresence>
                  {item.items && openMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, ease: [0.33, 1, 0.68, 1] }}
                      className="absolute left-0 top-full z-10 w-80 pt-2"
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                        className="rounded-2xl border border-border bg-bg p-2 shadow-xl"
                      >
                        {item.items.map((link) => (
                          <motion.div
                            key={link.href}
                            variants={{
                              hidden: { opacity: 0, y: 6 },
                              visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.33, 1, 0.68, 1] } },
                            }}
                          >
                            <Link
                              href={link.href}
                              className="group/item flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface"
                            >
                              {link.icon && (
                                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-purple/10 text-brand-purple transition-transform duration-200 group-hover/item:scale-110 group-hover/item:rotate-6">
                                  <link.icon size={15} aria-hidden="true" />
                                </span>
                              )}
                              <span>
                                <span className="block text-sm font-medium text-text-primary">{link.label}</span>
                                {link.description && (
                                  <span className="mt-0.5 block text-xs text-text-muted">{link.description}</span>
                                )}
                              </span>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="hidden lg:flex lg:items-center lg:gap-2">
          <div className="hidden items-center gap-2 xl:flex">
            <CurrencySwitcher />
            <ThemeToggle />
            <Link
              href="https://portal.shrotihost.in/clientarea.php"
              className="px-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              Login
            </Link>
          </div>
          <Button
            href="https://portal.shrotihost.in/clientarea.php"
            variant="secondary"
            size="md"
          >
            Dashboard
          </Button>
          <Button href="/hosting" size="md">
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-text-primary lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
          ref={hamburgerRef}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>
    </header>

      {/* Mobile menu overlay — deliberately OUTSIDE <header>: the scrolled
          header's backdrop-blur makes it the containing block for fixed
          descendants (the same backdrop-filter bug class fixed site-wide
          before), which trapped this fixed inset-0 overlay inside the
          header bar after any scroll. As a sibling it positions against
          the real viewport in every scroll state. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onKeyDown={onMobileMenuKeyDown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-bg lg:hidden"
          >
            <div className="flex h-18 shrink-0 items-center justify-between px-6">
              <Logo />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-text-primary"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="px-6">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-gradient-to-br from-brand-purple/15 to-brand-blue/10 p-4">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-brand-purple">
                  <Rocket size={18} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Launch in under 5 minutes</p>
                  <p className="text-xs text-text-muted">Hosting, domains, and migration in one platform</p>
                </div>
              </div>
            </div>

            <nav aria-label="Mobile" className="flex flex-col gap-1 px-6 py-4">
              {primaryNav.map((item) => {
                const isExpanded = mobileExpanded === item.label;
                if (!item.items) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href!}
                      className="flex items-center gap-3 border-b border-border py-3 text-base font-medium text-text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon size={18} className="text-brand-purple" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <div key={item.label} className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                      aria-expanded={isExpanded}
                      className="flex w-full items-center justify-between py-3"
                    >
                      <span className="flex items-center gap-3 text-base font-medium text-text-primary">
                        <item.icon size={18} className="text-brand-purple" aria-hidden="true" />
                        {item.label}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-text-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-1 pb-3 pl-9">
                            {item.items.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className="py-2 text-sm text-text-secondary"
                                onClick={() => setMobileOpen(false)}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="border-t border-border px-6 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">Account</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {accountLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-brand-purple hover:text-text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <link.icon size={16} className="text-brand-purple" aria-hidden="true" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3 px-6 py-4">
              <div className="flex items-center justify-center gap-3">
                <CurrencySwitcher />
                <ThemeToggle />
              </div>
              <Button href="/domains" variant="secondary" size="lg" className="w-full">
                <Search size={16} aria-hidden="true" />
                Search Domain
              </Button>
              <Button href="/hosting" size="lg" className="w-full">
                Launch Your Website
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

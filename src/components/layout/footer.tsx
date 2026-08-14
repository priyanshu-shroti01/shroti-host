import Link from "next/link";
import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { Logo } from "./logo";
import { Container } from "@/components/ui/container";
import { footerNav } from "@/lib/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <div className="col-span-2 sm:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-text-muted">
              Premium, developer-friendly hosting for students, startups, and growing businesses.
            </p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a
                  href="mailto:support@shrotihost.in"
                  className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  <Mail size={14} aria-hidden="true" />
                  support@shrotihost.in
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919582129099"
                  className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {Object.entries(footerNav).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-text-primary">{section}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods — text badges, no third-party logos to misrender.
            Only methods the WHMCS portal actually accepts belong here. */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-8">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
            Secure payments
          </span>
          {["UPI", "Visa", "Mastercard", "RuPay", "Net Banking"].map((method) => (
            <span
              key={method}
              className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-text-secondary"
            >
              {method}
            </span>
          ))}
          <span className="w-full text-center text-xs text-text-muted sm:w-auto">
            Prices exclude applicable taxes, calculated at checkout
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-text-muted">© {year} ShrotiHost. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p className="text-sm text-text-muted">Made for students, developers, and builders.</p>
            <a
              href="#top"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              Back to top
              <ArrowUp size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

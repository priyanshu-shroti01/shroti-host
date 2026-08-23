import Link from "next/link";
import { ArrowUp, Mail, MessageCircle } from "lucide-react";
import { Logo } from "./logo";
import { Container } from "@/components/ui/container";
import { footerNav } from "@/lib/navigation";
import { SoonTag } from "@/components/ui/soon-tag";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-6">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-text-muted">
              Premium hosting and software development for students, startups, and growing
              businesses — one partner from first domain to production.
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
              {/* Column labels are not document headings — the page's own
                  h1/h2 outline must not be preceded by footer h3s. */}
              <p className="text-sm font-semibold text-text-primary">{section}</p>
              <ul className="mt-2.5 space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={false}
                      className="inline-block py-2.5 text-sm leading-snug text-text-muted transition-colors hover:text-text-primary"
                    >
                      {link.label}
                      {"comingSoon" in link && link.comingSoon && <SoonTag className="ml-2" />}
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

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 pb-16 md:flex-row md:pb-0 md:pr-20">
          <p className="text-sm text-text-muted">
            © {year} ShrotiHost · a brand of Shroti Enterprises, Ruheri, Hathras, Uttar Pradesh
            204101, India · Udyam Reg. UDYAM-UP-36-0017127
          </p>
          <div className="flex items-center gap-6">
            <p className="text-sm text-text-muted">Made for students, developers, and builders.</p>
            <a
              href="#top"
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
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

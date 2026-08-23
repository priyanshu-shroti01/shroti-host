import { Check, X } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/**
 * The "others" column describes what is common on entry-level shared plans,
 * not a claim about any named host — the majors differ plan by plan, so the
 * wording stays general ("Varies by host") and the footnote dates the check.
 */
const COMPARED_ON = "Aug 2026";

const rows = [
  { feature: "NVMe SSD Storage", us: true, others: "Varies by host" },
  { feature: "LiteSpeed Web Server", us: true, others: "Usually Apache/Nginx" },
  { feature: "Free SSL — All Plans", us: true, others: "Varies by host" },
  { feature: "DDoS + Imunify360", us: true, others: "Varies by host" },
  { feature: "SSH Terminal Access", us: true, others: "Varies by host" },
  { feature: "Python / Node.js / PHP", us: true, others: "Varies by host" },
  { feature: "Daily Backups — Free", us: true, others: "Often a paid add-on" },
  { feature: "Free Website Migration", us: true, others: "Varies by host" },
  { feature: "Same Renewal Price", us: true, others: "Often increases" },
];

export function ComparisonTable() {
  return (
    <Reveal>
      {/* Split composition: the statement sits left, the evidence right. */}
      <div className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-14">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            ShrotiHost vs. typical shared hosting
          </h2>
          <p className="mt-4 text-text-secondary">
            What you actually get on every plan, compared with what entry-level shared hosting
            usually includes.
          </p>
          <p className="mt-6 text-xs text-text-muted">
            Compared against public plan pages, {COMPARED_ON}. Inclusions on other hosts change by
            plan and over time — check the host&apos;s own page before you decide.
          </p>
        </div>

        <div className="overflow-hidden overflow-x-auto rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <p className="px-5 pt-3 text-xs text-text-muted sm:hidden" aria-hidden="true">
            Swipe sideways to see all columns →
          </p>
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/60">
                <th scope="col" className="sticky left-0 z-10 bg-card px-5 py-3 font-medium text-text-secondary">
                  Feature
                </th>
                <th scope="col" className="border-t-2 border-brand-purple bg-brand-purple/10 px-5 py-3 text-center font-semibold text-brand-purple-text">
                  ShrotiHost
                </th>
                <th scope="col" className="px-5 py-3 text-center font-medium text-text-muted">
                  Typical shared plans
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`transition-colors duration-150 hover:bg-brand-purple/5 ${i % 2 === 1 ? "bg-surface/30" : ""}`}
                >
                  <td className="sticky left-0 z-10 bg-card px-5 py-3 text-text-primary">{row.feature}</td>
                  <td className="bg-brand-purple/[0.06] px-5 py-3 text-center">
                    <Check size={16} className="mx-auto text-success" aria-hidden="true" />
                    <span className="sr-only">Included</span>
                  </td>
                  <td className="px-5 py-3 text-center text-xs text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <X size={13} className="text-error" aria-hidden="true" />
                      {row.others}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Reveal>
  );
}

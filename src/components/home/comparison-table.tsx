import { Check, X } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const rows = [
  { feature: "NVMe SSD Storage", us: true, others: "Often HDD/SATA" },
  { feature: "LiteSpeed Web Server", us: true, others: "Usually Apache" },
  { feature: "Free SSL — All Plans", us: true, others: "Limited or paid" },
  { feature: "DDoS + Imunify360", us: true, others: "Basic or none" },
  { feature: "SSH Terminal Access", us: true, others: "Not on shared plans" },
  { feature: "Python / Node.js / PHP", us: true, others: "Rarely supported" },
  { feature: "Daily Backups — Free", us: true, others: "Often a paid add-on" },
  { feature: "Free Website Migration", us: true, others: "DIY or paid" },
  { feature: "Same Renewal Price", us: true, others: "Often increases" },
];

export function ComparisonTable() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">ShrotiHost</span> vs. typical shared hosting
        </h2>
        <p className="mt-4 text-text-secondary">
          What you actually get, compared to the industry default.
        </p>
      </div>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-12 max-w-2xl overflow-hidden overflow-x-auto rounded-2xl border-2 border-border bg-card shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/60">
                <th scope="col" className="px-5 py-3 font-medium text-text-secondary">
                  Feature
                </th>
                <th scope="col" className="border-t-2 border-brand-purple bg-brand-purple/10 px-5 py-3 text-center font-semibold text-brand-purple">
                  ShrotiHost
                </th>
                <th scope="col" className="px-5 py-3 text-center font-medium text-text-muted">
                  Typical hosts
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`transition-colors duration-150 hover:bg-brand-purple/5 ${i % 2 === 1 ? "bg-surface/30" : ""}`}
                >
                  <td className="px-5 py-3 text-text-primary">{row.feature}</td>
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
      </Reveal>
    </div>
  );
}

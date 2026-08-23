import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import type { Plan } from "@/lib/plans";
import type { SpecGroup } from "@/lib/plan-specs";

/**
 * The full spec matrix for a hosting line — every number and inclusion per
 * tier, grouped, with nothing hidden behind a "see more". Static server
 * markup; horizontal scroll on small screens.
 */
export function PlanSpecTable({ plans, groups }: { plans: Plan[]; groups: SpecGroup[] }) {
  const recIndex = plans.findIndex((p) => p.recommended);
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Every spec, in the open.
        </h2>
        <p className="mt-4 text-text-secondary">
          The full resource and feature matrix — the numbers most hosts keep behind a support
          ticket.
        </p>
      </div>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-12 max-w-4xl overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/60">
                <th scope="col" className="px-5 py-3.5 font-medium text-text-secondary">
                  Specification
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.name}
                    scope="col"
                    className={`px-4 py-3.5 text-center font-semibold ${
                      plan.recommended
                        ? "border-t-2 border-brand-purple bg-brand-purple/10 text-brand-purple-text"
                        : "text-text-primary"
                    }`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group.title}>
                <tr className="border-y border-border bg-surface-raised/40">
                  <th
                    scope="rowgroup"
                    colSpan={plans.length + 1}
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-brand-purple-text"
                  >
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row, i) => {
                  const values =
                    typeof row.values === "string"
                      ? Array.from({ length: plans.length }, () => row.values as string)
                      : row.values;
                  return (
                    <tr
                      key={row.label}
                      className={`transition-colors duration-150 hover:bg-brand-purple/5 ${
                        i % 2 === 1 ? "bg-surface/20" : ""
                      }`}
                    >
                      <td className="px-5 py-2.5 text-text-secondary">{row.label}</td>
                      {values.map((value, j) => (
                        <td
                          key={j}
                          className={`px-4 py-2.5 text-center text-text-primary ${
                            j === recIndex ? "bg-brand-purple/[0.06]" : ""
                          }`}
                        >
                          {value === "✓" ? (
                            <>
                              <Check size={15} className="mx-auto text-success" aria-hidden="true" />
                              <span className="sr-only">Included</span>
                            </>
                          ) : (
                            value
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      </Reveal>
    </div>
  );
}

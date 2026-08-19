import { MapPin, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplySection } from "@/components/careers/apply-form";
import type { CareerRole } from "@/lib/careers";

const teamTone = { Support: "success", Engineering: "purple", Growth: "blue" } as const;

export function RoleCard({ role }: { role: CareerRole }) {

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={teamTone[role.team]}>{role.team}</Badge>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <Briefcase size={12} aria-hidden="true" /> {role.type}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted">
          <MapPin size={12} aria-hidden="true" /> {role.location}
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-text-primary">{role.title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{role.summary}</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted">You&apos;ll own</h4>
          <ul className="mt-2 space-y-1.5">
            {role.responsibilities.map((r) => (
              <li key={r} className="text-sm text-text-secondary">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-text-muted">You bring</h4>
          <ul className="mt-2 space-y-1.5">
            {role.lookingFor.map((r) => (
              <li key={r} className="text-sm text-text-secondary">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1" />
      <ApplySection roleSlug={role.slug} roleTitle={role.title} />
    </Card>
  );
}

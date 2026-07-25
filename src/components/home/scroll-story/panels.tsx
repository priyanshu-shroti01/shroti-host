import type { RefCallback } from "react";
import { Check, Cloud, Lock, Search, Server, Zap } from "lucide-react";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { dnsRecordsFor, deploySteps, sampleTraffic, scalingTiers, storySuggestions } from "./data";

type RegisterEl = <T extends Element = HTMLElement>(name: string) => RefCallback<T>;

export function DomainPanel({
  registerEl,
  domain,
  domainInput,
  onDomainInput,
}: {
  registerEl: RegisterEl;
  domain: string;
  domainInput: string;
  onDomainInput: (value: string) => void;
}) {
  const suggestions = storySuggestions(domainInput || "yourbrand");
  return (
    <div className="flex w-full max-w-xl flex-col items-center px-4 text-center">
      <p className="font-mono text-sm text-brand-blue">shrotihost.in</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">
        Every website starts with a name.
      </h3>
      <div
        ref={registerEl("domain-search-box")}
        className="mt-8 flex w-full items-center gap-2 rounded-2xl border border-border-strong bg-card px-4 py-3 shadow-2xl"
      >
        <Search size={16} className="shrink-0 text-text-muted" aria-hidden="true" />
        <input
          type="text"
          value={domainInput}
          onChange={(e) => onDomainInput(e.target.value)}
          placeholder="yourbrand"
          aria-label="Search a domain name"
          className="w-full min-w-0 bg-transparent font-mono text-sm text-text-primary placeholder:text-text-muted focus:outline-none sm:text-base"
        />
        <span className="hidden shrink-0 rounded-lg bg-brand-purple/10 px-2.5 py-1 font-mono text-xs text-brand-purple sm:inline">
          {domain}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {suggestions.map((s) => (
          <span
            key={s}
            className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-muted"
          >
            {s}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-text-muted">Ideas to explore — availability confirmed at checkout.</p>
    </div>
  );
}

export function DnsPanel({ registerEl, domain }: { registerEl: RegisterEl; domain: string }) {
  const records = dnsRecordsFor(domain);
  return (
    <div className="flex w-full max-w-lg flex-col items-center px-4 text-center">
      <p className="font-mono text-sm text-brand-blue">DNS</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">
        Point <span className="text-brand-purple">{domain}</span> anywhere.
      </h3>
      <div className="mt-8 w-full overflow-hidden rounded-2xl border border-border-strong bg-card shadow-2xl">
        <div className="grid grid-cols-3 gap-2 border-b border-border bg-surface-raised px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wide text-text-muted">
          <span>Type</span>
          <span>Name</span>
          <span>Value</span>
        </div>
        {records.map((r, i) => (
          <div
            key={r.type}
            ref={registerEl(`dns-row-${i}`)}
            className="grid grid-cols-3 items-center gap-2 border-b border-border px-4 py-3 text-left font-mono text-xs last:border-0"
          >
            <span className="w-fit rounded-md border border-brand-blue/30 bg-brand-blue/10 px-2 py-0.5 text-brand-blue">
              {r.type}
            </span>
            <span className="text-text-primary">{r.name}</span>
            <span className="truncate text-text-secondary">{r.value}</span>
          </div>
        ))}
      </div>
      <div ref={registerEl("dns-status")} className="mt-4 flex items-center gap-2 text-sm text-success">
        <Check size={15} aria-hidden="true" />
        Nameservers propagated
      </div>
    </div>
  );
}

export function DeployPanel({
  registerEl,
  domain,
  complete = false,
}: {
  registerEl: RegisterEl;
  domain: string;
  complete?: boolean;
}) {
  return (
    <div className="flex w-full max-w-sm flex-col items-center px-4 text-center">
      <p className="font-mono text-sm text-brand-blue">Deploy</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">Go live in seconds.</h3>
      <div className="mt-8 w-full overflow-hidden rounded-2xl border border-border-strong bg-card text-left shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-surface-raised px-5 py-3">
          <span className="font-mono text-xs text-text-secondary">{domain}</span>
          <Cloud size={14} className="text-brand-blue" aria-hidden="true" />
        </div>
        <div className="space-y-1 p-5">
          {deploySteps.map((step, i) => (
            <div
              key={step.label}
              ref={registerEl(`deploy-step-${i}`)}
              className={`flex items-center gap-3 rounded-xl px-2 py-2.5 ${complete ? "opacity-100" : "opacity-40"}`}
            >
              <div className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-text-disabled">
                {i === 0 ? <Server size={15} aria-hidden="true" /> : i === 1 ? <Lock size={15} aria-hidden="true" /> : <Zap size={15} aria-hidden="true" />}
                <span
                  ref={registerEl(`deploy-check-${i}`)}
                  className={`absolute inset-0 flex items-center justify-center rounded-lg border border-success/40 bg-success/10 text-success ${complete ? "opacity-100" : "opacity-0"}`}
                >
                  <Check size={15} aria-hidden="true" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-secondary">{step.label}</p>
                <p className="truncate font-mono text-xs text-text-muted">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardPanel({ registerEl, domain }: { registerEl: RegisterEl; domain: string }) {
  return (
    <div className="w-full max-w-2xl px-4">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-mono text-sm text-brand-blue">Dashboard</p>
        <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">Your command center.</h3>
      </div>
      <div className="mt-8">
        <BrowserFrame url={domain}>
          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-4 sm:col-span-2">
              <p className="text-xs font-medium text-text-muted">Traffic</p>
              <svg viewBox="0 0 300 70" className="mt-2 h-16 w-full" preserveAspectRatio="none">
                <path
                  ref={registerEl<SVGPathElement>("dashboard-sparkline")}
                  d="M0,60 L27,50 L54,54 L82,36 L109,40 L136,20 L163,26 L191,10 L218,16 L245,4 L272,10 L300,0"
                  fill="none"
                  stroke="#a810c7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-base font-semibold text-success">Active</p>
                <p className="text-[11px] text-text-muted">Hosting status</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-base font-semibold text-text-primary">Grow</p>
                <p className="text-[11px] text-text-muted">Current plan</p>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}

export function AnalyticsPanel({ registerEl, complete = false }: { registerEl: RegisterEl; complete?: boolean }) {
  return (
    <div className="w-full max-w-2xl px-4 text-center">
      <p className="font-mono text-sm text-brand-blue">Analytics</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">Watch it grow.</h3>
      <p className="mt-2 text-xs text-text-muted">Illustrative sample data</p>
      <div className="mx-auto mt-8 flex h-48 w-full max-w-lg items-end justify-between gap-1.5 rounded-2xl border border-border-strong bg-card p-6 shadow-2xl sm:gap-2">
        {sampleTraffic.map((v, i) => (
          <div
            key={i}
            ref={registerEl(`analytics-bar-${i}`)}
            style={{ height: `${v}%`, transform: complete ? "scaleY(1)" : "scaleY(0)", transformOrigin: "bottom" }}
            className="w-full min-w-0 flex-1 rounded-t-sm bg-gradient-to-t from-brand-purple to-brand-blue"
          />
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-8">
        <div>
          <p ref={registerEl("analytics-visits")} className="text-2xl font-semibold tabular-nums text-text-primary">
            {complete ? "48,200" : "0"}
          </p>
          <p className="text-xs text-text-muted">Monthly visits</p>
        </div>
        <div>
          <p ref={registerEl("analytics-uptime")} className="text-2xl font-semibold tabular-nums text-text-primary">
            {complete ? "99.98%" : "0%"}
          </p>
          <p className="text-xs text-text-muted">Uptime</p>
        </div>
      </div>
    </div>
  );
}

export function ScalingPanel({ registerEl, complete = false }: { registerEl: RegisterEl; complete?: boolean }) {
  return (
    <div className="w-full max-w-2xl px-4 text-center">
      <p className="font-mono text-sm text-brand-blue">Scaling</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">Built to scale with you.</h3>
      <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
        {scalingTiers.map((tier, i) => (
          <div
            key={tier.plan}
            ref={registerEl(`scaling-tier-${i}`)}
            className={`rounded-2xl border border-border-strong bg-card p-4 shadow-xl ${complete ? "opacity-100" : "opacity-40"}`}
          >
            <p data-role="plan" className="text-sm font-semibold text-text-primary">
              {tier.plan}
            </p>
            <div className="mt-3 flex justify-center gap-1">
              {Array.from({ length: i + 1 }).map((_, b) => (
                <span
                  key={b}
                  ref={registerEl(`scaling-block-${i}-${b}`)}
                  className={`h-6 w-3 rounded-sm bg-gradient-to-t from-brand-purple to-brand-blue ${complete ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>
            <p className="mt-3 text-[11px] text-text-muted">
              {typeof tier.sites === "number" ? `${tier.sites} site${tier.sites > 1 ? "s" : ""}` : tier.sites}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

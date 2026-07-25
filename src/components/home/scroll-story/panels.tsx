import type { RefCallback } from "react";
import { Check, Globe, Lock, Search, Server, ShieldCheck } from "lucide-react";
import { BrowserFrame } from "@/components/ui/browser-frame";
import {
  dnsRecordsFor,
  journeySteps,
  sampleTraffic,
  scalingTiers,
  serverSpecs,
  sslAuthority,
  storySuggestions,
} from "./data";

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

export function ServerPanel({
  registerEl,
  domain,
  complete = false,
}: {
  registerEl: RegisterEl;
  domain: string;
  complete?: boolean;
}) {
  return (
    <div className="flex w-full max-w-lg flex-col items-center px-4 text-center">
      <p className="font-mono text-sm text-brand-blue">Server</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">Launching your server.</h3>
      <div className="mt-8 flex w-full flex-col items-center gap-6 rounded-2xl border border-border-strong bg-card p-8 shadow-2xl">
        <div
          ref={registerEl("server-ring")}
          className="relative inline-flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-brand-purple/30 bg-brand-purple/5 text-brand-purple"
          style={{ transform: complete ? "scale(1)" : "scale(0.85)" }}
        >
          <Server size={32} aria-hidden="true" />
        </div>
        <p className="font-mono text-xs text-text-muted">{domain}</p>
        <div className="grid w-full grid-cols-2 gap-2">
          {serverSpecs.map((spec, i) => (
            <div
              key={spec}
              ref={registerEl(`server-tag-${i}`)}
              className={`flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-left ${
                complete ? "opacity-100" : "opacity-0"
              }`}
            >
              <Check size={13} className="shrink-0 text-success" aria-hidden="true" />
              <span className="truncate text-xs text-text-secondary">{spec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DnsPanel({ registerEl, domain }: { registerEl: RegisterEl; domain: string }) {
  const records = dnsRecordsFor(domain);
  return (
    <div className="flex w-full max-w-lg flex-col items-center px-4 text-center">
      <p className="font-mono text-sm text-brand-blue">DNS</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">
        Point <span className="text-brand-purple">{domain}</span> at your server.
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

export function SslPanel({
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
      <p className="font-mono text-sm text-brand-blue">SSL</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">Encrypting your connection.</h3>
      <div className="relative mt-8 flex w-full flex-col items-center gap-4 rounded-2xl border border-border-strong bg-card p-8 shadow-2xl">
        {/* Pending and done states are separate layers, cross-faded by opacity — icons/text can't be scroll-tweened directly. */}
        <div
          ref={registerEl("ssl-pending")}
          className={`flex flex-col items-center gap-4 ${complete ? "opacity-0" : "opacity-100"}`}
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-border text-text-disabled">
            <ShieldCheck size={26} aria-hidden="true" />
          </div>
          <p className="font-mono text-sm text-text-primary">{domain}</p>
          <p className="text-xs text-text-muted">Requesting certificate from {sslAuthority}…</p>
        </div>
        <div
          ref={registerEl("ssl-done")}
          className={`absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 ${complete ? "opacity-100" : "opacity-0"}`}
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-success/40 bg-success/10 text-success">
            <Lock size={26} aria-hidden="true" />
          </div>
          <p className="font-mono text-sm text-text-primary">https://{domain}</p>
          <p className="text-xs text-text-muted">Secured — issued by {sslAuthority}</p>
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

export function MonitorPanel({ registerEl, complete = false }: { registerEl: RegisterEl; complete?: boolean }) {
  return (
    <div className="w-full max-w-2xl px-4 text-center">
      <p className="font-mono text-sm text-brand-blue">Monitor</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">Watch it live.</h3>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-text-muted">
        <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
        Illustrative sample data
      </p>
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

export function ScalePanel({ registerEl, complete = false }: { registerEl: RegisterEl; complete?: boolean }) {
  return (
    <div className="w-full max-w-2xl px-4 text-center">
      <p className="font-mono text-sm text-brand-blue">Scale</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">Scale resources on demand.</h3>
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

export function SuccessPanel({ registerEl, domain }: { registerEl: RegisterEl; domain: string }) {
  return (
    <div className="flex w-full max-w-lg flex-col items-center px-4 text-center">
      <div
        ref={registerEl("success-check")}
        className="inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-success/40 bg-success/10 text-success"
      >
        <Check size={28} aria-hidden="true" />
      </div>
      <p className="mt-6 flex items-center gap-2 font-mono text-lg text-text-primary sm:text-2xl">
        <Globe size={18} className="text-brand-purple" aria-hidden="true" />
        https://{domain}
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary sm:text-4xl">is live.</h3>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {journeySteps.map((step) => (
          <span
            key={step}
            className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/5 px-3 py-1 text-xs font-medium text-success"
          >
            <Check size={11} aria-hidden="true" />
            {step}
          </span>
        ))}
      </div>
      <p className="mt-6 text-sm text-text-muted">Pick a plan below to make it real.</p>
    </div>
  );
}

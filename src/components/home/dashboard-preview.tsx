"use client";

import { useId, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CreditCard,
  Database,
  FileText,
  Folder,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  File as FileIcon,
  Search,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { BrowserFrame } from "@/components/ui/browser-frame";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "domains", label: "Domains", icon: Globe },
  { id: "dns", label: "DNS", icon: Database },
  { id: "support", label: "Support", icon: LifeBuoy },
  { id: "files", label: "File Manager", icon: Server },
];

const trafficData = [32, 46, 40, 58, 52, 74, 66, 80, 88, 76, 92, 86];

function AreaChart() {
  const gradientId = useId();
  const width = 300;
  const height = 90;
  const max = Math.max(...trafficData);
  const points = trafficData.map((v, i) => {
    const x = (i / (trafficData.length - 1)) * width;
    const y = height - (v / max) * height;
    return [x, y] as const;
  });
  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a810c7" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a810c7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke="#a810c7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.33, 1, 0.68, 1] }}
      />
    </svg>
  );
}

function UsageMeter({ label, percent }: { label: string; percent: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="font-medium text-text-primary">{percent}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-blue"
          initial={{ width: "0%" }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        />
      </div>
    </div>
  );
}

function OverviewPanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-4 sm:col-span-2">
          <p className="text-xs font-medium text-text-muted">Traffic (30 days)</p>
          <div className="mt-3">
            <AreaChart />
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="text-lg font-semibold text-success">Active</p>
            <p className="text-[11px] text-text-muted">Hosting status</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <p className="text-lg font-semibold text-text-primary">Grow</p>
            <p className="text-[11px] text-text-muted">Current plan</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
        <UsageMeter label="Storage — 50 GB" percent={34} />
        <UsageMeter label="Bandwidth" percent={58} />
      </div>
    </div>
  );
}

function BillingPanel() {
  const invoices = [
    { id: "INV-0004", date: "1 Jul", status: "Paid" as const },
    { id: "INV-0003", date: "1 Jun", status: "Paid" as const },
    { id: "INV-0002", date: "1 May", status: "Paid" as const },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-3 gap-2 border-b border-border bg-surface px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">
        <span>Invoice</span>
        <span>Date</span>
        <span className="text-right">Status</span>
      </div>
      {invoices.map((inv) => (
        <div key={inv.id} className="grid grid-cols-3 items-center gap-2 border-b border-border px-4 py-3 last:border-0">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-text-muted" aria-hidden="true" />
            <span className="font-mono text-xs text-text-primary">{inv.id}</span>
          </div>
          <span className="text-xs text-text-secondary">{inv.date}</span>
          <div className="text-right">
            <Badge tone="success">{inv.status}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function DomainsPanel() {
  const domains = [
    { name: "yourbrand.com", expiry: "Renews in 8 months" },
    { name: "yourbrand.in", expiry: "Renews in 3 months" },
  ];
  return (
    <div className="space-y-2">
      {domains.map((d) => (
        <div
          key={d.name}
          className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-text-muted" aria-hidden="true" />
            <div>
              <p className="font-mono text-sm text-text-primary">{d.name}</p>
              <p className="text-[11px] text-text-muted">{d.expiry}</p>
            </div>
          </div>
          <Badge tone="purple">Active</Badge>
        </div>
      ))}
    </div>
  );
}

function DnsPanel() {
  const records = [
    { type: "A", name: "@", value: "192.0.2.10" },
    { type: "CNAME", name: "www", value: "yourbrand.com" },
    { type: "MX", name: "@", value: "mail.yourbrand.com" },
    { type: "TXT", name: "@", value: "v=spf1 include:_spf…" },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-3 gap-2 border-b border-border bg-surface px-4 py-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">
        <span>Type</span>
        <span>Name</span>
        <span>Value</span>
      </div>
      {records.map((r) => (
        <div key={r.type + r.name} className="grid grid-cols-3 items-center gap-2 border-b border-border px-4 py-2.5 font-mono text-xs last:border-0">
          <Badge tone="neutral" className="w-fit">{r.type}</Badge>
          <span className="text-text-primary">{r.name}</span>
          <span className="truncate text-text-secondary">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function SupportPanel() {
  const tickets = [
    { id: "#1024", subject: "SSL certificate question", status: "Open" as const },
    { id: "#1019", subject: "Migration request", status: "Resolved" as const },
  ];
  return (
    <div className="space-y-2">
      {tickets.map((t) => (
        <div
          key={t.id}
          className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3"
        >
          <span className="text-sm text-text-primary">
            <span className="text-text-muted">{t.id}</span> — {t.subject}
          </span>
          <Badge tone={t.status === "Open" ? "purple" : "success"}>{t.status}</Badge>
        </div>
      ))}
    </div>
  );
}

function FilesPanel() {
  const items = [
    { icon: Folder, label: "public_html" },
    { icon: Folder, label: "logs" },
    { icon: Folder, label: "backups" },
    { icon: FileIcon, label: "wp-config.php" },
    { icon: FileIcon, label: "index.html" },
    { icon: FileIcon, label: ".htaccess" },
  ];
  return (
    <div>
      <p className="mb-3 font-mono text-[11px] text-text-muted">/ public_html /</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-surface p-3 text-center"
          >
            <item.icon size={20} className="text-brand-purple" aria-hidden="true" />
            <span className="truncate text-[10px] text-text-secondary">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const panels: Record<string, ComponentType> = {
  overview: OverviewPanel,
  billing: BillingPanel,
  domains: DomainsPanel,
  dns: DnsPanel,
  support: SupportPanel,
  files: FilesPanel,
};

export function DashboardPreview() {
  const [active, setActive] = useState("overview");
  const ActivePanel = panels[active];

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Client Dashboard</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Manage everything from one place.
        </h2>
        <p className="mt-4 text-text-secondary">Available today, through your billing portal.</p>
      </div>

      <Reveal delay={0.1}>
        <div className="relative mx-auto mt-12 max-w-4xl">
          <Badge tone="neutral" className="absolute -top-3 right-4 z-10">
            Design preview
          </Badge>
          <BrowserFrame url="portal.shrotihost.in">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <div className="hidden items-center gap-2 rounded-full bg-surface px-3 py-1.5 sm:flex">
                <Search size={12} className="text-text-muted" aria-hidden="true" />
                <span className="text-xs text-text-muted">Search services…</span>
              </div>
              <div className="flex items-center gap-3">
                <Bell size={14} className="text-text-muted" aria-hidden="true" />
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue" />
              </div>
            </div>
            <div className="flex">
              <div className="hidden w-40 shrink-0 space-y-1 border-r border-border p-3 sm:block">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActive(tab.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                      active === tab.id ? "bg-brand-purple/10 text-brand-purple" : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    <tab.icon size={14} aria-hidden="true" />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="min-h-[18rem] flex-1 p-5">
                <div className="mb-3 flex gap-1 overflow-x-auto sm:hidden">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActive(tab.id)}
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        active === tab.id ? "bg-brand-purple text-white" : "bg-surface text-text-muted"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: [0.33, 1, 0.68, 1] }}
                  >
                    <ActivePanel />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </BrowserFrame>
          <p className="mt-3 text-center text-xs text-text-muted">
            Illustrative preview. Manage your real account at{" "}
            <a href="https://portal.shrotihost.in" className="underline hover:text-text-secondary">
              portal.shrotihost.in
            </a>
            .
          </p>
          <div className="mt-6 flex justify-center">
            <Button href="https://portal.shrotihost.in/clientarea.php" size="lg">
              Open Dashboard
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

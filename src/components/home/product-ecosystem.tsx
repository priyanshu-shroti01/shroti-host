import Link from "next/link";
import {
  ArrowUpRight,
  Cloud,
  Code2,
  Globe2,
  GraduationCap,
  LayoutGrid,
  Layers,
  Mail,
  Server,
  Share2,
  Truck,
  Zap,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";

const featured = {
  icon: Server,
  title: "Shared Hosting",
  description:
    "Launch, Grow, and Scale plans on LiteSpeed and NVMe storage — the foundation everything else builds on.",
  href: "/hosting",
};

const products = [
  {
    icon: Globe2,
    title: "WordPress Hosting",
    description: "Tuned for WordPress & WooCommerce.",
    href: "/wordpress-hosting",
  },
  {
    icon: Layers,
    title: "Domains",
    description: "Search, register, and manage domains.",
    href: "/domains",
  },
  {
    icon: Truck,
    title: "Migration",
    description: "We move your site from any host, free.",
    href: "/migration",
  },
  {
    icon: GraduationCap,
    title: "Student Hosting",
    description: "Discounted plans, free launch subdomain.",
    href: "/student",
  },
  {
    icon: Mail,
    title: "Email Hosting",
    description: "Business mailboxes on your own domain.",
    href: "/hosting#developer",
  },
  {
    icon: LayoutGrid,
    title: "WHMCS Modules",
    description: "Gateway fees, WhatsApp billing alerts, and more — built for WHMCS admins.",
    href: "/modules",
  },
];

const wide = {
  icon: Code2,
  title: "Developer Hosting",
  description: "Node.js, Python, PHP, Git, SSH, and cron — ready out of the box on every plan.",
  href: "/hosting#developer",
};

const roadmap = [
  { icon: Server, label: "VPS", href: "/vps" },
  { icon: Cloud, label: "Cloud Hosting" },
  { icon: Share2, label: "Reseller Hosting" },
  { icon: Zap, label: "API" },
];

export function ProductEcosystem() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          One platform, everything you need to launch
        </h2>
        <p className="mt-4 text-text-secondary">
          Designed to work together, not bolted on as afterthoughts.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-4 lg:grid-rows-2">
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <SpotlightCard className="h-full">
            <Link href={featured.href} className="flex h-full flex-col justify-between p-8">
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple/25 to-brand-blue/20 text-brand-purple transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110">
                  <featured.icon size={26} aria-hidden="true" />
                </div>
                <Badge tone="purple" className="ml-3 align-middle">
                  Flagship
                </Badge>
                <h3 className="mt-5 text-xl font-semibold text-text-primary">{featured.title}</h3>
                <p className="mt-2 max-w-sm text-sm text-text-secondary">{featured.description}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-purple">
                Explore plans
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>
          </SpotlightCard>
        </Reveal>

        {products.slice(0, 2).map((product, i) => (
          <Reveal key={product.title} delay={(i + 1) * 0.08}>
            <SpotlightCard className="h-full">
              <Link href={product.href} className="flex h-full flex-col p-6">
                <ProductCardBody product={product} />
              </Link>
            </SpotlightCard>
          </Reveal>
        ))}

        <Reveal delay={0.24} className="lg:col-span-2">
          <SpotlightCard className="h-full">
            <Link href={wide.href} className="flex h-full items-center gap-5 p-6">
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 text-brand-purple transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110">
                <wide.icon size={22} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-text-primary">{wide.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{wide.description}</p>
              </div>
              <ArrowUpRight size={18} className="shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </SpotlightCard>
        </Reveal>

        {products.slice(2).map((product, i) => (
          <Reveal key={product.title} delay={(i + 3) * 0.08}>
            <SpotlightCard className="h-full">
              <Link href={product.href} className="flex h-full flex-col p-6">
                <ProductCardBody product={product} />
              </Link>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-dashed border-border-strong p-5">
          <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
            On the roadmap
          </span>
          {roadmap.map((item) => {
            const className =
              "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors";
            return item.href ? (
              <Link key={item.label} href={item.href} className={`${className} hover:border-brand-purple hover:text-brand-purple`}>
                <item.icon size={13} aria-hidden="true" />
                {item.label}
              </Link>
            ) : (
              <span key={item.label} className={className}>
                <item.icon size={13} aria-hidden="true" />
                {item.label}
              </span>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}

function ProductCardBody({ product }: { product: (typeof products)[number] }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 text-brand-purple transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110">
          <product.icon size={22} aria-hidden="true" />
        </div>
        <ArrowUpRight
          size={18}
          className="text-text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-purple group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-primary">{product.title}</h3>
      <p className="mt-2 flex-1 text-sm text-text-secondary">{product.description}</p>
    </>
  );
}

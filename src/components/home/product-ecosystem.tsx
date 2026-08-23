import Link from "next/link";
import {
  ArrowUpRight,
  Infinity as InfinityIcon,
  Building2,
  Cloud,
  Globe2,
  Layers,
  Server,
  Share2,
  Zap,
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { ServerRackIllustration } from "@/components/ui/server-rack-illustration";
import { SoonTag } from "@/components/ui/soon-tag";

const featured = {
  icon: Server,
  title: "Shared Hosting",
  description:
    "Bronze, Gold, Platinum, and Diamond plans on LiteSpeed and NVMe storage — the foundation everything else builds on.",
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
    icon: Share2,
    title: "Reseller Hosting",
    description: "Start your own hosting business on our stack.",
    href: "/reseller-hosting",
  },
  {
    icon: InfinityIcon,
    title: "Unlimited Hosting",
    description: "One plan, as many sites as you run.",
    href: "/unlimited-hosting",
  },
];



const roadmap = [
  { icon: Server, label: "VPS", href: "/vps" },
  { icon: Building2, label: "Master Reseller", href: "/master-reseller-hosting" },
  { icon: Layers, label: "Alpha Reseller", href: "/alpha-reseller-hosting" },
  { icon: Cloud, label: "Cloud Hosting" },
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

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <SpotlightCard className="h-full">
            <Link href={featured.href} className="flex h-full flex-col justify-between p-8">
              <ServerRackIllustration className="pointer-events-none absolute -bottom-6 -right-4 hidden w-52 opacity-90 sm:block transition-transform duration-300 ease-out group-hover:-translate-y-1.5 sm:w-64" />
              <div className="relative sm:pr-56 lg:pr-60">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple/25 to-brand-blue/20 text-brand-purple transition-transform duration-200 group-hover:rotate-6 group-hover:scale-110">
                  <featured.icon size={26} aria-hidden="true" />
                </div>
                <Badge tone="purple" className="ml-3 align-middle">
                  Flagship
                </Badge>
                <h3 className="mt-5 text-xl font-semibold text-text-primary">{featured.title}</h3>
                <p className="mt-2 max-w-sm text-sm text-text-secondary">{featured.description}</p>
              </div>
              <span className="relative z-10 mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-purple-text">
                Explore plans
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </Link>
          </SpotlightCard>
        </Reveal>

        {products.map((product, i) => (
          <Reveal key={product.title} delay={(i + 1) * 0.08}>
            <SpotlightCard className="h-full">
              <Link href={product.href} prefetch={false} className="flex h-full flex-col p-6">
                <ProductCardBody product={product} />
              </Link>
            </SpotlightCard>
          </Reveal>
        ))}


      </div>


      <Reveal delay={0.24}>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-dashed border-border-strong p-5">
          <span className="text-xs font-semibold text-text-muted">On the roadmap</span>
          {roadmap.map((item) => {
            const className = "chip";
            return item.href ? (
              <Link key={item.label} href={item.href} prefetch={false} className={className}>
                <item.icon size={13} aria-hidden="true" />
                {item.label}
                <SoonTag />
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
          className="text-text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-purple"
          aria-hidden="true"
        />
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-primary">{product.title}</h3>
      <p className="mt-2 flex-1 text-sm text-text-secondary">{product.description}</p>
    </>
  );
}

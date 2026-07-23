import { Marquee } from "@/components/ui/marquee";

const tech = [
  "Cloudflare",
  "LiteSpeed",
  "CloudLinux",
  "cPanel",
  "Node.js",
  "Python",
  "PHP",
  "MariaDB",
  "Imunify360",
  "Let's Encrypt",
  "NVMe SSD",
];

export function TrustedTech() {
  return (
    <div className="border-y border-border bg-surface/40 py-10">
      <p className="text-center text-xs font-medium uppercase tracking-widest text-text-muted">
        Powered by an infrastructure stack you can trust
      </p>
      <div className="mt-6">
        <Marquee durationSeconds={32}>
          {tech.map((name) => (
            <span
              key={name}
              className="shrink-0 text-lg font-semibold tracking-tight text-text-secondary/70 grayscale transition-all hover:text-text-primary hover:grayscale-0 sm:text-xl"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

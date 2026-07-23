import { GitBranch, Package, Puzzle, Server, Terminal, Timer, Wrench, Zap } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import { BrowserFrame } from "@/components/ui/browser-frame";

const tools = [
  { icon: Zap, label: "Node.js" },
  { icon: Terminal, label: "Python" },
  { icon: Wrench, label: "PHP" },
  { icon: GitBranch, label: "Git Deploy" },
  { icon: Server, label: "SSH Access" },
  { icon: Timer, label: "Cron Jobs" },
  { icon: Package, label: "Composer" },
  { icon: Puzzle, label: "WP-CLI" },
];

const codeLines = [
  { prompt: "$", text: "git push shrotihost main" },
  { prompt: "$", text: "ssh user@yourdomain.com" },
  { prompt: "$", text: "composer install --no-dev" },
  { prompt: "$", text: "wp plugin update --all" },
];

export function DeveloperFeatures() {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
      <Reveal>
        <Eyebrow>For Developers</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          Ship the way you already work.
        </h2>
        <p className="mt-4 max-w-md text-text-secondary">
          Full SSH access, Git deploys, and a real terminal — not just a file manager.
        </p>

        <div className="mt-8 -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
          {tools.map((tool) => (
            <div
              key={tool.label}
              className="flex w-24 shrink-0 snap-start flex-col items-center gap-2 rounded-xl border border-border bg-card px-3 py-4 text-center transition-colors hover:border-brand-purple sm:w-auto"
            >
              <tool.icon size={20} className="text-brand-purple" aria-hidden="true" />
              <span className="text-xs font-medium text-text-secondary">{tool.label}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <BrowserFrame url="terminal — ssh" variant="dark">
          <div className="space-y-3 p-6 font-mono text-sm">
            {codeLines.map((line, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-brand-blue">{line.prompt}</span>
                <span className="text-white/80">{line.text}</span>
              </div>
            ))}
            <div className="flex gap-3">
              <span className="text-brand-blue">$</span>
              <span className="inline-block h-4 w-2 animate-pulse bg-white/60" aria-hidden="true" />
            </div>
          </div>
        </BrowserFrame>
      </Reveal>
    </div>
  );
}

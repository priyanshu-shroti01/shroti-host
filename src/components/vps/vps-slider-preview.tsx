"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Gauge, HardDrive, MemoryStick, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sliderClass =
  "h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-brand-purple " +
  "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-purple [&::-webkit-slider-thumb]:shadow-md " +
  "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 " +
  "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none " +
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-purple";

function Slider({
  icon: Icon,
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  icon: typeof Cpu;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 font-medium text-text-primary">
          <Icon size={15} className="text-brand-purple" aria-hidden="true" />
          {label}
        </span>
        <span className="font-mono text-text-secondary">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className={`mt-3 ${sliderClass}`}
      />
    </div>
  );
}

function fitLabel(score: number) {
  if (score < 0.3) return "Personal projects & staging";
  if (score < 0.65) return "Growing apps & small teams";
  return "Production workloads at scale";
}

export function VpsSliderPreview() {
  const [cpu, setCpu] = useState(2);
  const [ram, setRam] = useState(4);
  const [disk, setDisk] = useState(80);
  const [bandwidth, setBandwidth] = useState(2);

  const score = useMemo(() => {
    const cpuScore = (cpu - 1) / 7;
    const ramScore = (ram - 1) / 31;
    const diskScore = (disk - 20) / 300;
    const bwScore = (bandwidth - 1) / 7;
    return (cpuScore + ramScore + diskScore + bwScore) / 4;
  }, [cpu, ram, disk, bandwidth]);

  const capacityPercent = Math.round(20 + score * 80);

  return (
    <div className="mx-auto max-w-4xl rounded-3xl border border-border-strong bg-card p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary">Build your server</p>
          <p className="text-xs text-text-muted">Drag to see how resources scale — pricing isn&apos;t final yet.</p>
        </div>
        <Badge tone="neutral">Preview</Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-7">
          <Slider icon={Cpu} label="vCPU Cores" value={cpu} min={1} max={8} step={1} unit="cores" onChange={setCpu} />
          <Slider icon={MemoryStick} label="RAM" value={ram} min={1} max={32} step={1} unit="GB" onChange={setRam} />
          <Slider icon={HardDrive} label="NVMe Disk" value={disk} min={20} max={320} step={10} unit="GB" onChange={setDisk} />
          <Slider
            icon={Network}
            label="Bandwidth"
            value={bandwidth}
            min={1}
            max={8}
            step={1}
            unit="TB / mo"
            onChange={setBandwidth}
          />
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2">
            <Gauge size={14} className="text-brand-purple" aria-hidden="true" />
            <span className="font-mono text-xs text-text-secondary">Estimated capacity</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-blue"
              animate={{ width: `${capacityPercent}%` }}
              transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            />
          </div>

          <motion.p
            key={fitLabel(score)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 text-lg font-semibold text-text-primary"
          >
            {fitLabel(score)}
          </motion.p>

          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm">
            <div>
              <dt className="text-xs text-text-muted">vCPU</dt>
              <dd className="font-mono font-medium text-text-primary">{cpu} cores</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">RAM</dt>
              <dd className="font-mono font-medium text-text-primary">{ram} GB</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Disk</dt>
              <dd className="font-mono font-medium text-text-primary">{disk} GB NVMe</dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Bandwidth</dt>
              <dd className="font-mono font-medium text-text-primary">{bandwidth} TB</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

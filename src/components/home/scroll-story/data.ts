export const chapters = [
  {
    id: "server",
    kicker: "Chapter 01",
    title: "It starts as one machine.",
    detail: "Real hardware. Real capacity — not a shared guess.",
  },
  {
    id: "vps",
    kicker: "Chapter 02",
    title: "Isolated into your own environment.",
    detail: "CloudLinux-isolated resources — your account never fights a noisy neighbor for CPU.",
  },
  {
    id: "cloud",
    kicker: "Chapter 03",
    title: "Distributed for resilience.",
    detail: "Redundant across our network, so one machine failing doesn't take you down with it.",
  },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export const BLOCK_COUNT = 8;

export type BlockFormation = { x: number; y: number; width: number; height: number; radius: number; rotation: number };

/** Coordinates are px offsets from the morph stage's center — same 8 blocks, three formations. */
export function serverFormation(): BlockFormation[] {
  const w = 208;
  const h = 20;
  const gap = 5;
  const totalH = BLOCK_COUNT * h + (BLOCK_COUNT - 1) * gap;
  return Array.from({ length: BLOCK_COUNT }, (_, i) => ({
    x: -w / 2,
    y: -totalH / 2 + i * (h + gap),
    width: w,
    height: h,
    radius: 5,
    rotation: 0,
  }));
}

export function vpsFormation(): BlockFormation[] {
  const w = 78;
  const h = 78;
  const gapX = 14;
  const gapY = 14;
  const cols = 4;
  const rows = 2;
  const totalW = cols * w + (cols - 1) * gapX;
  const totalH = rows * h + (rows - 1) * gapY;
  return Array.from({ length: BLOCK_COUNT }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: -totalW / 2 + col * (w + gapX),
      y: -totalH / 2 + row * (h + gapY),
      width: w,
      height: h,
      radius: 14,
      rotation: 0,
    };
  });
}

export function cloudFormation(): BlockFormation[] {
  const radius = 150;
  const size = 30;
  return Array.from({ length: BLOCK_COUNT }, (_, i) => {
    const angle = (i / BLOCK_COUNT) * Math.PI * 2 - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius - size / 2,
      y: Math.sin(angle) * radius - size / 2,
      width: size,
      height: size,
      radius: size / 2,
      rotation: (angle * 180) / Math.PI,
    };
  });
}

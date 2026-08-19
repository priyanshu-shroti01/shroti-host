import { NextRequest } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { BUDGET_RANGES, PROJECT_TYPES, TIMELINES, services } from "@/lib/services";

/**
 * Project enquiry intake — same hardening as the careers route: honeypot,
 * per-IP rate limit, strict validation, CSV stored OUTSIDE the deployed app
 * dir and any web root (client project details must never be URL-fetchable).
 * Override with PROJECT_ENQUIRIES_CSV_FILE.
 */
export const dynamic = "force-dynamic";

const CSV_FILE =
  process.env.PROJECT_ENQUIRIES_CSV_FILE ??
  "/home/shrotihost/shared-data/project-enquiries.csv";

const HEADER =
  "timestamp,service,project_type,budget,timeline,name,email,phone,description,ip,user_agent\n";

/** CSV-escape + neutralize spreadsheet formula injection (=,+,-,@ prefixes). */
function csvCell(v: string): string {
  let s = v.replace(/\r?\n/g, " ").trim();
  if (/^[=+\-@\t]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Minimal in-memory rate limit: 5 submissions per IP per hour.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60 * 60 * 1000;
  const list = (hits.get(ip) ?? []).filter((t) => t > windowStart);
  if (list.length >= 5) return true;
  list.push(now);
  hits.set(ip, list);
  return false;
}

type Payload = {
  service?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  name?: string;
  email?: string;
  phone?: string;
  description?: string;
  /** Honeypot — real users never fill this. */
  website?: string;
};

export async function POST(request: NextRequest) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots stop retrying, store nothing.
  if (body.website) return Response.json({ ok: true });

  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many submissions — please try again later." },
      { status: 429 },
    );
  }

  const service = (body.service ?? "").trim();
  const projectType = (body.projectType ?? "").trim();
  const budget = (body.budget ?? "").trim();
  const timeline = (body.timeline ?? "").trim();
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").replace(/[^\d+ ]/g, "").trim();
  const description = (body.description ?? "").trim();

  const errors: Record<string, string> = {};
  if (service && !services.some((s) => s.slug === service)) errors.service = "Unknown service.";
  if (!(PROJECT_TYPES as readonly string[]).includes(projectType))
    errors.projectType = "Please pick a project type.";
  if (budget && !(BUDGET_RANGES as readonly string[]).includes(budget))
    errors.budget = "Please pick a budget range from the list.";
  if (timeline && !(TIMELINES as readonly string[]).includes(timeline))
    errors.timeline = "Please pick a timeline from the list.";
  if (name.length < 2 || name.length > 80) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (phone && phone.replace(/\D/g, "").length < 8)
    errors.phone = "Please enter a valid phone number.";
  if (description.length < 20)
    errors.description = "Tell us a little more about the project (at least 20 characters).";
  if (description.length > 3000) errors.description = "Please keep it under 3000 characters.";
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const row =
    [
      new Date().toISOString(),
      service,
      projectType,
      budget,
      timeline,
      name,
      email,
      phone,
      description,
      ip,
      (request.headers.get("user-agent") ?? "").slice(0, 200),
    ]
      .map(csvCell)
      .join(",") + "\n";

  try {
    await mkdir(path.dirname(CSV_FILE), { recursive: true });
    if (!existsSync(CSV_FILE)) await appendFile(CSV_FILE, HEADER, "utf8");
    await appendFile(CSV_FILE, row, "utf8");
  } catch (err) {
    console.error("project-enquiry: CSV write failed", err);
    return Response.json(
      { ok: false, error: "Could not save your enquiry — please WhatsApp or email us instead." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}

/** HEAD used by uptime checks; GET intentionally reveals nothing. */
export async function GET() {
  return Response.json({ ok: true, accepts: "POST" });
}

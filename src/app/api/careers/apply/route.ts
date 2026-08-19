import { NextRequest } from "next/server";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { openRoles } from "@/lib/careers";

/**
 * Job application intake. Validates, then appends one row to a CSV that
 * lives OUTSIDE the deployed app dir (which is replaced on every deploy)
 * and outside any web root (applicant PII must never be URL-fetchable).
 * Override with CAREERS_CSV_FILE.
 */
export const dynamic = "force-dynamic";

const CSV_FILE =
  process.env.CAREERS_CSV_FILE ?? "/home/shrotihost/shared-data/job-applications.csv";

const HEADER =
  "timestamp,role_slug,role_title,name,email,phone,portfolio,resume_url,note,ip,user_agent\n";

/** CSV-escape + neutralize spreadsheet formula injection (=,+,-,@ prefixes). */
function csvCell(v: string): string {
  let s = v.replace(/\r?\n/g, " ").trim();
  if (/^[=+\-@\t]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/\S+$/i;

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
  role?: string;
  name?: string;
  email?: string;
  phone?: string;
  portfolio?: string;
  resumeUrl?: string;
  note?: string;
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

  const role = openRoles.find((r) => r.slug === body.role);
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").replace(/[^\d+ ]/g, "").trim();
  const portfolio = (body.portfolio ?? "").trim();
  const resumeUrl = (body.resumeUrl ?? "").trim();
  const note = (body.note ?? "").trim();

  const errors: Record<string, string> = {};
  if (!role) errors.role = "Unknown role.";
  if (name.length < 2 || name.length > 80) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  if (phone.replace(/\D/g, "").length < 8) errors.phone = "Please enter a valid phone number.";
  if (portfolio && !URL_RE.test(portfolio)) errors.portfolio = "Portfolio must be a http(s) link.";
  if (resumeUrl && !URL_RE.test(resumeUrl)) errors.resumeUrl = "Resume must be a http(s) link.";
  if (note.length < 20) errors.note = "Tell us a little more (at least 20 characters).";
  if (note.length > 2000) errors.note = "Please keep it under 2000 characters.";
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const row =
    [
      new Date().toISOString(),
      role!.slug,
      role!.title,
      name,
      email,
      phone,
      portfolio,
      resumeUrl,
      note,
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
    console.error("careers/apply: CSV write failed", err);
    return Response.json(
      { ok: false, error: "Could not save your application — please email us instead." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}

/** HEAD used by uptime checks; GET intentionally reveals nothing. */
export async function GET() {
  return Response.json({ ok: true, accepts: "POST" });
}

import { NextRequest } from "next/server";
import { access, appendFile, mkdir } from "node:fs/promises";
import { constants as fsConstants, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { openRoles } from "@/lib/careers";
import {
  apiError,
  clientIp,
  csvCell,
  jsonNoStore,
  newRequestId,
  normalizePhone,
  notifyWebhook,
  rateLimit,
  readJsonObject,
  str,
  type RateLimitMap,
} from "@/lib/api-utils";

/**
 * Job application intake. Validates, then appends one row to a CSV that
 * lives OUTSIDE the deployed app dir (which is replaced on every deploy)
 * and outside any web root (applicant PII must never be URL-fetchable).
 * Configure with CAREERS_CSV_FILE (required in production).
 */
export const dynamic = "force-dynamic";

const ROUTE = "careers/apply";
const CSV_FILE =
  process.env.CAREERS_CSV_FILE ?? "/home/shrotihost/shared-data/job-applications.csv";
const CONFIGURED = Boolean(process.env.CAREERS_CSV_FILE) || process.env.NODE_ENV !== "production";

const HEADER =
  "timestamp,role_slug,role_title,name,email,phone,portfolio,resume_url,note,ip,user_agent\n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/\S+$/i;

// Field caps (input is truncated/rejected beyond these, before validation).
const MAX = { name: 120, email: 254, phone: 32, url: 2048, text: 4000, ua: 160 } as const;

// 5 submissions per IP per hour.
const hits: RateLimitMap = new Map();
const RATE = { limit: 5, windowMs: 60 * 60 * 1000 };

// 10-minute dedupe so a retried submit does not produce a second row.
const recent = new Map<string, number>();
const DEDUPE_MS = 10 * 60 * 1000;
function isDuplicate(key: string, now = Date.now()): boolean {
  for (const [k, t] of recent) if (now - t > DEDUPE_MS) recent.delete(k);
  if (recent.has(key)) return true;
  recent.set(key, now);
  return false;
}

const NOT_CONFIGURED = () =>
  apiError(503, "not_configured", "Applications are temporarily unavailable — please email us instead.");

export async function POST(request: NextRequest) {
  const requestId = newRequestId();
  const parsed = await readJsonObject(request);
  if ("response" in parsed) return parsed.response;
  const body = parsed.body;

  // Honeypot: pretend success so bots stop retrying, store nothing.
  if (str(body.website)) return jsonNoStore({ ok: true });

  const ip = clientIp(request);
  if (!rateLimit(hits, ip, RATE)) {
    return apiError(429, "rate_limited", "Too many submissions — please try again later.");
  }

  const role = openRoles.find((r) => r.slug === str(body.role));
  const name = str(body.name).slice(0, MAX.name);
  const email = str(body.email);
  const phoneRaw = str(body.phone);
  const phone = normalizePhone(phoneRaw.slice(0, MAX.phone));
  const portfolio = str(body.portfolio);
  const resumeUrl = str(body.resumeUrl);
  const note = str(body.note).slice(0, MAX.text);

  const errors: Record<string, string> = {};
  if (!role) errors.role = "Unknown role.";
  if (name.length < 2 || name.length > 80) errors.name = "Please enter your full name.";
  if (email.length > MAX.email || !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";
  if (phoneRaw.length > MAX.phone || phone.replace(/\D/g, "").length < 8)
    errors.phone = "Please enter a valid phone number.";
  if (portfolio && (portfolio.length > MAX.url || !URL_RE.test(portfolio)))
    errors.portfolio = "Portfolio must be a http(s) link.";
  if (resumeUrl && (resumeUrl.length > MAX.url || !URL_RE.test(resumeUrl)))
    errors.resumeUrl = "Resume must be a http(s) link.";
  if (note.length < 20) errors.note = "Tell us a little more (at least 20 characters).";
  if (note.length > 2000) errors.note = "Please keep it under 2000 characters.";
  if (Object.keys(errors).length > 0) {
    return apiError(422, "validation_failed", "Please fix the highlighted fields.", errors, requestId);
  }

  if (!CONFIGURED) {
    console.error(ROUTE, { requestId, err: "CAREERS_CSV_FILE is not set" });
    return NOT_CONFIGURED();
  }

  const dedupeKey = createHash("sha256").update(`${email.toLowerCase()}|${role!.slug}`).digest("hex");
  if (isDuplicate(dedupeKey)) return jsonNoStore({ ok: true, duplicate: true });

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
      (request.headers.get("user-agent") ?? "").slice(0, MAX.ua),
    ]
      .map(csvCell)
      .join(",") + "\n";

  try {
    await mkdir(path.dirname(CSV_FILE), { recursive: true, mode: 0o700 });
    if (!existsSync(CSV_FILE)) await appendFile(CSV_FILE, HEADER, { encoding: "utf8", mode: 0o600 });
    await appendFile(CSV_FILE, row, { encoding: "utf8", mode: 0o600 });
  } catch (err) {
    console.error(ROUTE, { requestId, err });
    return apiError(
      500,
      "write_failed",
      "Could not save your application — please email us instead.",
      undefined,
      requestId,
    );
  }

  notifyWebhook(ROUTE, {
    kind: "job_application",
    role: role!.title,
    name,
    email,
    receivedAt: new Date().toISOString(),
  });

  return jsonNoStore({ ok: true });
}

/** Health: verifies the CSV directory is writable. HEAD is derived from this. */
export async function GET() {
  if (!CONFIGURED) return NOT_CONFIGURED();
  try {
    await access(path.dirname(CSV_FILE), fsConstants.W_OK);
  } catch (err) {
    console.error(ROUTE, { requestId: newRequestId(), err });
    return apiError(503, "storage_unavailable", "Storage is not writable.");
  }
  return jsonNoStore({ ok: true, accepts: "POST" });
}

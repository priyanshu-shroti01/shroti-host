import { NextRequest } from "next/server";
import { access, appendFile, mkdir } from "node:fs/promises";
import { constants as fsConstants, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { BUDGET_RANGES, PROJECT_TYPES, TIMELINES, services } from "@/lib/services";
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
 * Project enquiry intake — same hardening as the careers route: honeypot,
 * per-IP rate limit, strict validation, CSV stored OUTSIDE the deployed app
 * dir and any web root (client project details must never be URL-fetchable).
 * Configure with PROJECT_ENQUIRIES_CSV_FILE (required in production).
 */
export const dynamic = "force-dynamic";

const ROUTE = "project-enquiry";
const CSV_FILE =
  process.env.PROJECT_ENQUIRIES_CSV_FILE ??
  "/home/shrotihost/shared-data/project-enquiries.csv";
const CONFIGURED =
  Boolean(process.env.PROJECT_ENQUIRIES_CSV_FILE) || process.env.NODE_ENV !== "production";

const HEADER =
  "timestamp,service,project_type,budget,timeline,name,email,phone,description,ip,user_agent\n";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MAX = { name: 120, email: 254, phone: 32, text: 4000, ua: 160 } as const;

// 5 submissions per IP per hour.
const hits: RateLimitMap = new Map();
const RATE = { limit: 5, windowMs: 60 * 60 * 1000 };

const recent = new Map<string, number>();
const DEDUPE_MS = 10 * 60 * 1000;
function isDuplicate(key: string, now = Date.now()): boolean {
  for (const [k, t] of recent) if (now - t > DEDUPE_MS) recent.delete(k);
  if (recent.has(key)) return true;
  recent.set(key, now);
  return false;
}

const NOT_CONFIGURED = () =>
  apiError(
    503,
    "not_configured",
    "Enquiries are temporarily unavailable — please WhatsApp or email us instead.",
  );

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

  const service = str(body.service).slice(0, MAX.name);
  const projectType = str(body.projectType).slice(0, MAX.name);
  const budget = str(body.budget).slice(0, MAX.name);
  const timeline = str(body.timeline).slice(0, MAX.name);
  const name = str(body.name).slice(0, MAX.name);
  const email = str(body.email);
  const phoneRaw = str(body.phone);
  const phone = normalizePhone(phoneRaw.slice(0, MAX.phone));
  const description = str(body.description).slice(0, MAX.text);

  const errors: Record<string, string> = {};
  if (service && !services.some((s) => s.slug === service)) errors.service = "Unknown service.";
  if (!(PROJECT_TYPES as readonly string[]).includes(projectType))
    errors.projectType = "Please pick a project type.";
  if (budget && !(BUDGET_RANGES as readonly string[]).includes(budget))
    errors.budget = "Please pick a budget range from the list.";
  if (timeline && !(TIMELINES as readonly string[]).includes(timeline))
    errors.timeline = "Please pick a timeline from the list.";
  if (name.length < 2 || name.length > 80) errors.name = "Please enter your full name.";
  if (email.length > MAX.email || !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";
  if (phoneRaw && (phoneRaw.length > MAX.phone || phone.replace(/\D/g, "").length < 8))
    errors.phone = "Please enter a valid phone number.";
  if (description.length < 20)
    errors.description = "Tell us a little more about the project (at least 20 characters).";
  if (description.length > 3000) errors.description = "Please keep it under 3000 characters.";
  if (Object.keys(errors).length > 0) {
    return apiError(422, "validation_failed", "Please fix the highlighted fields.", errors, requestId);
  }

  if (!CONFIGURED) {
    console.error(ROUTE, { requestId, err: "PROJECT_ENQUIRIES_CSV_FILE is not set" });
    return NOT_CONFIGURED();
  }

  const dedupeKey = createHash("sha256")
    .update(`${email.toLowerCase()}|${projectType}`)
    .digest("hex");
  if (isDuplicate(dedupeKey)) return jsonNoStore({ ok: true, duplicate: true });

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
      "Could not save your enquiry — please WhatsApp or email us instead.",
      undefined,
      requestId,
    );
  }

  notifyWebhook(ROUTE, {
    kind: "project_enquiry",
    service,
    projectType,
    budget,
    timeline,
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

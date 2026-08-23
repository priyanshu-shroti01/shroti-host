import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * Shared helpers for the route handlers under src/app/api. Pure functions
 * live here so they can be unit-tested without spinning up Next.
 */

/** Coerce an unknown JSON value to a trimmed string; anything non-string → "". */
export function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Real client address. Apache in front of us overwrites X-Forwarded-For with
 * the remote address (`RequestHeader set`), so the LAST hop is the trusted
 * one. The first element is whatever the client sent and must never be used.
 */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for") ?? "";
  const hops = xff
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return hops.length > 0 ? hops[hops.length - 1] : "unknown";
}

/** JSON response that is never cached by browsers or the CDN/proxy. */
export function jsonNoStore<T>(body: T, init?: ResponseInit): NextResponse {
  const res = NextResponse.json(body, init);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export type RateLimitMap = Map<string, number[]>;
export type RateLimitOptions = { limit: number; windowMs: number };

/** Upper bound on tracked keys; beyond this we refuse rather than grow. */
export const RATE_LIMIT_MAX_KEYS = 10_000;

/**
 * Sliding-window in-memory rate limiter. Returns `true` when the request is
 * ALLOWED (and records it), `false` when it should be rejected. Expired
 * entries are pruned on every call so the map cannot grow without bound;
 * if it still holds more than 10k keys the call is refused.
 */
export function rateLimit(
  map: RateLimitMap,
  key: string,
  { limit, windowMs }: RateLimitOptions,
  now: number = Date.now(),
): boolean {
  const windowStart = now - windowMs;
  for (const [k, list] of map) {
    const live = list.filter((t) => t > windowStart);
    if (live.length === 0) map.delete(k);
    else if (live.length !== list.length) map.set(k, live);
  }
  const list = map.get(key) ?? [];
  if (list.length >= limit) return false;
  if (!map.has(key) && map.size >= RATE_LIMIT_MAX_KEYS) return false;
  list.push(now);
  map.set(key, list);
  return true;
}

/**
 * CSV-escape a cell: collapse any CR/LF run to a space, quote it, and
 * neutralise spreadsheet formula/DDE injection by prefixing a `'` when the
 * value starts with `= + - @ TAB CR |`. The one exemption is a bare
 * international phone number (`+` followed only by digits): it contains no
 * operator, function or cell reference, so a spreadsheet can at most show it
 * as a number — and prefixing it would store every phone as `'+91…`.
 */
export function csvCell(v: unknown): string {
  let s = String(v ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();
  if (/^[=+\-@\t\r|]/.test(s) && !/^\+\d{1,31}$/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export type ApiErrorBody = {
  ok: false;
  code: string;
  message: string;
  requestId: string;
  fields?: Record<string, string>;
  /** @deprecated alias of `message`, kept for the existing client forms. */
  error: string;
  /** @deprecated alias of `fields`, kept for the existing client forms. */
  errors?: Record<string, string>;
};

/**
 * Uniform error envelope: `{ok:false, code, message, fields?, requestId}`.
 * `error`/`errors` are emitted as aliases because the deployed forms read
 * those keys; drop them once the forms switch to `message`/`fields`.
 */
export function apiError(
  status: number,
  code: string,
  message: string,
  fields?: Record<string, string>,
  requestId: string = randomUUID(),
): NextResponse {
  const body: ApiErrorBody = { ok: false, code, message, error: message, requestId };
  if (fields) {
    body.fields = fields;
    body.errors = fields;
  }
  return jsonNoStore(body, { status });
}

export function newRequestId(): string {
  return randomUUID();
}

/** Max accepted JSON body for the intake routes. */
export const MAX_BODY_BYTES = 16 * 1024;

/**
 * Read and parse a JSON object body with size limits. Returns either the
 * parsed object or a ready-made error response.
 */
export async function readJsonObject(
  req: Request,
): Promise<{ body: Record<string, unknown> } | { response: NextResponse }> {
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return { response: apiError(413, "payload_too_large", "Request is too large.") };
  }
  let text: string;
  try {
    text = await req.text();
  } catch {
    return { response: apiError(400, "invalid_body", "Invalid request.") };
  }
  if (text.length > MAX_BODY_BYTES) {
    return { response: apiError(413, "payload_too_large", "Request is too large.") };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { response: apiError(400, "invalid_json", "Invalid request.") };
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { response: apiError(400, "invalid_body", "Invalid request.") };
  }
  return { body: parsed as Record<string, unknown> };
}

/** Phone as digits only, keeping a single leading `+` if the user typed one. */
export function normalizePhone(raw: string): string {
  const s = raw.trim();
  const digits = s.replace(/\D/g, "");
  if (!digits) return "";
  return s.startsWith("+") ? `+${digits}` : digits;
}

/**
 * Fire-and-forget JSON POST to ENQUIRY_WEBHOOK_URL (if configured). Never
 * throws, never delays the response; failures are only logged. Callers must
 * not include IP/UA in `summary`.
 */
export function notifyWebhook(route: string, summary: Record<string, unknown>): void {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return;
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: route, ...summary }),
    signal: AbortSignal.timeout(3000),
  })
    .then((res) => {
      if (!res.ok) console.error(route, { webhook: "non-2xx", status: res.status });
    })
    .catch((err: unknown) => {
      console.error(route, { webhook: "failed", err: err instanceof Error ? err.message : err });
    });
}

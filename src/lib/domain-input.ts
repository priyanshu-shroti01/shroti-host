/**
 * Pure input sanitiser for the domain checker. Turns whatever a user pasted
 * (a URL, a host with port, an email-ish string, an IDN) into a validated
 * `{ base, tld }` pair, or a typed refusal. No I/O, so it is unit-tested.
 */

/** RFC 1035 host label, lowercase: 1–63 chars, no leading/trailing hyphen. */
export const LABEL_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export type DomainInput =
  | { ok: true; base: string; tld: string | null }
  | { ok: false; reason: "empty" | "unsupported_characters" | "invalid_label" };

/**
 * @param raw       user input, any shape
 * @param knownTlds catalog TLDs (each with a leading dot, e.g. ".co.in");
 *                  the LONGEST matching one wins, so `example.co.in` splits
 *                  into base `example` + tld `.co.in`, not `example.co` + `.in`.
 */
export function sanitizeDomainInput(raw: string, knownTlds: readonly string[] = []): DomainInput {
  let s = (raw ?? "").trim().toLowerCase();
  if (!s) return { ok: false, reason: "empty" };

  // Scheme (`https://`, `ftp://`, …) and anything after the authority part.
  s = s.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
  s = s.split(/[/?#]/, 1)[0];
  // Userinfo (`user@host`) → keep the host; port → drop it.
  const at = s.lastIndexOf("@");
  if (at !== -1) s = s.slice(at + 1);
  s = s.split(":", 1)[0];
  s = s.replace(/^www\./, "");
  // FQDN trailing dot(s) and stray leading dots.
  s = s.replace(/^\.+/, "").replace(/\.+$/, "");
  if (!s) return { ok: false, reason: "empty" };

  // IDN / non-ASCII: we do not punycode-encode, so say so instead of
  // silently stripping letters and checking a different name.
  if (/[^\x20-\x7e]/.test(s)) return { ok: false, reason: "unsupported_characters" };

  const { base, tld } = splitDomain(s, knownTlds);
  if (!LABEL_RE.test(base)) return { ok: false, reason: "invalid_label" };
  if (tld !== null) {
    const labels = tld.slice(1).split(".");
    if (!labels.every((l) => LABEL_RE.test(l) && l.length >= 2)) {
      return { ok: false, reason: "invalid_label" };
    }
  }
  return { ok: true, base, tld };
}

/**
 * Split `host` into `{ base, tld }`. Prefers the longest catalog TLD; falls
 * back to the last label for unknown TLDs (so `foo.bar.dev` yields base
 * `foo.bar`, which then fails label validation rather than being checked as
 * a made-up `.bar.dev` TLD).
 */
export function splitDomain(
  host: string,
  knownTlds: readonly string[],
): { base: string; tld: string | null } {
  if (!host.includes(".")) return { base: host, tld: null };
  const candidates = [...knownTlds]
    .filter((t) => t.startsWith("."))
    .sort((a, b) => b.length - a.length);
  for (const t of candidates) {
    if (host.length > t.length && host.endsWith(t)) {
      return { base: host.slice(0, -t.length), tld: t };
    }
  }
  const lastDot = host.lastIndexOf(".");
  return { base: host.slice(0, lastDot), tld: host.slice(lastDot) };
}

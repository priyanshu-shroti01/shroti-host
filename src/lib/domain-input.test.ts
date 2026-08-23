import { describe, expect, it } from "vitest";
import { LABEL_RE, sanitizeDomainInput, splitDomain } from "./domain-input";

const TLDS = [".com", ".in", ".co", ".co.in", ".net", ".in.net", ".it.com", ".uk", ".co.uk"];

describe("sanitizeDomainInput", () => {
  it("returns empty for blank input", () => {
    expect(sanitizeDomainInput("")).toEqual({ ok: false, reason: "empty" });
    expect(sanitizeDomainInput("   ")).toEqual({ ok: false, reason: "empty" });
    expect(sanitizeDomainInput("https://")).toEqual({ ok: false, reason: "empty" });
  });

  it("strips scheme, www, path, port and userinfo from URL input", () => {
    expect(sanitizeDomainInput("https://www.Example.com/path?x=1#frag", TLDS)).toEqual({
      ok: true,
      base: "example",
      tld: ".com",
    });
    expect(sanitizeDomainInput("example.com:8080", TLDS)).toEqual({ ok: true, base: "example", tld: ".com" });
    expect(sanitizeDomainInput("user:pw@example.com", TLDS)).toEqual({ ok: true, base: "example", tld: ".com" });
    expect(sanitizeDomainInput("me@example.co.in", TLDS)).toEqual({ ok: true, base: "example", tld: ".co.in" });
  });

  it("never folds a query string into the TLD (audit: example.com?x=1 → .comx1)", () => {
    expect(sanitizeDomainInput("example.com?x=1", TLDS)).toEqual({ ok: true, base: "example", tld: ".com" });
  });

  it("flags non-ASCII (IDN) input instead of silently stripping letters", () => {
    expect(sanitizeDomainInput("münchen.de", TLDS)).toEqual({ ok: false, reason: "unsupported_characters" });
    expect(sanitizeDomainInput("शक्ति.in", TLDS)).toEqual({ ok: false, reason: "unsupported_characters" });
    // Non-ASCII only in the path is fine.
    expect(sanitizeDomainInput("example.com/über", TLDS)).toEqual({ ok: true, base: "example", tld: ".com" });
  });

  it("picks the longest catalog TLD", () => {
    expect(sanitizeDomainInput("example.co.in", TLDS)).toEqual({ ok: true, base: "example", tld: ".co.in" });
    expect(sanitizeDomainInput("example.co", TLDS)).toEqual({ ok: true, base: "example", tld: ".co" });
    expect(sanitizeDomainInput("shop.it.com", TLDS)).toEqual({ ok: true, base: "shop", tld: ".it.com" });
    expect(sanitizeDomainInput("a.in.net", TLDS)).toEqual({ ok: true, base: "a", tld: ".in.net" });
  });

  it("does not treat a bare catalog TLD as base + tld", () => {
    // "co.in" ends with ".in" (base "co"); it must not match ".co.in" with an empty base.
    expect(sanitizeDomainInput("co.in", TLDS)).toEqual({ ok: true, base: "co", tld: ".in" });
  });

  it("falls back to the last label for unknown TLDs", () => {
    expect(sanitizeDomainInput("example.dev", TLDS)).toEqual({ ok: true, base: "example", tld: ".dev" });
    // Multi-label base with an unknown TLD is not a registrable name → invalid.
    expect(sanitizeDomainInput("foo.bar.dev", TLDS)).toEqual({ ok: false, reason: "invalid_label" });
  });

  it("rejects invalid labels", () => {
    expect(sanitizeDomainInput("-bad-.com", TLDS)).toEqual({ ok: false, reason: "invalid_label" });
    expect(sanitizeDomainInput("bad-.com", TLDS)).toEqual({ ok: false, reason: "invalid_label" });
    expect(sanitizeDomainInput("my site.com", TLDS)).toEqual({ ok: false, reason: "invalid_label" });
    expect(sanitizeDomainInput("a".repeat(64) + ".com", TLDS)).toEqual({ ok: false, reason: "invalid_label" });
    expect(sanitizeDomainInput("example.c0m-", TLDS)).toEqual({ ok: false, reason: "invalid_label" });
    expect(sanitizeDomainInput("example.c", TLDS)).toEqual({ ok: false, reason: "invalid_label" });
  });

  it("accepts a trailing FQDN dot and a bare base", () => {
    expect(sanitizeDomainInput("example.", TLDS)).toEqual({ ok: true, base: "example", tld: null });
    expect(sanitizeDomainInput("shroti-host", TLDS)).toEqual({ ok: true, base: "shroti-host", tld: null });
    expect(sanitizeDomainInput("a".repeat(63), TLDS)).toEqual({ ok: true, base: "a".repeat(63), tld: null });
  });
});

describe("splitDomain", () => {
  it("uses the longest matching TLD regardless of catalog order", () => {
    expect(splitDomain("example.co.uk", [".uk", ".co.uk"])).toEqual({ base: "example", tld: ".co.uk" });
    expect(splitDomain("example.co.uk", [".co.uk", ".uk"])).toEqual({ base: "example", tld: ".co.uk" });
  });
});

describe("LABEL_RE", () => {
  it("matches RFC 1035 labels only", () => {
    expect(LABEL_RE.test("a")).toBe(true);
    expect(LABEL_RE.test("a-b")).toBe(true);
    expect(LABEL_RE.test("-a")).toBe(false);
    expect(LABEL_RE.test("a-")).toBe(false);
    expect(LABEL_RE.test("A")).toBe(false);
  });
});

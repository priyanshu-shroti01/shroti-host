import { describe, expect, it } from "vitest";
import {
  RATE_LIMIT_MAX_KEYS,
  apiError,
  clientIp,
  csvCell,
  jsonNoStore,
  normalizePhone,
  rateLimit,
  str,
} from "./api-utils";

describe("str", () => {
  it("trims strings and coerces everything else to empty", () => {
    expect(str("  hi ")).toBe("hi");
    expect(str(123)).toBe("");
    expect(str(["a"])).toBe("");
    expect(str({ a: 1 })).toBe("");
    expect(str(null)).toBe("");
    expect(str(undefined)).toBe("");
    expect(str(true)).toBe("");
  });
});

describe("clientIp", () => {
  const req = (xff?: string) =>
    new Request("http://localhost/api", { headers: xff === undefined ? {} : { "x-forwarded-for": xff } });

  it("takes the LAST hop, never the client-supplied first element", () => {
    expect(clientIp(req("1.2.3.4, 10.0.0.1, 203.0.113.9"))).toBe("203.0.113.9");
    expect(clientIp(req("spoofed, 203.0.113.9"))).toBe("203.0.113.9");
  });

  it("handles a single address and whitespace", () => {
    expect(clientIp(req(" 203.0.113.9 "))).toBe("203.0.113.9");
    expect(clientIp(req("203.0.113.9,"))).toBe("203.0.113.9");
  });

  it("falls back to 'unknown' when absent", () => {
    expect(clientIp(req())).toBe("unknown");
    expect(clientIp(req(""))).toBe("unknown");
  });
});

describe("csvCell", () => {
  it("quotes and doubles embedded quotes", () => {
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
  });

  it("collapses CR/LF runs including lone \\r", () => {
    expect(csvCell("a\r\nb\rc\nd")).toBe('"a b c d"');
  });

  it("neutralises formula and DDE prefixes", () => {
    for (const p of ["=", "+", "-", "@", "|"]) {
      expect(csvCell(`${p}cmd`)).toBe(`"'${p}cmd"`);
    }
    expect(csvCell("=1+1")).toBe("\"'=1+1\"");
    expect(csvCell("|calc")).toBe("\"'|calc\"");
    // Leading TAB/CR are whitespace and are trimmed away, so nothing
    // starting with them can reach the file; the value after them is
    // still guarded.
    expect(csvCell("\tcmd")).toBe('"cmd"');
    expect(csvCell("\r=cmd")).toBe("\"'=cmd\"");
  });

  it("exempts a bare +digits phone number from the guard (no operators possible)", () => {
    expect(csvCell("+919582129099")).toBe('"+919582129099"');
    expect(csvCell("+91 9582129099")).toBe("\"'+91 9582129099\"");
    expect(csvCell("+1+1")).toBe("\"'+1+1\"");
    expect(csvCell("+")).toBe("\"'+\"");
  });

  it("leaves ordinary values alone", () => {
    expect(csvCell("Priya")).toBe('"Priya"');
    expect(csvCell("")).toBe('""');
    expect(csvCell(undefined)).toBe('""');
  });
});

describe("normalizePhone", () => {
  it("stores digits only, keeping a leading +", () => {
    expect(normalizePhone("+91 95821-29099")).toBe("+919582129099");
    expect(normalizePhone("(011) 2345 6789")).toBe("01123456789");
    expect(normalizePhone("abc")).toBe("");
  });
});

describe("rateLimit", () => {
  it("allows up to `limit` hits inside the window, then refuses", () => {
    const map = new Map<string, number[]>();
    const opts = { limit: 2, windowMs: 1000 };
    expect(rateLimit(map, "a", opts, 0)).toBe(true);
    expect(rateLimit(map, "a", opts, 10)).toBe(true);
    expect(rateLimit(map, "a", opts, 20)).toBe(false);
    // Window slides: the first hit expires.
    expect(rateLimit(map, "a", opts, 1001)).toBe(true);
  });

  it("prunes expired keys on every call", () => {
    const map = new Map<string, number[]>();
    const opts = { limit: 5, windowMs: 100 };
    rateLimit(map, "old", opts, 0);
    rateLimit(map, "new", opts, 500);
    expect(map.has("old")).toBe(false);
    expect(map.has("new")).toBe(true);
  });

  it("refuses new keys once the map is full", () => {
    const map = new Map<string, number[]>();
    for (let i = 0; i < RATE_LIMIT_MAX_KEYS; i++) map.set(`k${i}`, [1]);
    const opts = { limit: 5, windowMs: 1000 };
    expect(rateLimit(map, "fresh", opts, 2)).toBe(false);
    expect(rateLimit(map, "k1", opts, 2)).toBe(true);
  });
});

describe("responses", () => {
  it("jsonNoStore sets Cache-Control: no-store", async () => {
    const res = jsonNoStore({ ok: true }, { status: 201 });
    expect(res.status).toBe(201);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({ ok: true });
  });

  it("apiError returns the envelope plus legacy aliases", async () => {
    const res = apiError(422, "validation_failed", "Fix fields.", { name: "Required." }, "rid-1");
    expect(res.status).toBe(422);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(await res.json()).toEqual({
      ok: false,
      code: "validation_failed",
      message: "Fix fields.",
      error: "Fix fields.",
      fields: { name: "Required." },
      errors: { name: "Required." },
      requestId: "rid-1",
    });
  });

  it("apiError generates a UUID requestId by default", async () => {
    const body = await apiError(500, "x", "y").json();
    expect(body.requestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(body.fields).toBeUndefined();
  });
});

import { readFile } from "node:fs/promises";
import path from "node:path";
import { getPricingFileMtime } from "@/lib/domain-pricing.server";
import { jsonNoStore } from "@/lib/api-utils";

/**
 * Liveness + "is this the build we just deployed" endpoint for the deploy
 * script, uptime monitors and scripts/smoke.sh. Reveals nothing sensitive:
 * the build id is already in every HTML page, pricing mtime is public data.
 */
export const dynamic = "force-dynamic";

let buildId: string | null | undefined;
async function getBuildId(): Promise<string | null> {
  if (buildId !== undefined) return buildId;
  if (process.env.NEXT_BUILD_ID) return (buildId = process.env.NEXT_BUILD_ID);
  try {
    buildId = (await readFile(path.join(process.cwd(), ".next", "BUILD_ID"), "utf8")).trim() || null;
  } catch {
    buildId = null;
  }
  return buildId;
}

export async function GET() {
  const [id, pricingUpdatedAt] = await Promise.all([getBuildId(), getPricingFileMtime()]);
  return jsonNoStore({ ok: true, buildId: id, pricingUpdatedAt });
}

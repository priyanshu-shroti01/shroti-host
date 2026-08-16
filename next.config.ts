import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-hosted deployment: bundle a minimal server into .next/standalone
  output: "standalone",
};

export default nextConfig;

import type { MetadataRoute } from "next";

// Web app manifest — served at /manifest.webmanifest and linked from <head>
// automatically. Colors mirror the dark brand default in globals.css; icons
// are the app/icon.png (300×300) and app/apple-icon.png (180×180) files.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShrotiHost — Web Hosting & Domains in India",
    short_name: "ShrotiHost",
    description:
      "Indian web hosting and development company — NVMe hosting from ₹39/mo, domains, and custom builds.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    icons: [
      { src: "/icon.png", sizes: "300x300", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

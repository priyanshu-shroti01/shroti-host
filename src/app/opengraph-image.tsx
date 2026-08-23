import { ImageResponse } from "next/og";

export const alt = "ShrotiHost — Web Hosting & Domains in India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * OG card: brand lockup + the site's signature 3D infrastructure stack,
 * projected isometrically (rotate 45° + squash — satori has no 3D
 * transforms, so this is the classic 2D isometric projection of the same
 * plates the homepage renders in real CSS 3D).
 */

const PLATES = [
  { y: 150, fill: "rgba(63, 167, 255, 0.16)", border: "rgba(63, 167, 255, 0.55)" },
  { y: 75, fill: "rgba(168, 16, 199, 0.20)", border: "rgba(168, 16, 199, 0.6)" },
  { y: 0, fill: "linear-gradient(135deg, rgba(168,16,199,0.9) 0%, rgba(63,167,255,0.9) 100%)", border: "rgba(255,255,255,0.5)" },
];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a0d24 60%, #0d1524 100%)",
          fontFamily: "sans-serif",
          padding: "0 72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "linear-gradient(135deg, #a810c7 0%, #3fa7ff 100%)",
              }}
            />
            <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#f5f5f7" }}>
              ShrotiHost
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#c9c9d4", maxWidth: 560 }}>
            Launch a website. Watch it happen.
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 36 }}>
            {["NVMe SSD", "LiteSpeed", "Free SSL", "Priority Support"].map((label) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  padding: "10px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.22)",
                  color: "#e6e6ee",
                  fontSize: 21,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            position: "relative",
            width: 400,
            height: 480,
          }}
        >
          {PLATES.map((plate) => (
            <div
              key={plate.y}
              style={{
                display: "flex",
                position: "absolute",
                left: 70,
                top: 90 + plate.y,
                width: 260,
                height: 260,
                borderRadius: 48,
                background: plate.fill,
                border: `2px solid ${plate.border}`,
                transform: "scale(1, 0.56) rotate(-45deg)",
              }}
            />
          ))}
          {/* Packet dot descending the stack */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              left: 192,
              top: 180,
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#3fa7ff",
              boxShadow: "0 0 24px 8px rgba(63,167,255,0.6)",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}

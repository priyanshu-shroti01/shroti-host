import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a0d24 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #a810c7 0%, #3fa7ff 100%)",
            }}
          />
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#f5f5f7" }}>
            ShrotiHost
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: "#a1a1ab" }}>
          Premium, Developer-Friendly Hosting
        </div>
      </div>
    ),
    { ...size }
  );
}

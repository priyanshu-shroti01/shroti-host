"use client";

import { useEffect } from "react";
import Link from "next/link";

// Root error boundary: only reached when the root layout itself fails, so it
// must render its own <html>/<body> — no app components, fonts, or providers
// are guaranteed to be available here. Colors mirror globals.css dark tokens.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0f",
          color: "#f5f5f7",
          fontFamily:
            "'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <main style={{ maxWidth: 560 }}>
          <p
            style={{
              display: "inline-block",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 999,
              padding: "4px 12px",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#c9c9d4",
              margin: 0,
            }}
          >
            Error
          </p>
          <h1 style={{ fontSize: 36, lineHeight: 1.15, letterSpacing: "-0.02em", margin: "16px 0 0" }}>
            ShrotiHost hit an unexpected error.
          </h1>
          <p style={{ fontSize: 18, color: "#c9c9d4", margin: "16px 0 0" }}>
            Your hosting and the rest of the site are unaffected. Reload to try again, or
            email support@shrotihost.in if it keeps happening.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 32,
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                background: "linear-gradient(135deg, #a810c7 0%, #3fa7ff 100%)",
                color: "#ffffff",
                border: 0,
                borderRadius: 999,
                padding: "12px 24px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                display: "inline-block",
                border: "2px solid rgba(255,255,255,0.22)",
                color: "#f5f5f7",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: 16,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to Home
            </Link>
          </div>
          {error.digest && (
            <p style={{ fontSize: 13, color: "#8c8c9a", marginTop: 24 }}>
              Error ID: <code>{error.digest}</code>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}

import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "AI Texture Generator - Free Seamless PBR Texture Maker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
/** Node runtime, because the brand mark is read from disk and inlined */
export const runtime = "nodejs";

/**
 * Brand mark for the share card.
 *
 * The OG route is prerendered at build time, so the logo has to be inlined as a
 * data URL - a remote fetch would fail because the domain is not live yet.
 */
function logoDataUrl(): string {
  const buf = readFileSync(join(process.cwd(), "public", "logo.png"));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

/** Social share card: primary keyword plus the differentiating selling points */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0d1424 0%, #1b2947 55%, #2b4a7a 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top right decoration: texture grid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 420,
            height: 420,
            display: "flex",
            opacity: 0.18,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              backgroundImage:
                "repeating-linear-gradient(90deg, #ffffff 0 2px, transparent 2px 26px), repeating-linear-gradient(0deg, #ffffff 0 2px, transparent 2px 26px)",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Brand mark: the site logo texture */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoDataUrl()}
            width={68}
            height={68}
            style={{
              width: 68,
              height: 68,
              borderRadius: 18,
              objectFit: "cover",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -0.5,
            }}
          >
            AI<span style={{ color: "#fb923c" }}>Texture</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 74,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.06,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            <span>AI Texture Generator</span>
            <span style={{ color: "#fb923c" }}>Seamless PBR Textures</span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#cdd6e6",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Text to tileable PBR materials - albedo, normal, roughness, AO and height maps.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {["No Upload", "No Watermark", "Commercial License", "Free Forever"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 24px",
                borderRadius: 999,
                border: "2px solid rgba(255,255,255,0.28)",
                background: "rgba(255,255,255,0.08)",
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}

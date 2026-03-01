import { ImageResponse } from "next/og";
import { SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/seo";

export const alt = "US Election Tracker – Live election results and electoral map";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Live election results • Electoral map • Senate, House & governor races
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 22,
            color: "#64748b",
          }}
        >
          election results · election tracker · primary results
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const alt = "Election live results – Texas primaries, election results, election tracker";
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
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Election Live Results
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#60a5fa",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Texas Primaries
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Texas election results today • Senate primary results • Live vote counts
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            color: "#64748b",
          }}
        >
          election live · texas election result · primary results
        </div>
      </div>
    ),
    { ...size }
  );
}

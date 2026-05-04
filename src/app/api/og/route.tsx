import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const score = searchParams.get("score") ?? "—";
  const fit = searchParams.get("fit") ?? "Analysed";
  const role = searchParams.get("role") ?? "Tech Role";

  const fitColors: Record<string, string> = {
    "Likely to shortlist": "#16a34a",
    "Competitive": "#ca8a04",
    "Borderline": "#ea580c",
    "Unlikely": "#dc2626",
  };
  const fitColor = fitColors[fit] ?? "#6b7280";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header bar */}
        <div style={{ background: "#2563eb", padding: "28px 48px", display: "flex", alignItems: "center" }}>
          <span style={{ color: "#ffffff", fontSize: "28px", fontWeight: "bold" }}>TalentApp.co.uk</span>
          <span style={{ color: "#93c5fd", fontSize: "18px", marginLeft: "16px" }}>Resume Analysis</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "48px", display: "flex", gap: "48px" }}>
          {/* Score */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: "180px" }}>
            <span style={{ fontSize: "96px", fontWeight: "bold", color: "#1e293b", lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: "18px", color: "#6b7280", marginTop: "8px" }}>ATS Score</span>
            <div style={{ width: "160px", height: "8px", background: "#e2e8f0", borderRadius: "4px", marginTop: "16px" }}>
              <div style={{ width: `${score}%`, height: "100%", background: "#2563eb", borderRadius: "4px" }} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: "1px", background: "#e2e8f0" }} />

          {/* Details */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
            <div>
              <span style={{ fontSize: "14px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>Role</span>
              <p style={{ fontSize: "24px", fontWeight: "600", color: "#1e293b", margin: "4px 0 0" }}>{role}</p>
            </div>
            <div>
              <span style={{ fontSize: "14px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>Recruiter Fit</span>
              <p style={{ fontSize: "28px", fontWeight: "700", color: fitColor, margin: "4px 0 0" }}>{fit}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "20px 48px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#6b7280", fontSize: "16px" }}>Know your chances before you apply</span>
          <span style={{ color: "#2563eb", fontSize: "16px", fontWeight: "600" }}>talentapp.co.uk</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

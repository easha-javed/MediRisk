import React from "react";

export default function ClinicalNotice() {
  return (
    <div
      role="note"
      style={{
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.22)",
        borderRadius: "12px",
        padding: "12px 14px",
      }}
    >
      <p style={{ color: "#fbbf24", fontSize: "0.78rem", fontWeight: 700, marginBottom: "5px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Clinical Safety Notice
      </p>
      <p style={{ color: "#e5e7eb", fontSize: "0.84rem", lineHeight: 1.6 }}>
        This tool provides AI-assisted risk estimation and education only. It is not a diagnosis. If you have chest pain,
        shortness of breath, fainting, or severe symptoms, seek urgent medical care immediately.
      </p>
    </div>
  );
}
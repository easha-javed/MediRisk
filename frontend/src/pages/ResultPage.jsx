import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart, ChevronRight, Info,
  MessageCircle, LayoutDashboard
} from "lucide-react";
import "../styles/HomePage.css";
import { predictHeartDisease } from "../services/predictionService";
import SidebarChat from "../components/SidebarChat";
import ClinicalNotice from "../components/ClinicalNotice";
import { savePredictionRecord } from "../services/historyService";

const RISK_CONFIG = {
  Low:      { color: "#10b981", glow: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", emoji: "✅", msg: "Your risk is within a healthy range. Keep up your healthy habits!" },
  Moderate: { color: "#f59e0b", glow: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.25)",  emoji: "⚠️", msg: "You have a moderate risk. Consider consulting a healthcare provider." },
  High:     { color: "#ef4444", glow: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.25)",   emoji: "🚨", msg: "Your risk is elevated. Please consult a doctor as soon as possible." },
};

export default function ResultPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const formData  = useMemo(() => location.state?.formData || {}, [location.state]);
  const [chatOpen, setChatOpen] = useState(false);
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    predictHeartDisease(formData)
      .then(r  => {
        setResult(r);        // ✅ alert() removed
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [formData]);

  const riskLevel = result?.riskLevel || result?.risk_level || "Moderate";
  const cfg = RISK_CONFIG[riskLevel] || RISK_CONFIG.Moderate;

  const safeResult = {
    ...result,
    riskFactors: result?.riskFactors || ["Data not available from model"],
  };
  const displayResult = safeResult;

  useEffect(() => {
    if (!result) {
      return;
    }

    savePredictionRecord({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      riskLevel,
      probability: displayResult.probability,
      riskFactors: displayResult.riskFactors,
      formData,
    }).catch(() => {
      // Best-effort history persistence; do not block user flow.
    });
  }, [result, riskLevel, displayResult.probability, displayResult.riskFactors, formData]);

  const uncertainty = getUncertaintyBand(displayResult.probability, riskLevel);

  function handleDownloadReport() {
    if (!result) {
      return;
    }

    const lines = [
      "MediRisk Clinical Support Report",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Risk Level: ${riskLevel}`,
      `Probability: ${displayResult.probability}%`,
      `Risk Factors: ${(displayResult.riskFactors || []).join(", ") || "No major factors detected"}`,
      "",
      "Submitted Data:",
      ...Object.entries(formData).map(([key, value]) => `- ${key}: ${value}`),
      "",
      "Clinical Safety Notice:",
      "This report is educational and not a diagnosis. Seek urgent medical care for severe symptoms.",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `medirisk-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background */}
      <div className="hero-background" style={{ position: "fixed" }}>
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="grid-pattern" />
      </div>

      {/* Navbar */}
      <nav style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(10,14,39,0.7)", backdropFilter: "blur(16px)",
      }}>
        <div className="logo"><div className="logo-icon">♦</div><span>MediRisk</span></div>
        <button onClick={() => navigate("/dashboard")} style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "none", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "10px", padding: "8px 16px",
          color: "#7a8494", fontSize: "0.85rem", cursor: "pointer", transition: "all 200ms",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#7a8494"; }}
        >
          <LayoutDashboard size={15} /> Dashboard
        </button>
      </nav>

      {/* Body */}
      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: "780px", margin: "0 auto", padding: "48px 24px 100px",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(236,72,153,0.12)", border: "1px solid rgba(236,72,153,0.25)",
            borderRadius: "20px", padding: "5px 14px", marginBottom: "16px",
          }}>
            <Heart size={13} color="#f472b6" />
            <span style={{ color: "#f472b6", fontSize: "0.75rem", fontWeight: 700 }}>
              Heart Disease Risk Assessment
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800, color: "#fff", marginBottom: "10px" }}>
            Prediction Result
          </h1>
          <p style={{ color: "#7a8494", fontSize: "0.9rem" }}>
            {loading ? "Analyzing your health data..." : result ? "Your AI-powered risk analysis is complete." : "Something went wrong."}
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "20px", padding: "60px 0",
          }}>
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              border: "3px solid rgba(99,102,241,0.2)",
              borderTop: "3px solid #6366f1",
              animation: "spin 1s linear infinite",
            }} />
            <p style={{ color: "#7a8494" }}>Running AI prediction model...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "24px",
          }}>
            <p style={{ color: "#f87171", fontWeight: 700, fontSize: "1rem", marginBottom: "8px" }}>⚠️ Prediction Failed</p>
            <p style={{ color: "#7a8494", fontSize: "0.875rem", marginBottom: "16px" }}>{error}</p>
            <p style={{ color: "#4a5568", fontSize: "0.8rem" }}>
              Make sure the Flask API is running on <code style={{ color: "#a5b4fc" }}>http://localhost:5000</code>
            </p>
            <button onClick={() => navigate("/predict")} style={{
              marginTop: "16px", background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.4)", borderRadius: "10px",
              padding: "10px 24px", color: "#a5b4fc", cursor: "pointer", fontWeight: 600,
            }}>
              Try Again
            </button>
          </div>
        )}

        {/* NO DATA */}
        {!loading && !error && !formData && (
          <div style={{
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "40px", textAlign: "center",
          }}>
            <p style={{ color: "#fff", fontWeight: 700, marginBottom: "8px" }}>No data submitted</p>
            <p style={{ color: "#7a8494", marginBottom: "20px" }}>Please fill in the prediction form first.</p>
            <button onClick={() => navigate("/predict")} className="btn-primary-lg">Go to Form</button>
          </div>
        )}

        {/* RESULTS */}
        {!loading && result && cfg && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Risk Level Banner */}
            <div style={{
              background: cfg.glow, border: `1px solid ${cfg.border}`,
              borderRadius: "16px", padding: "28px 32px",
              display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap",
            }}>
              <div style={{ fontSize: "3rem" }}>{cfg.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: cfg.color, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>
                  Risk Level
                </p>
                <p style={{ color: "#fff", fontWeight: 800, fontSize: "2rem", marginBottom: "4px" }}>
                  {riskLevel} Risk
                </p>
                <p style={{ color: "#7a8494", fontSize: "0.875rem" }}>{cfg.msg}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: cfg.color, fontWeight: 800, fontSize: "2.5rem", lineHeight: 1 }}>
                  {displayResult.probability}%
                </p>
                <p style={{ color: "#4a5568", fontSize: "0.75rem", marginTop: "4px" }}>Probability</p>
              </div>
            </div>

            {/* Probability Bar */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px", padding: "20px 24px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ color: "#b0b9d4", fontSize: "0.82rem", fontWeight: 600 }}>Risk Probability</span>
                <span style={{ color: cfg.color, fontWeight: 700 }}>{result.probability}%</span>
              </div>
              <div style={{ height: "10px", borderRadius: "5px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: "5px",
                  width: `${displayResult.probability}%`,
                  background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}aa)`,
                  transition: "width 1s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <span style={{ color: "#10b981", fontSize: "0.7rem" }}>Low</span>
                <span style={{ color: "#f59e0b", fontSize: "0.7rem" }}>Moderate</span>
                <span style={{ color: "#ef4444", fontSize: "0.7rem" }}>High</span>
              </div>
            </div>

            {/* Uncertainty & Calibration */}
            <ResultCard label="Uncertainty & Confidence" icon={<Info size={18} />} accentColor="#22d3ee">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                <div style={metricCardStyle}>
                  <p style={metricLabelStyle}>Estimated Confidence</p>
                  <p style={metricValueStyle}>{uncertainty.confidence}%</p>
                </div>
                <div style={metricCardStyle}>
                  <p style={metricLabelStyle}>Uncertainty Band</p>
                  <p style={metricValueStyle}>±{uncertainty.band}%</p>
                </div>
                <div style={metricCardStyle}>
                  <p style={metricLabelStyle}>Interpretation</p>
                  <p style={{ ...metricValueStyle, fontSize: "0.95rem", lineHeight: 1.45 }}>{uncertainty.interpretation}</p>
                </div>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "0.78rem", marginTop: "10px", lineHeight: 1.6 }}>
                Confidence is an educational estimate based on current model behavior and should not be treated as clinical certainty.
              </p>
            </ResultCard>

            {/* Key Risk Factors */}
            <ResultCard label="Key Risk Factors" icon={<Info size={18} />} accentColor="#8b5cf6">
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(displayResult.riskFactors || []).map((f, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px", padding: "12px 16px",
                  }}>
                    <div style={{
                      width: "24px", height: "24px", borderRadius: "6px", flexShrink: 0,
                      background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#a78bfa", fontSize: "0.7rem", fontWeight: 700,
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px", marginTop: "14px",
                background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)",
                borderRadius: "8px", padding: "10px 14px",
              }}>
                <span style={{ fontSize: "0.75rem" }}>ℹ️</span>
                <span style={{ color: "#6366f1", fontSize: "0.78rem", fontWeight: 600 }}>
                  Based on model trained on 319,795 CDC health survey records. Accuracy: {(result.modelAccuracy * 100).toFixed(1)}%
                </span>
              </div>
            </ResultCard>

            {/* AI Explanation */}
            <ResultCard label="AI Explanation" icon={<MessageCircle size={18} />} accentColor="#6366f1">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "14px",
                  padding: "18px 20px",
                }}>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", marginBottom: "8px" }}>
                    Why this result was shown
                  </p>
                  <p style={{ color: "#b0b9d4", fontSize: "0.88rem", lineHeight: 1.7 }}>
                    {buildRiskExplanation(riskLevel, displayResult.probability, displayResult.riskFactors)}
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                  <div style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.18)",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}>
                    <p style={{ color: "#10b981", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                      Why it matters
                    </p>
                    <p style={{ color: "#e5e7eb", fontSize: "0.86rem", lineHeight: 1.65 }}>
                      {buildWhyItMattersText(riskLevel)}
                    </p>
                  </div>

                  <div style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.18)",
                    borderRadius: "12px",
                    padding: "14px 16px",
                  }}>
                    <p style={{ color: "#f59e0b", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
                      How to lower it
                    </p>
                    <p style={{ color: "#e5e7eb", fontSize: "0.86rem", lineHeight: 1.65 }}>
                      {buildLowerRiskText(displayResult.riskFactors, formData)}
                    </p>
                  </div>
                </div>

                <div style={{
                  background: "rgba(99,102,241,0.07)",
                  border: "1px solid rgba(99,102,241,0.18)",
                  borderRadius: "10px",
                  padding: "12px 14px",
                }}>
                  <p style={{ color: "#a5b4fc", fontSize: "0.8rem", lineHeight: 1.6 }}>
                    This explanation is generated from your submitted health data and the current prediction result. If you want a more detailed natural-language answer, use the AI Assistant button below.
                  </p>
                </div>
              </div>
            </ResultCard>

            {/* Submitted Patient Data */}
            <ResultCard label="Submitted Patient Data" icon={<Heart size={18} />} accentColor="#10b981">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                {Object.entries(formData).map(([key, val], i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px", padding: "12px 14px",
                  }}>
                    <p style={{ color: "#5a6478", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600 }}>{val || "—"}</p>
                  </div>
                ))}
              </div>
            </ResultCard>

          </div>
        )}

        {/* Bottom Actions */}
        {!loading && (
          <div style={{ display: "flex", gap: "12px", marginTop: "36px", flexWrap: "wrap" }}>
            <button onClick={() => setChatOpen(true)} className="btn-primary-lg"
              style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}>
              <MessageCircle size={18} /> Ask AI Assistant
            </button>
            <button onClick={() => navigate("/predict")} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-xl)", padding: "1rem 2rem",
              color: "#b0b9d4", fontSize: "1.05rem", fontWeight: 600, cursor: "pointer", transition: "all 200ms",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >
              <ChevronRight size={18} /> New Prediction
            </button>
            <button onClick={() => navigate("/history")} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-xl)", padding: "1rem 2rem",
              color: "#b0b9d4", fontSize: "1.05rem", fontWeight: 600, cursor: "pointer", transition: "all 200ms",
            }}>
              <ChevronRight size={18} /> View History
            </button>
            <button onClick={handleDownloadReport} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: "rgba(99,102,241,0.16)", border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: "var(--radius-xl)", padding: "1rem 2rem",
              color: "#c7d2fe", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer", transition: "all 200ms",
            }}>
              <ChevronRight size={18} /> Download Report
            </button>
          </div>
        )}

        {!loading && (
          <div style={{ marginTop: "18px" }}>
            <ClinicalNotice />
          </div>
        )}
      </div>

      {chatOpen && (
        <SidebarChat
          onClose={() => setChatOpen(false)}
          context={{
            riskLevel,
            probability: displayResult.probability,
            riskFactors: displayResult.riskFactors,
            formData,
          }}
        />
      )}
    </div>
  );
}

function ResultCard({ label, icon, accentColor, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "18px", overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px", padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)",
      }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "8px",
          background: accentColor + "18", border: `1px solid ${accentColor}30`,
          display: "flex", alignItems: "center", justifyContent: "center", color: accentColor,
        }}>
          {icon}
        </div>
        <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{label}</h3>
      </div>
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

function LockedNote({ text }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px", marginTop: "14px",
      background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)",
      borderRadius: "8px", padding: "10px 14px",
    }}>
      <span style={{ fontSize: "0.75rem" }}>🔒</span>
      <span style={{ color: "#6366f1", fontSize: "0.78rem", fontWeight: 600 }}>{text}</span>
    </div>
  );
}

function buildRiskExplanation(riskLevel, probability, riskFactors) {
  const factors = (riskFactors || []).filter(Boolean);
  const factorText = factors.length > 0
    ? `The model detected ${factors.slice(0, 4).join(", ")}.`
    : "The model did not find any major risk factors in the submitted data.";

  const riskText = probability != null
    ? `Your result is ${riskLevel} risk with a probability of ${probability}%.`
    : `Your result is ${riskLevel} risk.`;

  return `${riskText} ${factorText}`;
}

function buildWhyItMattersText(riskLevel) {
  if (riskLevel === "High") {
    return "A high result means several inputs combined to push the prediction upward, so it is worth acting on quickly with a clinician.";
  }

  if (riskLevel === "Moderate") {
    return "A moderate result means your profile has enough risk signals that lifestyle changes and follow-up care can make a difference.";
  }

  return "A low result means the model did not see strong warning signs, but healthy habits still help keep risk down over time.";
}

function buildLowerRiskText(riskFactors, formData) {
  const factors = (riskFactors || []).filter(Boolean);

  if (factors.length === 0 || factors.includes("No major risk factors detected")) {
    return "Keep exercising regularly, eat a balanced diet, sleep well, and keep up with routine checkups so the risk stays low.";
  }

  const actions = [];

  if (factors.some(factor => /Smoking/i.test(factor)) || formData.smoking === "Yes") {
    actions.push("stop smoking or ask for support to quit");
  }
  if (factors.some(factor => /Alcohol/i.test(factor)) || formData.alcoholDrinking === "Yes") {
    actions.push("reduce heavy alcohol use");
  }
  if (factors.some(factor => /Physical Activity/i.test(factor)) || formData.physicalActivity === "No") {
    actions.push("increase regular physical activity");
  }
  if (factors.some(factor => /BMI/i.test(factor)) || Number(formData.bmi) > 30) {
    actions.push("work toward a healthier weight with diet and activity");
  }
  if (factors.some(factor => /Diabetes/i.test(factor)) || formData.diabetic === "Yes") {
    actions.push("keep blood sugar under control and follow medical advice");
  }
  if (factors.some(factor => /Kidney/i.test(factor)) || formData.kidneyDisease === "Yes") {
    actions.push("follow up on kidney disease care and medications");
  }
  if (factors.some(factor => /Walking/i.test(factor)) || formData.diffWalking === "Yes") {
    actions.push("ask a clinician about safe activity levels and mobility support");
  }
  if (factors.some(factor => /General Health/i.test(factor)) || ["Fair", "Poor"].includes(formData.genHealth)) {
    actions.push("schedule a checkup to review overall health and prevention steps");
  }

  if (actions.length === 0) {
    return "Focus on regular exercise, a heart-healthy diet, good sleep, and routine follow-up care to reduce future risk.";
  }

  return `Try to ${actions.slice(0, 3).join(", ")}, and keep tracking the rest of your health with a doctor.`;
}

function getUncertaintyBand(probability, riskLevel) {
  const p = Number(probability);
  if (Number.isNaN(p)) {
    return { confidence: 70, band: 15, interpretation: "Moderate certainty" };
  }

  // Heuristic confidence estimate: predictions closer to decision boundaries are less certain.
  const boundaryDistance = riskLevel === "Moderate"
    ? Math.min(Math.abs(p - 30), Math.abs(p - 70))
    : riskLevel === "Low"
      ? Math.abs(30 - p)
      : Math.abs(p - 70);

  const confidence = Math.max(55, Math.min(92, Math.round(60 + boundaryDistance * 0.6)));
  const band = Math.max(6, Math.min(18, Math.round((100 - confidence) / 2)));

  let interpretation = "Moderate certainty";
  if (confidence >= 85) {
    interpretation = "Higher certainty";
  } else if (confidence <= 65) {
    interpretation = "Lower certainty";
  }

  return { confidence, band, interpretation };
}

const metricCardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "12px 14px",
};

const metricLabelStyle = {
  color: "#64748b",
  fontSize: "0.72rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const metricValueStyle = {
  color: "#e2e8f0",
  fontSize: "1.1rem",
  fontWeight: 700,
};

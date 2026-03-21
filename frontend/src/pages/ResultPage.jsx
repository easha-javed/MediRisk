import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Heart, ChevronRight, AlertTriangle, Info,
  MessageCircle, X, LayoutDashboard, Clock
} from "lucide-react";
import "../styles/HomePage.css";

export default function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || {};
  const [chatOpen, setChatOpen] = useState(false);

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
          color: "#7a8494", fontSize: "0.85rem", cursor: "pointer",
          transition: "all 200ms",
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
          <h1 style={{
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800,
            color: "#fff", marginBottom: "10px",
          }}>
            Prediction Result
          </h1>
          <p style={{ color: "#7a8494", fontSize: "0.9rem" }}>
            Analysis complete — results will be fully available once the ML model is trained.
          </p>
        </div>

        {/* Coming Soon Banner */}
        <ComingSoonBanner
          icon={<Clock size={22} color="#f59e0b" />}
          color="#f59e0b"
          glow="rgba(245,158,11,0.12)"
          border="rgba(245,158,11,0.25)"
          title="Results available in coming iterations"
          desc="The ML model (Logistic Regression / Random Forest / SVM) is currently being trained on the UCI Heart Disease dataset. Once integrated, your actual risk prediction will appear here."
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>

          {/* Risk Level Card */}
          <ResultCard
            label="Risk Level"
            icon={<AlertTriangle size={18} />}
            accentColor="#ec4899"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              {["Low", "Medium", "High"].map(level => (
                <div key={level} style={{
                  flex: 1, minWidth: "100px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "12px", padding: "20px 16px",
                  textAlign: "center",
                  opacity: 0.45,
                }}>
                  <div style={{
                    width: "10px", height: "10px", borderRadius: "50%",
                    background: level === "Low" ? "#10b981" : level === "Medium" ? "#f59e0b" : "#ef4444",
                    margin: "0 auto 10px",
                  }} />
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{level}</p>
                  <p style={{ color: "#4a5568", fontSize: "0.72rem", marginTop: "4px" }}>Risk</p>
                </div>
              ))}
            </div>
            <LockedNote text="Exact risk level will be shown once model is integrated." />
          </ResultCard>

          {/* Key Risk Factors Card */}
          <ResultCard
            label="Key Risk Factors"
            icon={<Info size={18} />}
            accentColor="#8b5cf6"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Top contributing factor", "Second contributing factor", "Third contributing factor"].map((f, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px", padding: "12px 16px",
                  opacity: 0.4,
                }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "6px", flexShrink: 0,
                    background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#a78bfa", fontSize: "0.7rem", fontWeight: 700,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{
                    flex: 1, height: "10px", borderRadius: "5px",
                    background: "rgba(255,255,255,0.08)",
                  }} />
                </div>
              ))}
            </div>
            <LockedNote text="Top 3 SHAP-based risk factors will be displayed here (after training the model in coming iterations)." />
          </ResultCard>

          {/* AI Explanation Card */}
          <ResultCard
            label="AI Explanation"
            icon={<MessageCircle size={18} />}
            accentColor="#6366f1"
          >
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "12px", padding: "20px",
              opacity: 0.4,
            }}>
              {[70, 90, 55, 80, 45].map((w, i) => (
                <div key={i} style={{
                  height: "10px", borderRadius: "5px", marginBottom: "10px",
                  background: "rgba(255,255,255,0.08)",
                  width: w + "%",
                }} />
              ))}
            </div>
            <LockedNote text="LLM-generated natural language explanation will appear here (a functionality to be implemented in coming iterations)." />
          </ResultCard>

          {/* Patient Data Summary */}
          <ResultCard
            label="Submitted Patient Data"
            icon={<Heart size={18} />}
            accentColor="#10b981"
          >
            {Object.keys(formData).length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "10px",
              }}>
                {[
                  { label: "Age", value: formData.age + " yrs" },
                  { label: "Sex", value: formData.sex === "M" ? "Male" : "Female" },
                  { label: "Chest Pain", value: cpLabel(formData.chestPainType) },
                  { label: "Resting BP", value: formData.restingBP + " mmHg" },
                  { label: "Cholesterol", value: formData.cholesterol + " mg/dL" },
                  { label: "Fasting BS >120", value: formData.fastingBS === "1" ? "Yes" : "No" },
                  { label: "Resting ECG", value: formData.restingECG },
                  { label: "Max Heart Rate", value: formData.maxHR + " bpm" },
                  { label: "Exercise Angina", value: formData.exerciseAngina === "Y" ? "Yes" : "No" },
                  { label: "ST Depression", value: formData.oldpeak },
                  { label: "ST Slope", value: slopeLabel(formData.stSlope) },
                ].map((row, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "10px", padding: "12px 14px",
                  }}>
                    <p style={{ color: "#5a6478", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>
                      {row.label}
                    </p>
                    <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600 }}>{row.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#4a5568", fontSize: "0.875rem" }}>No data submitted.</p>
            )}
          </ResultCard>

        </div>

        {/* Bottom Actions */}
        <div style={{
          display: "flex", gap: "12px", marginTop: "36px", flexWrap: "wrap",
        }}>
          <button
            onClick={() => setChatOpen(true)}
            className="btn-primary-lg"
            style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center" }}
          >
            <MessageCircle size={18} /> Ask AI Assistant
          </button>
          <button
            onClick={() => navigate("/predict")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-xl)", padding: "1rem 2rem",
              color: "#b0b9d4", fontSize: "1.05rem", fontWeight: 600, cursor: "pointer",
              transition: "all 200ms",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >
            <ChevronRight size={18} /> New Prediction
          </button>
        </div>
      </div>

      {/* Chat Drawer */}
      {chatOpen && <ChatDrawer onClose={() => setChatOpen(false)} />}
    </div>
  );
}

// ── Coming Soon Banner ──────────────────────────────────────
function ComingSoonBanner({ icon, color, glow, border, title, desc }) {
  return (
    <div style={{
      background: glow, border: `1px solid ${border}`,
      borderRadius: "16px", padding: "20px 24px",
      display: "flex", gap: "16px", alignItems: "flex-start",
    }}>
      <div style={{
        width: "42px", height: "42px", borderRadius: "10px", flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}35`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>{title}</p>
        <p style={{ color: "#7a8494", fontSize: "0.83rem", lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Result Card wrapper ─────────────────────────────────────
function ResultCard({ label, icon, accentColor, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "18px", overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
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

// ── Locked note ─────────────────────────────────────────────
function LockedNote({ text }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      marginTop: "14px",
      background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.18)",
      borderRadius: "8px", padding: "10px 14px",
    }}>
      <span style={{ fontSize: "0.75rem" }}>🔒</span>
      <span style={{ color: "#6366f1", fontSize: "0.78rem", fontWeight: 600 }}>{text}</span>
    </div>
  );
}

// ── Chat Drawer ─────────────────────────────────────────────
function ChatDrawer({ onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
        }}
      />

      {/* Drawer */}
      <div style={{
        position: "fixed", right: 0, top: 0, bottom: 0, zIndex: 50,
        width: "min(420px, 100vw)",
        background: "rgba(15,18,40,0.98)",
        borderLeft: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column",
        boxShadow: "-20px 0 60px rgba(0,0,0,0.4)",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "10px",
              background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <MessageCircle size={17} color="#818cf8" />
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>AI Assistant</p>
              <p style={{ color: "#4a5568", fontSize: "0.72rem" }}>Will be implemented in later iterations</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px", width: "32px", height: "32px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#7a8494", cursor: "pointer", transition: "all 200ms",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#7a8494"; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "32px 28px", gap: "24px",
        }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MessageCircle size={32} color="#818cf8" />
          </div>

          <div style={{ textAlign: "center" }}>
            <h3 style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", marginBottom: "10px" }}>
              AI Chat Assistant
            </h3>
            <p style={{ color: "#7a8494", fontSize: "0.875rem", lineHeight: 1.7, maxWidth: "300px" }}>
              Ask questions like <span style={{ color: "#a5b4fc" }}>"Why is my risk high?"</span> or <span style={{ color: "#a5b4fc" }}>"How can I reduce my cholesterol?"</span> and get AI-powered answers.
            </p>
          </div>

          <div style={{
            width: "100%", background: "rgba(99,102,241,0.08)",
            border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px",
            padding: "20px",
          }}>
            <p style={{
              color: "#6366f1", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px",
            }}>
              Planned features
            </p>
            {[
              "Natural language Q&A about your results",
              "Risk factor explanations in plain English",
              "Personalized health recommendations",
              "Powered by LLM with prompt engineering",
            ].map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px",
              }}>
                <div style={{
                  width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                  background: "#6366f1",
                }} />
                <span style={{ color: "#b0b9d4", fontSize: "0.82rem" }}>{f}</span>
              </div>
            ))}
          </div>

          <div style={{
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "10px", padding: "12px 16px",
            display: "flex", alignItems: "center", gap: "10px", width: "100%",
          }}>
            <Clock size={15} color="#f59e0b" style={{ flexShrink: 0 }} />
            <p style={{ color: "#d97706", fontSize: "0.8rem", fontWeight: 600 }}>
              This feature will be developed in coming Iterations.
            </p>
          </div>
        </div>

        {/* Fake input — disabled */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "12px 16px",
            opacity: 0.45, cursor: "not-allowed",
          }}>
            <input disabled placeholder="Ask a question about your results..."
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "#fff", fontSize: "0.875rem", cursor: "not-allowed",
              }}
            />
            <div style={{
              width: "30px", height: "30px", borderRadius: "8px",
              background: "rgba(99,102,241,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ChevronRight size={15} color="#818cf8" />
            </div>
          </div>
          <p style={{ textAlign: "center", color: "#4a5568", fontSize: "0.72rem", marginTop: "8px" }}>
            Chat disabled — available in Iteration 3
          </p>
        </div>
      </div>
    </>
  );
}

// ── Label helpers ──────────────────────────────────────────
function cpLabel(v) {
  return { ATA: "Atypical Angina", NAP: "Non-Anginal", ASY: "Asymptomatic", TA: "Typical Angina" }[v] || v;
}
function slopeLabel(v) {
  return { Up: "Upsloping", Flat: "Flat", Down: "Downsloping" }[v] || v;
}
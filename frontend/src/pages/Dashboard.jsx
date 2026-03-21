import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Activity, Heart, Shield, TrendingUp, ChevronRight, Brain, Zap } from "lucide-react";
import "../styles/HomePage.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: <Heart size={22} />,
      label: "Heart Disease Risk",
      value: "—",
      sub: "No prediction yet",
      color: "#ec4899",
      glow: "rgba(236,72,153,0.15)",
    },
    {
      icon: <TrendingUp size={22} />,
      label: "Diabetes Risk",
      value: "—",
      sub: "No prediction yet",
      color: "#6366f1",
      glow: "rgba(99,102,241,0.15)",
    },
    {
      icon: <Shield size={22} />,
      label: "Overall Status",
      value: "Pending",
      sub: "Run analysis to update",
      color: "#10b981",
      glow: "rgba(16,185,129,0.15)",
    },
    {
      icon: <Brain size={22} />,
      label: "AI Insights",
      value: "—",
      sub: "Available after analysis",
      color: "#8b5cf6",
      glow: "rgba(139,92,246,0.15)",
    },
  ];

  const steps = [
    { number: "01", title: "Enter Patient Data", desc: "Fill in age, BP, cholesterol, glucose, BMI" },
    { number: "02", title: "AI Analysis", desc: "ML model predicts your risk level instantly" },
    { number: "03", title: "Get Insights", desc: "See Low / Medium / High risk with explanations" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background */}
      <div className="hero-background" style={{ position: "fixed" }}>
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="grid-pattern" />
      </div>

      {/* Navbar */}
      <nav style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 48px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(10,14,39,0.7)",
        backdropFilter: "blur(16px)",
      }}>
        <div className="logo">
          <div className="logo-icon">♦</div>
          <span>MediRisk</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{
            color: "#4a5568",
            fontSize: "0.8rem",
            fontVariantNumeric: "tabular-nums",
          }}>
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>

          <div style={{
            width: "1px",
            height: "20px",
            background: "rgba(255,255,255,0.1)",
          }} />

          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "10px",
              padding: "8px 16px",
              color: "#f87171",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.18)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
            }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </nav>

      {/* Page Body */}
      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "52px 28px 80px",
      }}>

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: "52px",
        }}>
          <div>
            <p style={{
              color: "#6366f1",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}>
              {greeting}
            </p>
            <h1 style={{
              fontSize: "clamp(2rem, 5vw, 2.8rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: "12px",
            }}>
              Risk Analysis Dashboard
            </h1>
            <p style={{ color: "#7a8494", fontSize: "0.95rem", maxWidth: "480px", lineHeight: 1.7 }}>
              Start a prediction to see a personalized disease risk profile.
            </p>
          </div>

          {/* Big CTA button */}
          <button
            onClick={() => navigate("/predict")}
            className="btn-primary-lg"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
              boxShadow: "0 0 40px rgba(99,102,241,0.35)",
            }}
          >
            <Zap size={20} />
            Analyze Now
          </button>
        </div>

        {/* How It Works strip */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "20px",
          padding: "36px 40px",
          marginBottom: "24px",
        }}>
          <p style={{
            color: "#6366f1",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}>
            How it works
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
          }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1,
                  flexShrink: 0,
                }}>
                  {step.number}
                </span>
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", marginBottom: "4px" }}>
                    {step.title}
                  </p>
                  <p style={{ color: "#5a6478", fontSize: "0.82rem", lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: "18px",
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#818cf8",
              flexShrink: 0,
            }}>
              <Activity size={22} />
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", marginBottom: "2px" }}>
                Start your first prediction
              </p>
              <p style={{ color: "#5a6478", fontSize: "0.82rem" }}>
                Takes less than 2 minutes — no backend required yet
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/predict")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.4)",
              borderRadius: "12px",
              padding: "10px 20px",
              color: "#a5b4fc",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 200ms",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.35)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.2)";
              e.currentTarget.style.color = "#a5b4fc";
            }}
          >
            Get Started
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
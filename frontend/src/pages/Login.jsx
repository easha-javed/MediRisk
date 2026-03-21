import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, Eye, EyeOff } from "lucide-react";
import "../styles/HomePage.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    
      navigate("/dashboard");
  };

  return (
    <div
      className="auth-page"
      style={{ background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)" }}
    >
      <div className="hero-background" style={{ position: "fixed" }}>
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="grid-pattern" />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "880px",
          margin: "0 auto",
          padding: "40px 20px",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "24px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1.6fr",
          }}
        >
          {/* ── Left Panel ── */}
          <div
            style={{
              background:
                "linear-gradient(160deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 100%)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              padding: "48px 36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div className="logo" style={{ marginBottom: "48px" }}>
                <div className="logo-icon">♦</div>
                <span>MediRisk</span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                  fontWeight: 800,
                  lineHeight: 1.3,
                  marginBottom: "16px",
                  color: "#fff",
                }}
              >
                Welcome back to your health dashboard
              </h2>
              <p style={{ color: "#b0b9d4", fontSize: "0.9rem", lineHeight: 1.7 }}>
                Sign in to access your personalized risk predictions and AI-powered health insights.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: "📈", text: "Track your risk over time" },
                { icon: "🤖", text: "AI explanations for every result" },
                { icon: "🔐", text: "Secure & private always" },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                  <span style={{ color: "#b0b9d4", fontSize: "0.875rem", fontWeight: 500 }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div
            style={{
              padding: "48px 44px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ marginBottom: "36px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
                Sign In
              </h3>
              <p style={{ color: "#7a8494", fontSize: "0.875rem" }}>
                Enter your credentials to continue
              </p>
            </div>

            {error && (
              <div className="auth-error" style={{ marginBottom: "20px" }}>
                ⚠ {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <div>
                <label style={labelStyle}>Email</label>
                <FieldInput
                  icon={<Mail size={16} />}
                  type="email"
                  placeholder="sarah@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>Password</label>
                <FieldInput
                  icon={<Lock size={16} />}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#7a8494",
                        cursor: "pointer",
                        display: "flex",
                        padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </div>

              <button
                type="submit"
                className="btn-primary-lg"
                disabled={loading}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "8px",
                  opacity: loading ? 0.75 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <span
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>Sign In <ArrowRight size={18} /></>
                )}
              </button>
            </form>

            <p style={{ marginTop: "24px", textAlign: "center", fontSize: "0.875rem", color: "#7a8494" }}>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">Create Account</Link>
            </p>

            <p style={{ marginTop: "12px", textAlign: "center", fontSize: "11px", color: "#4a5568" }}>
              Credential verification will be active once backend is connected.
            </p>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#b0b9d4",
  letterSpacing: "0.03em",
  marginBottom: "6px",
};

function FieldInput({ icon, suffix, ...props }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: "10px 12px",
        transition: "border-color 200ms",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
    >
      <span style={{ color: "#7a8494", display: "flex", flexShrink: 0 }}>{icon}</span>
      <input
        {...props}
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#fff",
          fontSize: "0.875rem",
          minWidth: 0,
        }}
      />
      {suffix}
    </div>
  );
}
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, User, Briefcase, Calendar, Eye, EyeOff } from "lucide-react";
import "../styles/HomePage.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    occupation: "",
    dob: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)" }}>

      {/* Background orbs matching landing page */}
      <div className="hero-background" style={{ position: "fixed" }}>
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="grid-pattern" />
      </div>

      <div style={{
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
      }}>
        <div style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "24px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
        }}>

          {/* ── Left Panel ── */}
          <div style={{
            background: "linear-gradient(160deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 100%)",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            padding: "48px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}>
            {/* Logo */}
            <div>
              <div className="logo" style={{ marginBottom: "48px" }}>
                <div className="logo-icon">♦</div>
                <span>MediRisk</span>
              </div>

              <h2 style={{
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                fontWeight: 800,
                lineHeight: 1.3,
                marginBottom: "16px",
                color: "#fff",
              }}>
                Start your health journey today
              </h2>

              <p style={{ color: "#b0b9d4", fontSize: "0.9rem", lineHeight: 1.7 }}>
                Create your free account and get AI-powered disease risk predictions with human-readable explanations.
              </p>
            </div>

            {/* Feature bullets */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: "🧠", text: "AI-powered risk analysis" },
                { icon: "🔒", text: "Your data stays private" },
                { icon: "📊", text: "Explainable predictions" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                }}>
                  <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                  <span style={{ color: "#b0b9d4", fontSize: "0.875rem", fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Panel — Form ── */}
          <div style={{ padding: "48px 44px" }}>

            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
                Create Account
              </h3>
              <p style={{ color: "#7a8494", fontSize: "0.875rem" }}>
                Fill in your details to get started
              </p>
            </div>

            {error && (
              <div className="auth-error" style={{ marginBottom: "20px" }}>
                ⚠ {error}
              </div>
            )}
            {success && (
              <div className="auth-success" style={{ marginBottom: "20px" }}>
                ✓ {success}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0" }}>

              {/* Row 1: Name + Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <FormField label="Full Name">
                  <FieldInput
                    icon={<User size={16} />}
                    type="text"
                    name="name"
                    placeholder="Sarah Khan"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField label="Email">
                  <FieldInput
                    icon={<Mail size={16} />}
                    type="email"
                    name="email"
                    placeholder="sarah@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </FormField>
              </div>

              {/* Row 2: Occupation + DOB */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <FormField label="Occupation">
                  <FieldInput
                    icon={<Briefcase size={16} />}
                    type="text"
                    name="occupation"
                    placeholder="Doctor, Engineer..."
                    value={form.occupation}
                    onChange={handleChange}
                    required
                  />
                </FormField>

                <FormField label="Date of Birth">
                  <FieldInput
                    icon={<Calendar size={16} />}
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    required
                  />
                </FormField>
              </div>

              {/* Row 3: Password + Confirm */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "28px" }}>
                <FormField label="Password">
                  <FieldInput
                    icon={<Lock size={16} />}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ background: "none", border: "none", color: "#7a8494", cursor: "pointer", display: "flex", padding: 0 }}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />
                </FormField>

                <FormField label="Confirm Password">
                  <FieldInput
                    icon={<Lock size={16} />}
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    suffix={
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        style={{ background: "none", border: "none", color: "#7a8494", cursor: "pointer", display: "flex", padding: 0 }}
                      >
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />
                </FormField>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary-lg"
                disabled={loading}
                style={{
                  width: "100%",
                  opacity: loading ? 0.75 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: "16px", height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.7s linear infinite",
                    }} />
                    Creating account...
                  </>
                ) : (
                  <>Create Account <ArrowRight size={18} /></>
                )}
              </button>

            </form>

            {/* Footer */}
            <p style={{
              marginTop: "20px",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#7a8494",
            }}>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>

            <p style={{
              marginTop: "12px",
              textAlign: "center",
              fontSize: "11px",
              color: "#4a5568",
            }}>
             
            </p>

          </div>
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Small helper components ── */

function FormField({ label, children }) {
  return (
    <div>
      <label style={{
        display: "block",
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#b0b9d4",
        marginBottom: "6px",
        letterSpacing: "0.03em",
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function FieldInput({ icon, suffix, ...props }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "10px",
      padding: "10px 12px",
      transition: "border-color 200ms",
    }}
      onFocus={(e) => e.currentTarget.style.borderColor = "#6366f1"}
      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
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